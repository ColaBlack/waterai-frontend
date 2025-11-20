/**
 * 文件上传API封装
 * 基于imgBedService的imageController
 */

import { uploadFile, uploadAvatar, uploadChatImage, deleteFile } from './imgBedService/api/imageController'

/**
 * 获取用户ID（从localStorage）
 */
const getUserId = (): number => {
  if (typeof window === 'undefined') return 0
  const userId = localStorage.getItem('userId')
  return userId ? parseInt(userId, 10) : 0
}

/**
 * 文件上传API
 */
export const fileApi = {
  /**
   * 上传用户头像
   * @param file 文件对象
   * @param userId 用户ID（可选，默认从localStorage获取）
   * @returns 图片URL
   */
  uploadAvatar: async (file: File, userId?: number): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await uploadAvatar(
      { userId: userId || getUserId() }, 
      formData as any
    )
    
    if (response.data.code === 200 && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.message || '上传头像失败')
  },

  /**
   * 上传聊天图片
   * @param file 文件对象
   * @param chatId 聊天ID
   * @returns 图片URL
   */
  uploadChatImage: async (file: File, chatId: string): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await uploadChatImage(
      { chatId },
      formData as any
    )
    
    if (response.data.code === 200 && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.message || '上传图片失败')
  },

  /**
   * 通用文件上传
   * @param file 文件对象
   * @param folder 文件夹名称（可选）
   * @returns 文件URL
   */
  uploadFile: async (file: File, folder?: string): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await uploadFile(
      folder ? { folder } : {},
      formData as any
    )
    
    if (response.data.code === 200 && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.message || '上传文件失败')
  },

  /**
   * 删除文件
   * @param fileUrl 文件URL
   * @returns 是否删除成功
   */
  deleteFile: async (fileUrl: string): Promise<boolean> => {
    const response = await deleteFile({ fileUrl })
    
    if (response.data.code === 200) {
      return response.data.data || false
    }
    throw new Error(response.data.message || '删除文件失败')
  }
}
