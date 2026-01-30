import { ParsedMessageContent } from '@/lib/types/chat'

const THINKING_PROCESS_REGEX = /<think>([\s\S]*?)<\/think>/gi
const TOOL_CALL_TAGS_ONLY_REGEX = /<\/?(tool_call|ddg-search|mongodb|mcp|rag)(?:\b[^>]*)\/?\>/gi

export function parseMessageContent(content: string): ParsedMessageContent {
  const withoutToolTags = content.replace(TOOL_CALL_TAGS_ONLY_REGEX, '')
  const thinkMatches = withoutToolTags.match(THINKING_PROCESS_REGEX)
  
  let thinkingProcess = ''
  if (thinkMatches && thinkMatches.length > 0) {
    thinkingProcess = thinkMatches
      .map(match => match.replace(/<\/?think>/gi, '').trim())
      .join('\n\n')
  }
  
  const normalContent = withoutToolTags.replace(THINKING_PROCESS_REGEX, '').trim()
  
  return {
    thinkingProcess,
    normalContent
  }
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60 * 1000) {
    return '刚刚'
  }
  
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000))
    return `${minutes}分钟前`
  }
  
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
  }
  
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
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
