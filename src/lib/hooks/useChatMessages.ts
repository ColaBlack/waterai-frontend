import { useState, useCallback, useRef, useReducer, type MutableRefObject } from 'react'
import type { MessageInstance } from 'antd/es/message/interface'
import { SSEClient } from '@/lib/utils/sse'
import { getChatRoomMessages } from '@/api/chatService/chatRoomController'
import { ChatMessage, ModelConfig } from '@/lib/types/chat'
import { MESSAGE_CONSTANTS, STORAGE_KEYS, API_CONSTANTS, TIME_CONSTANTS } from '@/lib/constants/chat'
import { BASE_URL } from '@/lib/utils/request'
import { useUserStore } from '@/lib/store/userStore'

// 消息状态类型
interface MessagesState {
  messages: ChatMessage[]
  renderCounter: number // 强制渲染计数器
}

import type { SSEMessageData } from '@/lib/utils/sse'

// 消息action类型
type MessagesAction = 
  | { type: 'SET_MESSAGES'; payload: ChatMessage[] }
  | { type: 'APPEND_TO_LAST_AI'; payload: string }
  | { type: 'UPDATE_LAST_AI_STREAMING'; payload: boolean }
  | { type: 'UPDATE_LAST_AI_MESSAGE'; payload: SSEMessageData }
  | { type: 'CLEAR_MESSAGES' }

// 创建一个可以访问外部 ref 的 reducer 工厂函数
function createMessagesReducer(messagesRef: MutableRefObject<ChatMessage[]>) {
  return function messagesReducer(state: MessagesState, action: MessagesAction): MessagesState {
    let newState: MessagesState
    
    switch (action.type) {
      case 'SET_MESSAGES':
        if (process.env.NODE_ENV === 'development') {
          console.log('[Reducer] SET_MESSAGES:', {
            messageCount: action.payload.length,
            renderCounter: state.renderCounter + 1
          })
        }
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
            timestamp: Date.now() // 强制更新时间戳
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
          
          // 安全检查：确保不会追加JSON字符串或对象到消息内容中
          let textToAppend = ''
          
          // 确保 text 是字符串类型
          if (action.payload.text !== undefined && action.payload.text !== null) {
            if (typeof action.payload.text === 'string') {
              textToAppend = action.payload.text
            } else if (typeof action.payload.text === 'object') {
              // 如果是对象，不追加（避免显示 [object Object]）
              if (process.env.NODE_ENV === 'development') {
                console.warn('[Reducer] Blocked object from being added to message content:', action.payload.text)
              }
              textToAppend = ''
            } else {
              // 其他类型，尝试转换为字符串
              textToAppend = String(action.payload.text)
            }
          }
          
          // 如果text看起来像纯JSON字符串（以{开头且以}结尾），但不是代码块中的JSON，则不追加
          if (textToAppend) {
            const trimmed = textToAppend.trim()
            const currentContent = typeof currentMessage.content === 'string' ? currentMessage.content : String(currentMessage.content || '')
            
            // 只有当这是一个完整的独立JSON对象，且不在代码块上下文中时才过滤
            if (trimmed.startsWith('{') && trimmed.endsWith('}') && 
                !currentContent.includes('```json') && // 不在JSON代码块中
                !trimmed.includes('\n') && // 不是多行JSON（工具调用的JSON通常是多行的）
                trimmed.length < 200) { // 不是很长的JSON（工具调用的JSON通常较长）
              // 看起来像纯JSON响应对象，不追加到消息内容中
              if (process.env.NODE_ENV === 'development') {
                console.warn('[Reducer] Blocked pure JSON response from being added to message content:', trimmed.substring(0, 100))
              }
              textToAppend = ''
            }
          }
          
          // 确保 currentMessage.content 也是字符串
          const currentContent = typeof currentMessage.content === 'string' ? currentMessage.content : String(currentMessage.content || '')
          const newContent = textToAppend ? currentContent + textToAppend : currentContent
          
          // 检查内容是否真的变化了
          const contentChanged = newContent !== currentContent
          
          // 合并元数据 - 需要特殊处理数组字段
          let newMetadata = currentMessage.metadata ? { ...currentMessage.metadata } : {}
          let metadataChanged = false
          
          if (action.payload.metadata) {
            // 合并工具调用 - 需要智能合并：如果有相同ID的工具，更新它；否则添加新的
            if (action.payload.metadata.toolCalls) {
              const existingToolCalls = newMetadata.toolCalls || []
              const newToolCalls = action.payload.metadata.toolCalls
              
              // 创建工具调用映射，按ID或名称+参数组合来识别
              const toolCallMap = new Map<string, typeof existingToolCalls[0]>()
              
              // 先添加现有的工具调用
              existingToolCalls.forEach(tc => {
                const key = tc.id || `${tc.name}_${tc.arguments}`
                toolCallMap.set(key, tc)
              })
              
              // 合并新的工具调用：如果有相同ID/键，更新它（保留更完整的信息）；否则添加
              newToolCalls.forEach(tc => {
                const key = tc.id || `${tc.name}_${tc.arguments}`
                const existing = toolCallMap.get(key)
                
                if (existing) {
                  // 检查是否有实际变化
                  const hasChanges = 
                    (tc.result !== undefined && tc.result !== existing.result) ||
                    (tc.status && tc.status !== existing.status) ||
                    (tc.error && tc.error !== existing.error)
                  
                  if (hasChanges) {
                    metadataChanged = true
                    // 合并：优先使用新数据，但如果新数据缺少某些字段，保留旧的
                    toolCallMap.set(key, {
                      ...existing,
                      ...tc,
                      // 如果新数据有结果，使用新的；否则保留旧的
                      result: tc.result !== undefined ? tc.result : existing.result,
                      // 状态也优先使用新的
                      status: tc.status || existing.status,
                      // 错误信息也优先使用新的
                      error: tc.error || existing.error
                    })
                  }
                } else {
                  // 新工具调用，直接添加
                  metadataChanged = true
                  toolCallMap.set(key, tc)
                }
              })
              
              if (metadataChanged || toolCallMap.size !== existingToolCalls.length) {
                newMetadata.toolCalls = Array.from(toolCallMap.values())
              }
            }
            
            // 合并RAG文档（数组需要合并而不是覆盖，但要去重）
            if (action.payload.metadata.retrievedDocuments) {
              const existingDocs = newMetadata.retrievedDocuments || []
              const newDocs = action.payload.metadata.retrievedDocuments
              
              // 检查是否有新文档
              if (newDocs.length > 0 && newDocs.length !== existingDocs.length) {
                metadataChanged = true
                // 使用ID去重，如果没有ID则使用内容+来源的组合
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
            
            // 其他字段直接覆盖
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
          
          // 只有在内容或元数据真正变化时才更新状态
          if (!contentChanged && !metadataChanged) {
            // 没有实际变化，返回原状态，避免不必要的重新渲染
            return state
          }
          
          newMessages[lastIndex] = {
            ...currentMessage,
            content: newContent,
            metadata: Object.keys(newMetadata).length > 0 ? newMetadata : undefined,
            // 更新思考过程
            thinkingProcess: action.payload.thinkingProcess || currentMessage.thinkingProcess,
            // 只有在内容变化时才更新时间戳
            timestamp: contentChanged ? Date.now() : currentMessage.timestamp
          }
          
          // 开发环境调试日志
          if (process.env.NODE_ENV === 'development') {
            console.log('[Reducer] UPDATE_LAST_AI_MESSAGE:', {
              textLength: textToAppend.length,
              totalContentLength: newContent.length,
              contentChanged,
              metadataChanged,
              hasMetadata: !!action.payload.metadata,
              messageCount: newMessages.length
            })
          }
          
          newState = {
            messages: newMessages,
            renderCounter: state.renderCounter + 1
          }
          messagesRef.current = newMessages
          return newState
        }
        console.warn('[Reducer] UPDATE_LAST_AI_MESSAGE: No AI message to update')
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

/**
 * 聊天消息管理 Hook
 */
export function useChatMessages(
  chatId: string,
  messageApi: MessageInstance,
  onFirstMessage?: (prompt: string) => Promise<string | null>,
  onMessageSent?: () => void // 消息发送完成后的回调（用于刷新聊天室列表等）
) {
  const { loginUser } = useUserStore()
  // 使用 ref 保存最新的消息，避免在依赖数组中包含 messagesState.messages
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
  const isSendingFirstMessageRef = useRef(false) // 标记是否正在发送第一条消息

  // 从 localStorage 加载历史消息
  const loadHistoryMessagesFromLocal = useCallback(() => {
    if (!chatId) return

    // 检查是否在客户端环境（避免SSR错误）
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
        // messagesRef 会在 reducer 中自动更新
      } else {
        dispatch({ type: 'SET_MESSAGES', payload: [] })
        // messagesRef 会在 reducer 中自动更新
      }
    } catch (error) {
      dispatch({ type: 'SET_MESSAGES', payload: [] })
      // messagesRef 会在 reducer 中自动更新
    }
  }, [chatId])

  // 从后端加载历史消息
  const loadHistoryMessages = useCallback(async () => {
    if (!chatId) return

    // 如果正在发送第一条消息，不要加载历史消息（避免覆盖正在发送的消息）
    if (isSendingFirstMessageRef.current) {
      console.log('[loadHistoryMessages] Skipping load - first message in progress')
      return
    }

    // 检查JWT token和用户ID（仅在客户端环境）
    if (typeof window === 'undefined') {
      // 服务端渲染时不加载历史消息
      return
    }
    
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    
    if (!token || !userId) {
      // 如果用户未登录，不加载历史消息
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
        
        // 如果后端返回了消息，或者当前没有消息且后端也没有消息（新对话），则更新
        // 如果当前有消息但后端没有（正在发送第一条消息），则保留当前消息
        if (convertedMessages.length > 0) {
          // 后端有消息，直接加载
        dispatch({ type: 'SET_MESSAGES', payload: convertedMessages })
        messagesRef.current = convertedMessages
        saveHistoryMessages(convertedMessages)
        } else if (messagesRef.current.length === 0) {
          // 当前没有消息，后端也没有消息，保持空列表
          dispatch({ type: 'SET_MESSAGES', payload: [] })
          messagesRef.current = []
        } else {
          // 当前有消息但后端没有消息，可能是正在发送第一条消息，保留当前消息
          console.log('[loadHistoryMessages] Preserving current messages, backend has no messages yet')
        }
        return
      }
    } catch (error: any) {
      // 静默处理错误，包括"聊天室不存在"的情况
      // 如果聊天室不存在（新聊天室），这是正常情况，不应该显示错误
      const status = error?.response?.status
      const errorData = error?.response?.data
      const errorMessage = errorData?.message || error?.message || ''
      const errorCode = errorData?.code
      
      // 判断是否是"聊天室不存在"的错误
      // 可能是 HTTP 404、401 或者业务错误码
      const isChatRoomNotExists = 
        status === 404 || // HTTP 404 Not Found
        status === 401 || // HTTP 401 Unauthorized (可能是后端返回的)
        errorMessage.includes('聊天室不存在') ||
        errorMessage.includes('聊天室') && errorMessage.includes('不存在')
      
      if (isChatRoomNotExists) {
        // 聊天室不存在是正常情况（新聊天室或临时ID），静默处理
        // 这是预期的行为，不应该显示错误给用户
        if (process.env.NODE_ENV === 'development') {
          console.log('[loadHistoryMessages] Chat room not exists (expected for new chat), loading from local storage')
        }
      } else {
        // 其他错误（网络错误、服务器错误等），记录但不显示给用户
        // 避免干扰用户体验，因为这些错误通常是暂时的
        if (process.env.NODE_ENV === 'development') {
          console.warn('[loadHistoryMessages] Failed to load messages:', {
            status,
            errorCode,
            errorMessage: errorMessage || 'Unknown error'
          })
        }
      }
    }
    
    // 只在不是正在发送第一条消息时才加载本地消息
    if (!isSendingFirstMessageRef.current) {
    loadHistoryMessagesFromLocal()
    }
  }, [chatId, loadHistoryMessagesFromLocal])

  // 保存消息到 localStorage
  const saveHistoryMessages = useCallback((msgs: ChatMessage[]) => {
    if (!chatId) return

    // 检查是否在客户端环境（避免SSR错误）
    if (typeof window === 'undefined') return

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

    // 检查用户是否登录（检查JWT token）
    if (typeof window === 'undefined') {
      // 服务端渲染时不执行发送消息
      return
    }
    
    const token = localStorage.getItem('token')
    if (!token) {
      messageApi.error('请先登录后再发送消息')
      // 跳转到登录页面
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
    
    // 标记正在发送第一条消息
    if (isFirstMessage) {
      isSendingFirstMessageRef.current = true
    }
    
    // 如果后端支持自动创建聊天室，不再需要预先创建
    // 直接使用当前的 chatId，后端会自动创建（如果不存在）
    // 保留 onFirstMessage 逻辑作为可选的回调（用于更新 URL 等）
    if (isFirstMessage && onFirstMessage) {
      // 不再需要预先创建聊天室，后端会自动创建
      // 但保留回调逻辑，以便后续可能需要的处理
      try {
        const newChatId = await onFirstMessage(prompt)
        if (newChatId) {
          actualChatId = newChatId
        }
        // 如果 onFirstMessage 返回 null 或失败，仍然继续发送消息
        // 因为后端会自动创建聊天室
      } catch (error) {
        // 即使 onFirstMessage 失败，也继续发送消息
        // 因为后端会自动创建聊天室
        console.warn('onFirstMessage failed, but continuing with message send:', error)
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
          visionModelType: config.model === 'vision' ? 'vision' : 'vision_reasoning'
        }
      } else {
        endpoint = '/ai/chat'
        requestData = {
          userPrompt: prompt,
          chatId: actualChatId,
          chatRoomId: actualChatId, // 聊天室编号，如果不存在则后端自动创建
          modelName: config.model,
          useWebSearch: config.useWebSearch || false,
          useToolCalling: config.useToolCalling || false,
          useRAG: config.useRAG || false
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
            // 连接成功后立即保存当前消息（包括用户消息和空的AI消息）
            setTimeout(() => {
              saveHistoryMessages(messagesRef.current)
            }, 0)
          },
          onError: (error: Error) => {
            setIsConnecting(false)
            setIsLoading(false)
            dispatch({ type: 'UPDATE_LAST_AI_STREAMING', payload: false })
            
            // 根据错误类型显示不同的错误消息
            const errorMessage = error.message || ''
            if (errorMessage.includes('UNAUTHORIZED')) {
              // 401 错误 - 用户未登录或 session 无效
              messageApi.error('登录已过期，请重新登录')
              // 刷新用户信息
              if (typeof window !== 'undefined') {
                setTimeout(() => {
                  window.location.href = '/user/login?redirect=' + encodeURIComponent(window.location.href)
                }, 1500)
              }
            } else if (errorMessage.includes('FORBIDDEN')) {
              // 403 错误 - 权限不足
              messageApi.error('权限不足，无法发送消息')
            } else {
              // 其他错误
              messageApi.error('连接失败，请稍后重试')
            }
            
            // 使用 ref 获取最新消息，避免依赖闭包
            setTimeout(() => {
              saveHistoryMessages(messagesRef.current)
              // 清除第一条消息标记
              isSendingFirstMessageRef.current = false
            }, 0)
          },
          onClose: () => {
            setIsConnecting(false)
            setIsLoading(false)
            dispatch({ type: 'UPDATE_LAST_AI_STREAMING', payload: false })
            // 使用 ref 获取最新消息，避免依赖闭包
            setTimeout(() => {
              saveHistoryMessages(messagesRef.current)
              // 清除第一条消息标记
              isSendingFirstMessageRef.current = false
              
              // 如果后端自动创建了聊天室，刷新聊天室列表
              // 延迟执行，确保后端已经保存了聊天室
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
      // 清除第一条消息标记
      isSendingFirstMessageRef.current = false
    }
  }, [chatId, userInput, isConnecting, messagesState.messages.length, onFirstMessage, onMessageSent, saveHistoryMessages, messageApi])

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
    isSendingFirstMessageRef.current = false // 清除第一条消息标记
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

