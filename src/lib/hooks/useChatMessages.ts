import { useState, useCallback, useRef, useReducer, type MutableRefObject } from 'react'
import type { MessageInstance } from 'antd/es/message/interface'
import { SSEClient } from '@/lib/utils/sse'
import { getChatRoomMessages } from '@/lib/api/aiController'
import { ChatMessage, ModelConfig } from '@/lib/types/chat'
import { MESSAGE_CONSTANTS, STORAGE_KEYS, API_CONSTANTS } from '@/lib/constants/chat'
import { BASE_URL, SSE_BASE_URL } from '@/lib/utils/request'

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

// 创建一个可以访问外部 ref 的 reducer 工厂函数
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
  onFirstMessage?: (prompt: string) => Promise<string | null>
) {
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

  // 从 localStorage 加载历史消息
  const loadHistoryMessagesFromLocal = useCallback(() => {
    if (!chatId) return

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
        messagesRef.current = convertedMessages
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

      await sseClient.connect(
        `${(typeof window !== 'undefined' ? SSE_BASE_URL : BASE_URL)}${endpoint}`,
        requestData,
        {
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
            // 使用 ref 获取最新消息，避免依赖闭包
            setTimeout(() => {
              saveHistoryMessages(messagesRef.current)
            }, 0)
          },
          onClose: () => {
            setIsConnecting(false)
            setIsLoading(false)
            dispatch({ type: 'UPDATE_LAST_AI_STREAMING', payload: false })
            // 使用 ref 获取最新消息，避免依赖闭包
            setTimeout(() => {
              saveHistoryMessages(messagesRef.current)
            }, 0)
          },
        }
      )
    } catch (error) {
      setIsConnecting(false)
      setIsLoading(false)
      dispatch({ type: 'UPDATE_LAST_AI_STREAMING', payload: false })
      messageApi.error('发送失败，请稍后重试')
    }
  }, [chatId, userInput, isConnecting, onFirstMessage, saveHistoryMessages, messageApi])

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

