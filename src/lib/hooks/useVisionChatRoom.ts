import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { visionChatRoomApi, VisionChatRoomVO } from '@/api/visionChatRoom'
import { API_CONSTANTS, TIME_CONSTANTS } from '@/lib/constants/chat'
import { useUserStore } from '@/lib/store/userStore'

/**
 * 生成唯一的视觉聊天室ID
 */
export function generateVisionChatId(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 9)
  return `vision_${timestamp}_${random}`
}

/**
 * 视觉聊天室管理 Hook
 */
export function useVisionChatRoom(messageApi?: any) {
  const router = useRouter()
  const { loginUser } = useUserStore()
  const [chatId, setChatId] = useState('')
  const [chatRoomList, setChatRoomList] = useState<VisionChatRoomVO[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  // 初始化聊天室
  const initChatRoom = useCallback((routeChatId?: string) => {
    if (routeChatId) {
      setChatId(routeChatId)
    } else {
      const newChatId = generateVisionChatId()
      setChatId(newChatId)
      // 使用 window.history.replaceState 避免页面刷新
      window.history.replaceState(null, '', `/ai/vision?chatId=${newChatId}`)
    }
  }, [])

  // 创建新聊天
  const createNewChat = useCallback(() => {
    const newChatId = generateVisionChatId()
    router.push(`/ai/vision?chatId=${newChatId}`)
    setChatId(newChatId)
  }, [router])

  // 切换聊天室
  const switchChatRoom = useCallback(async (roomId: string): Promise<void> => {
    if (!roomId || roomId === chatId) {
      return
    }
    
    router.push(`/ai/vision?chatId=${roomId}`)
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
      const response = await visionChatRoomApi.listChatRooms()

      if (response.data) {
        const data = response.data?.data || response.data

        if (Array.isArray(data)) {
          // 按更新时间排序
          const sortedData = [...data].sort((a, b) => 
            new Date(b.updateTime || b.createTime).getTime() - 
            new Date(a.updateTime || a.createTime).getTime()
          )
          setChatRoomList(sortedData)
        } else {
          setChatRoomList([])
        }
      } else {
        setChatRoomList([])
      }
    } catch (error: any) {
      console.error('加载聊天记录失败:', error)
      // 使用setTimeout避免在render中调用message API
      if (messageApi) {
        setTimeout(() => {
          messageApi.error('加载聊天记录失败，请检查网络连接')
        }, 0)
      }
    } finally {
      setLoadingHistory(false)
    }
  }, [loginUser.id, messageApi])

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
    updateChatId
  }
}

