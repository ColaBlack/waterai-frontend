import { useState, useCallback, useRef, useReducer, type MutableRefObject } from 'react'
import type { MessageInstance } from 'antd/es/message/interface'
import { SSEClient } from '@/lib/utils/sse'
import { getChatRoomMessages } from '@/lib/api/chatService/api/chatRoomController'
import { ChatMessage, ModelConfig } from '@/lib/types/chat'
import { MESSAGE_CONSTANTS, STORAGE_KEYS, API_CONSTANTS, TIME_CONSTANTS } from '@/lib/constants/chat'
import { BASE_URL } from '@/lib/utils/request'
import { useUserStore } from '@/lib/store/userStore'

interface MessagesState {
  messages: ChatMessage[]
  renderCounter: number
}

import type { SSEMessageData } from '@/lib/utils/sse'

type MessagesAction = 
  | { type: 'SET_MESSAGES'; payload: ChatMessage[] }
  | { type: 'APPEND_TO_LAST_AI'; payload: string }
  | { type: 'UPDATE_LAST_AI_STREAMING'; payload: boolean }
  | { type: 'UPDATE_LAST_AI_MESSAGE'; payload: SSEMessageData }
  | { type: 'CLEAR_MESSAGES' }

function createMessagesReducer(messagesRef: MutableRefObject<ChatMessage[]>) {
  return function messagesReducer(state: MessagesState, action: MessagesAction): MessagesState {
    let newState: MessagesState
    
    switch (action.type) {
      case 'SET_MESSAGES':
        newState = {
          messages: action.payload,
          renderCounter: state.renderCounter + 1
        }
        messagesRef.current = action.payload
        return newState
      
      case 'APPEND_TO_LAST_AI': {
        const lastIndex = state.messages.length - 1
        if (lastIndex >= 0 && state.messages[lastIndex].role === 'ai') {
          const newMessages = [...state.messages]
          newMessages[lastIndex] = {
            ...newMessages[lastIndex],
            content: newMessages[lastIndex].content + action.payload,
            timestamp: Date.now()
          }
          newState = {
            messages: newMessages,
            renderCounter: state.renderCounter + 1
          }
          messagesRef.current = newMessages
          return newState
        }
        return state
      }
      
      case 'UPDATE_LAST_AI_STREAMING': {
        const lastIndex = state.messages.length - 1
        if (lastIndex >= 0 && state.messages[lastIndex].role === 'ai') {
          const newMessages = [...state.messages]
          newMessages[lastIndex] = {
            ...newMessages[lastIndex],
            isStreaming: action.payload
          }
          newState = {
            messages: newMessages,
            renderCounter: state.renderCounter + 1
          }
          messagesRef.current = newMessages
          return newState
        }
        return state
      }
      
      case 'UPDATE_LAST_AI_MESSAGE': {
        const lastIndex = state.messages.length - 1
        if (lastIndex >= 0 && state.messages[lastIndex].role === 'ai') {
          const newMessages = [...state.messages]
          const currentMessage = newMessages[lastIndex]
          
          let textToAppend = ''
          
          if (action.payload.text !== undefined && action.payload.text !== null) {
            if (typeof action.payload.text === 'string') {
              textToAppend = action.payload.text
            } else if (typeof action.payload.text === 'object') {
              textToAppend = ''
            } else {
              textToAppend = String(action.payload.text)
            }
          }
          
          if (textToAppend) {
            const trimmed = textToAppend.trim()
            const currentContent = typeof currentMessage.content === 'string' ? currentMessage.content : String(currentMessage.content || '')
            
            if (trimmed.startsWith('{') && trimmed.endsWith('}') && 
                !currentContent.includes('```json') &&
                !trimmed.includes('\n') &&
                trimmed.length < 200) {
              textToAppend = ''
            }
          }
          
          const currentContent = typeof currentMessage.content === 'string' ? currentMessage.content : String(currentMessage.content || '')
          const newContent = textToAppend ? currentContent + textToAppend : currentContent
          
          const contentChanged = newContent !== currentContent
          
          let newMetadata = currentMessage.metadata ? { ...currentMessage.metadata } : {}
          let metadataChanged = false
          
          if (action.payload.metadata) {
            if (action.payload.metadata.toolCalls) {
              const existingToolCalls = newMetadata.toolCalls || []
              const newToolCalls = action.payload.metadata.toolCalls
              
              const toolCallMap = new Map<string, typeof existingToolCalls[0]>()
              
              existingToolCalls.forEach(tc => {
                const key = tc.id || `${tc.name}_${tc.arguments}`
                toolCallMap.set(key, tc)
              })
              
              newToolCalls.forEach(tc => {
                const key = tc.id || `${tc.name}_${tc.arguments}`
                const existing = toolCallMap.get(key)
                
                if (existing) {
                  const hasChanges = 
                    (tc.result !== undefined && tc.result !== existing.result) ||
                    (tc.status && tc.status !== existing.status) ||
                    (tc.error && tc.error !== existing.error)
                  
                  if (hasChanges) {
                    metadataChanged = true
                    toolCallMap.set(key, {
                      ...existing,
                      ...tc,
                      result: tc.result !== undefined ? tc.result : existing.result,
                      status: tc.status || existing.status,
                      error: tc.error || existing.error
                    })
                  }
                } else {
                  metadataChanged = true
                  toolCallMap.set(key, tc)
                }
              })
              
              if (metadataChanged || toolCallMap.size !== existingToolCalls.length) {
                newMetadata.toolCalls = Array.from(toolCallMap.values())
              }
            }
            
            if (action.payload.metadata.retrievedDocuments) {
              const existingDocs = newMetadata.retrievedDocuments || []
              const newDocs = action.payload.metadata.retrievedDocuments
              
              if (newDocs.length > 0 && newDocs.length !== existingDocs.length) {
                metadataChanged = true
                const docMap = new Map<string, typeof existingDocs[0]>()
                
                existingDocs.forEach(doc => {
                  const key = doc.id || `${doc.source}_${doc.content?.substring(0, 50)}`
                  docMap.set(key, doc)
                })
                
                newDocs.forEach(doc => {
                  const key = doc.id || `${doc.source}_${doc.content?.substring(0, 50)}`
                  if (!docMap.has(key)) {
                    docMap.set(key, doc)
                  }
                })
                
                newMetadata.retrievedDocuments = Array.from(docMap.values())
              }
            }
            
            if (action.payload.metadata.finishReason && action.payload.metadata.finishReason !== newMetadata.finishReason) {
              metadataChanged = true
              newMetadata.finishReason = action.payload.metadata.finishReason
            }
            if (action.payload.metadata.modelId && action.payload.metadata.modelId !== newMetadata.modelId) {
              metadataChanged = true
              newMetadata.modelId = action.payload.metadata.modelId
            }
            if (action.payload.metadata.usage) {
              const usageChanged = !newMetadata.usage || 
                newMetadata.usage.promptTokens !== action.payload.metadata.usage.promptTokens ||
                newMetadata.usage.completionTokens !== action.payload.metadata.usage.completionTokens ||
                newMetadata.usage.totalTokens !== action.payload.metadata.usage.totalTokens
              if (usageChanged) {
                metadataChanged = true
                newMetadata.usage = action.payload.metadata.usage
              }
            }
          }
          
          const thinkingProcessChanged = action.payload.thinkingProcess && 
            action.payload.thinkingProcess !== currentMessage.thinkingProcess
          
          if (!contentChanged && !metadataChanged && !thinkingProcessChanged) {
            return state
          }
          
          newMessages[lastIndex] = {
            ...currentMessage,
            content: newContent,
            metadata: Object.keys(newMetadata).length > 0 ? newMetadata : undefined,
            thinkingProcess: action.payload.thinkingProcess || currentMessage.thinkingProcess,
            timestamp: (contentChanged || thinkingProcessChanged) ? Date.now() : currentMessage.timestamp
          }
          
          newState = {
            messages: newMessages,
            renderCounter: (contentChanged || thinkingProcessChanged) ? state.renderCounter + 1 : state.renderCounter
          }
          messagesRef.current = newMessages
          return newState
        }
        return state
      }
      
      case 'CLEAR_MESSAGES':
        newState = {
          messages: [],
          renderCounter: state.renderCounter + 1
        }
        messagesRef.current = []
        return newState
      
      default:
        return state
    }
  }
}

export function useChatMessages(
  chatId: string,
  messageApi: MessageInstance,
  onFirstMessage?: (prompt: string) => Promise<string | null>,
  onMessageSent?: () => void
) {
  const { loginUser } = useUserStore()
  const messagesRef = useRef<ChatMessage[]>([])
  const messagesReducerRef = useRef(createMessagesReducer(messagesRef))
  const [messagesState, dispatch] = useReducer(messagesReducerRef.current, {
    messages: [],
    renderCounter: 0
  })
  const [userInput, setUserInput] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const sseClientRef = useRef<SSEClient | null>(null)
  const isSendingFirstMessageRef = useRef(false)

  const loadHistoryMessagesFromLocal = useCallback(() => {
    if (!chatId) return

    if (typeof window === 'undefined') {
      dispatch({ type: 'SET_MESSAGES', payload: [] })
      return
    }

    try {
      const historyKey = `${STORAGE_KEYS.CHAT_HISTORY_PREFIX}${chatId}`
      const historyStr = localStorage.getItem(historyKey)
      
      if (historyStr) {
        const loadedMessages = JSON.parse(historyStr)
        dispatch({ type: 'SET_MESSAGES', payload: loadedMessages })
      } else {
        dispatch({ type: 'SET_MESSAGES', payload: [] })
      }
    } catch (error) {
      dispatch({ type: 'SET_MESSAGES', payload: [] })
    }
  }, [chatId])

  const loadHistoryMessages = useCallback(async () => {
    if (!chatId) return

    if (isSendingFirstMessageRef.current) {
      return
    }

    if (typeof window === 'undefined') {
      return
    }
    
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    
    if (!token || !userId) {
      loadHistoryMessagesFromLocal()
      return
    }

    try {
      const response = await getChatRoomMessages({ 
        chatroomId: chatId, 
        userId: parseInt(userId) 
      } as API.getChatRoomMessagesParams)
      
      if (response.status === 200 && response.data.code === API_CONSTANTS.SUCCESS_CODE) {
        const messageList = response.data.data || []
        
        const convertedMessages: ChatMessage[] = messageList.map((msg: API.ChatMemoryVO) => {
          const msgType = (msg.type || '').toLowerCase().trim()
          const isUserMessage = ['user', 'human'].includes(msgType)
          const role = isUserMessage ? 'user' : 'ai'
          
          return {
            role: role as 'user' | 'ai',
            content: msg.content || '',
            timestamp: msg.timestamp ? new Date(msg.timestamp).getTime() : Date.now(),
            isStreaming: false
          }
        })
        
        if (convertedMessages.length > 0) {
        dispatch({ type: 'SET_MESSAGES', payload: convertedMessages })
        messagesRef.current = convertedMessages
        saveHistoryMessages(convertedMessages)
        } else if (messagesRef.current.length === 0) {
          dispatch({ type: 'SET_MESSAGES', payload: [] })
          messagesRef.current = []
        }
        return
      }
    } catch (error: any) {
      const status = error?.response?.status
      const errorData = error?.response?.data
      const errorMessage = errorData?.message || error?.message || ''
      
      const isChatRoomNotExists = 
        status === 404 ||
        status === 401 ||
        errorMessage.includes('聊天室不存在') ||
        errorMessage.includes('聊天室') && errorMessage.includes('不存在')
      
      if (!isChatRoomNotExists) {
      }
    }
    
    if (!isSendingFirstMessageRef.current) {
    loadHistoryMessagesFromLocal()
    }
  }, [chatId, loadHistoryMessagesFromLocal])

  const saveHistoryMessages = useCallback((msgs: ChatMessage[]) => {
    if (!chatId) return

    if (typeof window === 'undefined') return

    try {
      const historyKey = `${STORAGE_KEYS.CHAT_HISTORY_PREFIX}${chatId}`
      localStorage.setItem(historyKey, JSON.stringify(msgs))
    } catch (error) {
    }
  }, [chatId])

  const sendMessage = useCallback(async (config: ModelConfig) => {
    const prompt = userInput.trim()

    if (!prompt || isConnecting) {
      return
    }

    if (typeof window === 'undefined') {
      return
    }
    
    const token = localStorage.getItem('token')
    if (!token) {
      messageApi.error('请先登录后再发送消息')
      window.location.href = '/user/login?redirect=' + encodeURIComponent(window.location.href)
      return
    }

    if (prompt.length > MESSAGE_CONSTANTS.MAX_LENGTH) {
      messageApi.error(`提问长度不能超过 ${MESSAGE_CONSTANTS.MAX_LENGTH} 字`)
      return
    }

    if (!chatId) {
      messageApi.error('聊天室ID无效，请刷新页面重试')
      return
    }

    const isFirstMessage = messagesState.messages.length === 0
    let actualChatId = chatId
    
    if (isFirstMessage) {
      isSendingFirstMessageRef.current = true
    }
    
    if (isFirstMessage && onFirstMessage) {
      try {
        const newChatId = await onFirstMessage(prompt)
        if (newChatId) {
          actualChatId = newChatId
        }
      } catch (error) {
      }
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: prompt,
      timestamp: Date.now()
    }

    const newMessages = [...messagesState.messages, userMessage]
    dispatch({ type: 'SET_MESSAGES', payload: newMessages })
    setUserInput('')

    const aiMessage: ChatMessage = {
      role: 'ai',
      content: '',
      timestamp: Date.now(),
      isStreaming: true
    }

    const messagesWithAI = [...newMessages, aiMessage]
    dispatch({ type: 'SET_MESSAGES', payload: messagesWithAI })
    const aiMessageIndex = messagesWithAI.length - 1

    setIsConnecting(true)
    setIsLoading(true)

    try {
      let requestData: any
      let endpoint: string
      
      if (config.isVision) {
        endpoint = '/ai/chat/vision'
        requestData = {
          userPrompt: prompt,
          chatId: actualChatId,
          chatRoomId: actualChatId, // 聊天室编号，如果不存在则后端自动创建
          imageUrls: config.imageUrls || [],
          visionModelName: config.model,
          enableThinking: config.enableThinking || false
        }
      } else {
        endpoint = '/ai/chat'
        requestData = {
          userPrompt: prompt,
          chatId: actualChatId,
          chatRoomId: actualChatId,
          modelName: config.model,
          enableThinking: config.enableThinking || false
        }
      }

      const sseClient = new SSEClient()
      sseClientRef.current = sseClient

      await sseClient.connect(
        `${BASE_URL}${endpoint}`,
        requestData,
        {
          onMessage: (data: SSEMessageData) => {
            dispatch({ type: 'UPDATE_LAST_AI_MESSAGE', payload: data })
          },
          onOpen: () => {
            setIsLoading(false)
            setTimeout(() => {
              saveHistoryMessages(messagesRef.current)
            }, 0)
          },
          onError: (error: Error) => {
            setIsConnecting(false)
            setIsLoading(false)
            dispatch({ type: 'UPDATE_LAST_AI_STREAMING', payload: false })
            
            const errorMessage = error.message || ''
            if (errorMessage.includes('UNAUTHORIZED')) {
              messageApi.error('登录已过期，请重新登录')
              if (typeof window !== 'undefined') {
                setTimeout(() => {
                  window.location.href = '/user/login?redirect=' + encodeURIComponent(window.location.href)
                }, 1500)
              }
            } else if (errorMessage.includes('FORBIDDEN')) {
              messageApi.error('权限不足，无法发送消息')
            } else {
              messageApi.error('连接失败，请稍后重试')
            }
            
            setTimeout(() => {
              saveHistoryMessages(messagesRef.current)
              isSendingFirstMessageRef.current = false
            }, 0)
          },
          onClose: () => {
            setIsConnecting(false)
            setIsLoading(false)
            dispatch({ type: 'UPDATE_LAST_AI_STREAMING', payload: false })
            setTimeout(() => {
              saveHistoryMessages(messagesRef.current)
              isSendingFirstMessageRef.current = false
              
              if (onMessageSent) {
                setTimeout(() => {
                  onMessageSent()
                }, TIME_CONSTANTS.REFRESH_DELAY)
              }
            }, 0)
          },
        }
      )
    } catch (error) {
      setIsConnecting(false)
      setIsLoading(false)
      dispatch({ type: 'UPDATE_LAST_AI_STREAMING', payload: false })
      messageApi.error('发送失败，请稍后重试')
      isSendingFirstMessageRef.current = false
    }
  }, [chatId, userInput, isConnecting, messagesState.messages.length, onFirstMessage, onMessageSent, saveHistoryMessages, messageApi])

  const closeConnection = useCallback(() => {
    if (sseClientRef.current) {
      sseClientRef.current.close()
      sseClientRef.current = null
    }
  }, [])

  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' })
    isSendingFirstMessageRef.current = false
  }, [])

  return {
    messages: messagesState.messages,
    renderCounter: messagesState.renderCounter,
    userInput,
    isConnecting,
    isLoading,
    setUserInput,
    sendMessage,
    loadHistoryMessages,
    closeConnection,
    clearMessages
  }
}

