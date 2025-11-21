/**
 * 对话导出辅助工具
 * 基于第三方库和浏览器API实现文件下载
 */

import { exportTextChat, exportVisionChat } from '@/lib/api/chatService/api/chatExportController'
import { message } from 'antd'

export type ExportFormat = 'markdown' | 'html' | 'txt' | 'json' | 'pdf'

/**
 * 从blob创建下载链接并触发下载
 * 使用浏览器原生API，无需第三方库
 */
const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  // 清理URL对象
  setTimeout(() => URL.revokeObjectURL(url), 100)
}

/**
 * 获取文件扩展名
 */
const getExtension = (format: ExportFormat): string => {
  const extensions: Record<ExportFormat, string> = {
    markdown: 'md',
    html: 'html',
    txt: 'txt',
    json: 'json',
    pdf: 'pdf',
  }
  return extensions[format]
}

/**
 * 生成文件名
 * 格式: {标题}_{时间戳}.{扩展名}
 */
const generateFilename = (title: string, format: ExportFormat): string => {
  // 移除非法字符
  const safeTitle = title.replace(/[\\/:*?"<>|]/g, '_').substring(0, 50)
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19)
  return `${safeTitle}_${timestamp}.${getExtension(format)}`
}

/**
 * 导出对话（自动判断类型）
 */
export const exportChat = async (
  chatId: string,
  format: ExportFormat = 'markdown',
  title: string = 'chat'
): Promise<void> => {
  if (!chatId) {
    message.warning('请先选择一个对话')
    return
  }

  try {
    message.loading({ content: `正在导出为 ${format.toUpperCase()} 格式...`, key: 'export' })

    const isVision = chatId.startsWith('vision_')
    const response = isVision
      ? await exportVisionChat({ chatId, format })
      : await exportTextChat({ chatId, format })

    // response.data 是 Blob 对象
    const blob = new Blob([response.data], {
      type: response.headers['content-type'] || 'application/octet-stream',
    })

    const filename = generateFilename(title, format)
    downloadBlob(blob, filename)

    message.success({ content: '导出成功！', key: 'export' })
  } catch (error) {
    console.error('导出失败', error)
    message.error({ content: '导出失败，请稍后重试', key: 'export' })
  }
}

/**
 * 批量导出（未来功能）
 */
export const exportMultipleChats = async (
  chatIds: string[],
  format: ExportFormat = 'markdown'
): Promise<void> => {
  message.info('批量导出功能开发中...')
  // TODO: 实现批量导出
}
