/**
 * 消息相关类型定义
 */

/** 消息角色类型 */
export type MessageRole = 'user' | 'ai'

/** 聊天消息接口 */
export interface ChatMessage {
  /** 消息角色：用户或AI */
  role: MessageRole
  /** 消息内容（可能包含Markdown和<think>标签） */
  content: string
  /** 消息时间戳 */
  timestamp: number
  /** 是否正在流式输出 */
  isStreaming?: boolean
}

/** 解析后的消息内容 */
export interface ParsedMessageContent {
  /** 思考过程内容（从<think>标签中提取） */
  thinkingProcess: string
  /** 正常消息内容（移除<think>标签后的内容） */
  normalContent: string
}

/** 模型配置接口 */
export interface ModelConfig {
  /** 模型名称 */
  model: string
  /** 是否为视觉模型 */
  isVision: boolean
  /** 是否启用联网搜索 */
  useWebSearch?: boolean
  /** 是否启用RAG */
  useRAG?: boolean
  /** 是否启用工具调用 */
  useToolCalling?: boolean
  /** 图片URL列表（视觉模型专用） */
  imageUrls?: string[]
}

