import { useState, useCallback, useRef, useReducer } from 'react'
import type { MessageInstance } from 'antd/es/message/interface'
import { SSEClient } from '@/lib/utils/sse'
import { getChatRoomMessages } from '@/lib/api/aiController'
import { ChatMessage, ModelConfig } from '@/lib/types/chat'
import { MESSAGE_CONSTANTS, STORAGE_KEYS, API_CONSTANTS } from '@/lib/constants/chat'
import { BASE_URL } from '@/lib/utils/request'

// 消息状态类型
interface MessagesState {
  messages: ChatMessage[]
  renderCounter: number // 强制渲染计数器
}

// 消息action类型
type MessagesAction = 
  | { type: 'SET_MESSAGES'; payload: ChatMessage[] }
  | { type: 'APPEND_TO_LAST_AI'; payload: string }
  | { type: 'UPDATE_LAST_AI_STREAMING'; payload: boolean }
  | { type: 'CLEAR_MESSAGES' }

// reducer函数：确保每次action都创建新的引用
function messagesReducer(state: MessagesState, action: MessagesAction): MessagesState {
  switch (action.type) {
    case 'SET_MESSAGES':
      return {
        messages: action.payload,
        renderCounter: state.renderCounter + 1
      }
    
    case 'APPEND_TO_LAST_AI': {
      const lastIndex = state.messages.length - 1
      if (lastIndex >= 0 && state.messages[lastIndex].role === 'ai') {
        const newMessages = [...state.messages]
        newMessages[lastIndex] = {
          ...newMessages[lastIndex],
          content: newMessages[lastIndex].content + action.payload,
          timestamp: Date.now() // 强制更新时间戳
        }
        return {
          messages: newMessages,
          renderCounter: state.renderCounter + 1
        }
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
        return {
          messages: newMessages,
          renderCounter: state.renderCounter + 1
        }
      }
      return state
    }
    
    case 'CLEAR_MESSAGES':
      return {
        messages: [],
        renderCounter: state.renderCounter + 1
      }
    
    default:
      return state
  }
}

/**
 * 聊天消息管理 Hook
 */
export function useChatMessages(
  chatId: string,
  messageApi: MessageInstance,
  onFirstMessage?: (prompt: string) => Promise<string | null>
) {
  const [messagesState, dispatch] = useReducer(messagesReducer, {
    messages: [],
    renderCounter: 0
  })
  const [userInput, setUserInput] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const sseClientRef = useRef<SSEClient | null>(null)

  // 从 localStorage 加载历史消息
  const loadHistoryMessagesFromLocal = useCallback(() => {
    if (!chatId) return

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

  // 从后端加载历史消息
  const loadHistoryMessages = useCallback(async () => {
    if (!chatId) return

    try {
      const response = await getChatRoomMessages({ chatroomId: chatId })
      
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
        
        dispatch({ type: 'SET_MESSAGES', payload: convertedMessages })
        saveHistoryMessages(convertedMessages)
        return
      }
    } catch (error) {
      // 静默失败
    }
    
    loadHistoryMessagesFromLocal()
  }, [chatId, loadHistoryMessagesFromLocal])

  // 保存消息到 localStorage
  const saveHistoryMessages = useCallback((msgs: ChatMessage[]) => {
    if (!chatId) return

    try {
      const historyKey = `${STORAGE_KEYS.CHAT_HISTORY_PREFIX}${chatId}`
      localStorage.setItem(historyKey, JSON.stringify(msgs))
    } catch (error) {
      // 静默失败
    }
  }, [chatId])

  // 发送消息
  const sendMessage = useCallback(async (config: ModelConfig) => {
    const prompt = userInput.trim()

    if (!prompt || isConnecting) {
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
    
    if (isFirstMessage && onFirstMessage) {
      const newChatId = await onFirstMessage(prompt)
      if (newChatId) {
        actualChatId = newChatId
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
        endpoint = '/ai/vision-chat'
        requestData = {
          userPrompt: prompt,
          chatId: actualChatId,
          imageUrls: config.imageUrls || [],
          visionModelType: config.model === 'vision' ? 'vision' : 'vision_reasoning'
        }
      } else {
        endpoint = '/ai/chat'
        requestData = {
          userPrompt: prompt,
          chatId: actualChatId,
          modelName: config.model,
          useWebSearch: config.useWebSearch || false,
          useToolCalling: config.useToolCalling || false,
          useRAG: config.useRAG || false
        }
      }

      const sseClient = new SSEClient()
      sseClientRef.current = sseClient

      await sseClient.connect(`${BASE_URL}${endpoint}`, requestData, {
        onMessage: (data: string) => {
          dispatch({ type: 'APPEND_TO_LAST_AI', payload: data })
        },
        onOpen: () => {
          setIsLoading(false)
        },
        onError: (error: Error) => {
          setIsConnecting(false)
          setIsLoading(false)
          dispatch({ type: 'UPDATE_LAST_AI_STREAMING', payload: false })
          messageApi.error('连接失败，请稍后重试')
          saveHistoryMessages(messagesState.messages)
        },
        onClose: () => {
          setIsConnecting(false)
          setIsLoading(false)
          dispatch({ type: 'UPDATE_LAST_AI_STREAMING', payload: false })
          saveHistoryMessages(messagesState.messages)
        }
      })
    } catch (error) {
      setIsConnecting(false)
      setIsLoading(false)
      dispatch({ type: 'UPDATE_LAST_AI_STREAMING', payload: false })
      messageApi.error('发送失败，请稍后重试')
    }
  }, [chatId, userInput, isConnecting, messagesState.messages, onFirstMessage, saveHistoryMessages, messageApi])

  // 关闭 SSE 连接
  const closeConnection = useCallback(() => {
    if (sseClientRef.current) {
      sseClientRef.current.close()
      sseClientRef.current = null
    }
  }, [])

  // 清空消息列表
  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' })
  }, [])

  return {
    messages: messagesState.messages,
    renderCounter: messagesState.renderCounter, // 导出渲染计数器
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

