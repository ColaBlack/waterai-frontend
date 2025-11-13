/**
 * 消息相关类型定义
 */

/** 消息角色类型 */
export type MessageRole = 'user' | 'ai'

/** 工具调用状态 */
export type ToolCallStatus = 'pending' | 'calling' | 'completed' | 'failed'

/** 工具调用信息 */
export interface ToolCall {
  /** 工具ID */
  id?: string
  /** 工具名称 */
  name: string
  /** 工具参数 */
  arguments?: string
  /** 工具调用结果 */
  result?: string
  /** 工具调用状态 */
  status?: ToolCallStatus
  /** 错误信息（如果调用失败） */
  error?: string
}

/** RAG检索文档 */
export interface RetrievedDocument {
  /** 文档ID */
  id?: string
  /** 文档内容 */
  content: string
  /** 相似度分数 */
  score?: number
  /** 文档来源/标题 */
  source?: string
}

/** AI消息元数据 */
export interface AIMessageMetadata {
  /** 工具调用列表 */
  toolCalls?: ToolCall[]
  /** RAG检索到的文档 */
  retrievedDocuments?: RetrievedDocument[]
  /** 完成原因 */
  finishReason?: string
  /** 模型ID */
  modelId?: string
  /** Token使用情况 */
  usage?: {
    promptTokens?: number
    completionTokens?: number
    totalTokens?: number
  }
}

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
  /** AI消息的元数据（仅当role为'ai'时有效） */
  metadata?: AIMessageMetadata
  /** AI思考过程（从<think></think>标签中提取） */
  thinkingProcess?: string
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

/** 后端SSE响应结构 */
export interface SSEResponse {
  /** 聊天响应数据 */
  chatResponse?: {
    /** 结果对象 */
    result?: {
      /** 输出内容 */
      output?: {
        /** 消息类型 */
        messageType?: string
        /** 元数据 */
        metadata?: any
        /** 工具调用列表 */
        toolCalls?: any[]
        /** 媒体列表 */
        media?: any[]
        /** AI回复的文本 */
        text?: string
      }
      /** 元数据 */
      metadata?: {
        /** 完成原因 */
        finishReason?: string
        /** 内容过滤器 */
        contentFilters?: any[]
        /** 是否为空 */
        empty?: boolean
      }
    }
    /** 元数据 */
    metadata?: {
      /** 消息ID */
      id?: string
      /** 模型名称 */
      model?: string
      /** 速率限制信息 */
      rateLimit?: any
      /** Token使用情况 */
      usage?: {
        /** 完成Token数 */
        completionTokens?: number
        /** 提示Token数 */
        promptTokens?: number
        /** 总Token数 */
        totalTokens?: number
        /** 原生使用情况 */
        nativeUsage?: any
      }
      /** 提示元数据 */
      promptMetadata?: any[]
      /** 是否为空 */
      empty?: boolean
    }
    /** 结果列表 */
    results?: Array<{
      /** 输出内容 */
      output?: {
        /** 消息类型 */
        messageType?: string
        /** 元数据 */
        metadata?: any
        /** 工具调用列表 */
        toolCalls?: any[]
        /** 媒体列表 */
        media?: any[]
        /** AI回复的文本 */
        text?: string
      }
      /** 元数据 */
      metadata?: any
    }>
  }
  /** 上下文信息 */
  context?: {
    /** RAG检索到的文档列表 */
    qa_retrieved_documents?: Array<{
      /** 文档ID */
      id?: string
      /** 文档内容 */
      content?: string
      /** 相似度分数 */
      score?: number
      /** 文档来源 */
      source?: string
      /** 元数据 */
      metadata?: any
    }>
    /** 聊天记忆对话ID */
    chat_memory_conversation_id?: string
  }
}

