/**
 * 消息解析工具函数
 * 用于处理消息内容的解析、格式化和复制等操作
 */

import { ParsedMessageContent } from '@/lib/types/chat'

/**
 * 思考过程标签的正则表达式
 * 用于匹配 <think>...</think> 格式的标签
 */
const THINKING_PROCESS_REGEX = /<think>([\s\S]*?)<\/think>/gi

// 仅对<think></think>做结构化处理；另外，为满足显示要求，移除工具调用相关标签的外层标签但保留其中的文本
const TOOL_CALL_TAGS_ONLY_REGEX = /<\/?(tool_call|ddg-search|mongodb|mcp|rag)(?:\b[^>]*)\/?\>/gi

/**
 * 解析消息内容，提取思考过程和正常内容
 * 
 * @param content 原始消息内容，可能包含思考过程标签
 * @returns 解析后的消息内容，包含思考过程和正常内容
 * 
 * @example
 * const content = '<think>思考过程</think>这是正常内容'
 * const parsed = parseMessageContent(content)
 * // { thinkingProcess: '思考过程', normalContent: '这是正常内容' }
 */
export function parseMessageContent(content: string): ParsedMessageContent {
  // 先移除工具调用标签（仅移除标签本身，保留其中文本）
  const withoutToolTags = content.replace(TOOL_CALL_TAGS_ONLY_REGEX, '')
  const thinkMatches = withoutToolTags.match(THINKING_PROCESS_REGEX)
  
  let thinkingProcess = ''
  if (thinkMatches && thinkMatches.length > 0) {
    // 提取所有思考过程标签中的内容，并移除标签
    thinkingProcess = thinkMatches
      .map(match => match.replace(/<\/?think>/gi, '').trim())
      .join('\n\n')
  }
  
  // 移除思考过程标签后的正常内容
  const normalContent = withoutToolTags.replace(THINKING_PROCESS_REGEX, '').trim()
  
  return {
    thinkingProcess,
    normalContent
  }
}

/**
 * 格式化时间戳为友好的时间显示
 * 
 * 时间显示规则：
 * - 小于1分钟：显示"刚刚"
 * - 小于1小时：显示"X分钟前"
 * - 今天：显示时间（如"14:30"）
 * - 昨天：显示"昨天 14:30"
 * - 今年：显示月日和时间（如"03-15 14:30"）
 * - 其他：显示完整日期（如"2024-03-15"）
 * 
 * @param timestamp 时间戳（毫秒）
 * @returns 格式化后的时间字符串
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
  
  // 其他年份
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

/**
 * 复制文本到剪贴板
 * 
 * 优先使用现代 Clipboard API，如果不支持则降级使用传统方法
 * 
 * @param text 要复制的文本
 * @returns 是否复制成功
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // 优先使用现代 Clipboard API（需要 HTTPS 或 localhost）
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // 降级方案：使用 document.execCommand
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

