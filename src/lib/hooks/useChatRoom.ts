import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { message as antdMessage } from 'antd'
import { listChatRooms, createChatRoom as apiCreateChatRoom } from '@/api/chatService/chatRoomController'
import { API_CONSTANTS, TIME_CONSTANTS } from '@/lib/constants/chat'
import { useUserStore } from '@/lib/store/userStore'

/**
 * 生成唯一的聊天室ID
 */
export function generateChatId(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 9)
  return `chat_${timestamp}_${random}`
}

/**
 * 聊天室管理 Hook
 */
export function useChatRoom() {
  const router = useRouter()
  const { loginUser } = useUserStore()
  const [chatId, setChatId] = useState('')
  const [chatRoomList, setChatRoomList] = useState<API.ChatRoomVO[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  // 初始化聊天室
  const initChatRoom = useCallback((routeChatId?: string) => {
    if (routeChatId) {
      setChatId(routeChatId)
    } else {
      const newChatId = generateChatId()
      setChatId(newChatId)
      // 使用 window.history.replaceState 避免页面刷新
      window.history.replaceState(null, '', `/ai/chat/${newChatId}`)
    }
  }, [])

  // 创建新聊天
  const createNewChat = useCallback(() => {
    const newChatId = generateChatId()
    router.push(`/ai/chat/${newChatId}`)
    setChatId(newChatId)
  }, [router])

  // 切换聊天室
  const switchChatRoom = useCallback(async (roomId: string): Promise<void> => {
    if (!roomId || roomId === chatId) {
      return
    }
    
    router.push(`/ai/chat/${roomId}`)
    setChatId(roomId)
  }, [chatId, router])

  // 加载历史聊天室列表
  const loadChatRoomList = useCallback(async (): Promise<void> => {
    if (!loginUser.id) {
      // 如果用户未登录，不加载聊天室列表
      return
    }

    setLoadingHistory(true)
    
    try {
      const response = await listChatRooms({ userId: loginUser.id })

      if (response.status === API_CONSTANTS.SUCCESS_STATUS) {
        const data = response.data.data || response.data

        if (Array.isArray(data)) {
          setChatRoomList(data)
        } else {
          setChatRoomList([])
        }
      } else {
        antdMessage.error(`加载聊天记录失败: HTTP ${response.status}`)
      }
    } catch (error: any) {
      antdMessage.error('加载聊天记录失败，请检查网络连接')
    } finally {
      setLoadingHistory(false)
    }
  }, [loginUser.id])

  // 创建聊天室记录（在后端）
  const createChatRoom = useCallback(async (userPrompt: string): Promise<string | null> => {
    if (!loginUser.id) {
      // 如果用户未登录，无法创建聊天室
      antdMessage.warning('用户未登录，无法创建聊天室')
      return null
    }

    try {
      const response = await apiCreateChatRoom({ 
        userPrompt,
        userId: loginUser.id 
      })

      if (response.status === API_CONSTANTS.SUCCESS_STATUS) {
        const data: any = response.data.data || response.data
        const backendChatId = data?.chatroom || data?.chatroomId || data?.id

        if (backendChatId) {
          // 仅更新 URL，不更新 chatId 状态（避免触发组件重新渲染）
          if (backendChatId !== chatId) {
            window.history.replaceState(null, '', `/ai/chat/${backendChatId}`)
            // 注意：不调用 setChatId，避免组件重新渲染干扰 SSE 连接
          }
          
          setTimeout(() => {
            loadChatRoomList()
          }, TIME_CONSTANTS.REFRESH_DELAY)
          
          return backendChatId
        } else {
          return null
        }
      } else {
        antdMessage.warning('聊天室创建失败，但可以继续对话')
        return null
      }
    } catch (error: any) {
      antdMessage.warning('聊天室创建失败，但可以继续对话')
      return null
    }
  }, [chatId, loginUser.id, loadChatRoomList, router])

  // 安全更新 chatId（用于在 SSE 连接完成后更新）
  const updateChatId = useCallback((newChatId: string) => {
    if (newChatId && newChatId !== chatId) {
      setChatId(newChatId)
    }
  }, [chatId])

  return {
    chatId,
    chatRoomList,
    loadingHistory,
    initChatRoom,
    createNewChat,
    switchChatRoom,
    loadChatRoomList,
    createChatRoom,
    updateChatId
  }
}

