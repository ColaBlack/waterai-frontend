export type MessageRole = 'user' | 'ai'

export type ToolCallStatus = 'pending' | 'calling' | 'completed' | 'failed'

export interface ToolCall {
  id?: string
  name: string
  arguments?: string
  result?: string
  status?: ToolCallStatus
  error?: string
}

export interface RetrievedDocument {
  id?: string
  content: string
  score?: number
  source?: string
}

export interface AIMessageMetadata {
  toolCalls?: ToolCall[]
  retrievedDocuments?: RetrievedDocument[]
  finishReason?: string
  modelId?: string
  usage?: {
    promptTokens?: number
    completionTokens?: number
    totalTokens?: number
  }
}

export interface ChatMessage {
  role: MessageRole
  content: string
  timestamp: number
  isStreaming?: boolean
  metadata?: AIMessageMetadata
  thinkingProcess?: string
}

export interface ParsedMessageContent {
  thinkingProcess: string
  normalContent: string
}

/** 模型配置接口 */
export interface ModelConfig {
  /** 模型名称 */
  model: string
  /** 是否为视觉模型 */
  isVision: boolean
  /** 图片URL列表（视觉模型专用） */
  imageUrls?: string[]
  /** 是否启用深度思考模式（思维链） */
  enableThinking?: boolean
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

