import request from '@/lib/utils/request';

/**
 * 视觉聊天记录类型
 */
export interface VisionChatRecord {
  id: number;
  chatId: string;
  userId: number;
  messageType: 'user' | 'assistant';
  content: string;
  imageUrls: string[];
  modelName?: string;
  visionReasoningModel?: boolean;
  createTime: string;
}

/**
 * 视觉聊天请求参数
 */
export interface VisionChatRequest {
  userPrompt: string;
  chatId: string;
  imageUrls: string[];
  visionModelType?: 'vision' | 'vision_reasoning';
}

/**
 * 视觉聊天API
 */
export const visionChatApi = {
  /**
   * 发送视觉聊天消息
   */
  askVisionQuestion: (data: VisionChatRequest) => {
    return request.post('/vision-chat/ask', data, {
      responseType: 'stream',
    });
  },

  /**
   * 获取聊天记录
   */
  getChatRecords: (chatId: string) => {
    return request.get<VisionChatRecord[]>(`/vision-chat/records/${chatId}`);
  },

  /**
   * 获取用户聊天记录
   */
  getUserChatRecords: (userId: number, current = 1, pageSize = 10) => {
    return request.get<{
      records: VisionChatRecord[];
      total: number;
      current: number;
      size: number;
    }>(`/vision-chat/records/user/${userId}`, {
      params: { current, pageSize },
    });
  },

  /**
   * 删除聊天记录
   */
  deleteChatRecords: (chatId: string, userId?: number) => {
    return request.delete<boolean>(`/vision-chat/records/${chatId}`, {
      params: userId ? { userId } : {},
    });
  },
};
