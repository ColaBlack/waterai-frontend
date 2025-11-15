import request from '@/lib/utils/request'

/**
 * 视觉聊天室VO
 */
export interface VisionChatRoomVO {
  userId: number
  chatroom: string
  title: string
  createTime: string
  updateTime: string
}

/**
 * 视觉聊天室API
 */
export const visionChatRoomApi = {
  /**
   * 创建视觉聊天室
   */
  createChatRoom: (title?: string) => {
    return request.post<VisionChatRoomVO>('/ai/vision-chat-room/create', null, {
      params: title ? { title } : {},
    })
  },

  /**
   * 获取用户的视觉聊天室列表
   */
  listChatRooms: () => {
    return request.get<VisionChatRoomVO[]>('/ai/vision-chat-room/list')
  },

  /**
   * 更新聊天室标题
   */
  updateChatRoomTitle: (chatroomId: string, title: string) => {
    return request.post<boolean>('/ai/vision-chat-room/update-title', null, {
      params: { chatroomId, title },
    })
  },

  /**
   * 获取聊天室信息
   */
  getChatRoom: (chatroomId: string) => {
    return request.get<VisionChatRoomVO>(`/ai/vision-chat-room/${chatroomId}`)
  },
}


