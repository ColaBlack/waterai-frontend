/**
 * 图片处理工具函数
 */

import type { UploadFile } from 'antd'

/**
 * 将上传的图片文件转换为 Base64 格式
 * @param files 上传的文件列表
 * @returns Base64 字符串数组
 */
export async function convertImagesToBase64(files: UploadFile[]): Promise<string[]> {
  const imageUrls: string[] = []
  
  for (const file of files) {
    if (file.originFileObj) {
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file.originFileObj!)
        })
        imageUrls.push(base64)
      } catch (error) {
        // 静默失败，跳过无效图片
        console.warn('Failed to convert image to base64:', error)
      }
    }
  }
  
  return imageUrls
}

/**
 * 清理输入值：移除尾随的换行符和空格
 * @param value 原始输入值
 * @returns 清理后的值
 */
export function cleanInputValue(value: string): string {
  return value.trim()
}

