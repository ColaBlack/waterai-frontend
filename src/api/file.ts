import request from '@/lib/utils/request';

/**
 * 图片上传API（使用图床服务）
 */
export const fileApi = {
  /**
   * 通用文件上传
   */
  uploadFile: (file: File, folder?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) {
      formData.append('folder', folder);
    }
    
    return request.post<string>('/image/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * 上传用户头像
   */
  uploadAvatar: (file: File, userId: number) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId.toString());
    
    return request.post<string>('/image/upload/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * 上传聊天图片
   */
  uploadChatImage: (file: File, chatId: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('chatId', chatId);
    
    return request.post<string>('/image/upload/chat-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * 删除文件
   */
  deleteFile: (fileUrl: string) => {
    return request.delete<boolean>('/image/delete', {
      params: { fileUrl },
    });
  },
};
