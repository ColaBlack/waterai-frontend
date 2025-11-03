import { ParsedMessageContent } from '@/lib/types/chat'

/**
 * 解析消息内容，提取思考过程和正常内容
 */
export function parseMessageContent(content: string): ParsedMessageContent {
  const thinkRegex = /<think>([\s\S]*?)<\/think>/gi
  const thinkMatches = content.match(thinkRegex)
  
  let thinkingProcess = ''
  if (thinkMatches && thinkMatches.length > 0) {
    // 提取所有 <think> 标签中的内容
    thinkingProcess = thinkMatches
      .map(match => match.replace(/<\/?think>/gi, '').trim())
      .join('\n\n')
  }
  
  // 移除 <think> 标签后的正常内容
  const normalContent = content.replace(thinkRegex, '').trim()
  
  return {
    thinkingProcess,
    normalContent
  }
}

/**
 * 格式化时间戳
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  // 小于1分钟
  if (diff < 60 * 1000) {
    return '刚刚'
  }
  
  // 小于1小时
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000))
    return `${minutes}分钟前`
  }
  
  // 今天
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  
  // 昨天
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  
  // 今年
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
  }
  
  // 其他
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

/**
 * 复制文本到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        document.execCommand('copy')
        textArea.remove()
        return true
      } catch (error) {
        textArea.remove()
        return false
      }
    }
  } catch (error) {
    return false
  }
}

