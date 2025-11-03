/**
 * AI 聊天室相关常量配置
 */

/** 消息相关常量 */
export const MESSAGE_CONSTANTS = {
  /** 单条消息最大长度（字符） */
  MAX_LENGTH: 1000,
  
  /** 消息输入框最小行数 */
  INPUT_MIN_ROWS: 2,
  
  /** 消息输入框最大行数 */
  INPUT_MAX_ROWS: 4
} as const

/** 示例问题列表 */
export const SAMPLE_QUESTIONS = [
  '什么是人工智能？',
  '如何学习编程？',
  '请介绍一下 Next.js',
  '今天天气怎么样？'
] as const

/** 本地存储键名前缀 */
export const STORAGE_KEYS = {
  /** 聊天历史记录键名前缀，后面会拼接聊天室ID */
  CHAT_HISTORY_PREFIX: 'chat_history_',
  
  /** 用户偏好设置 */
  USER_PREFERENCES: 'user_preferences',
  
  /** 最后访问的聊天室ID */
  LAST_CHAT_ID: 'last_chat_id'
} as const

/** 时间相关常量（毫秒） */
export const TIME_CONSTANTS = {
  /** 刷新历史列表的延迟时间（确保后端保存完成） */
  REFRESH_DELAY: 500,
  
  /** 自动保存间隔 */
  AUTO_SAVE_INTERVAL: 30000, // 30秒
  
  /** SSE 连接超时时间 */
  SSE_TIMEOUT: 60000 // 60秒
} as const

/** UI 相关常量 */
export const UI_CONSTANTS = {
  /** 侧边栏宽度（像素） */
  SIDEBAR_WIDTH: 280,
  
  /** 侧边栏折叠宽度 */
  SIDEBAR_COLLAPSED_WIDTH: 0,
  
  /** 消息动画持续时间（毫秒） */
  MESSAGE_ANIMATION_DURATION: 300
} as const

/** API 相关常量 */
export const API_CONSTANTS = {
  /** HTTP 成功状态码 */
  SUCCESS_STATUS: 200,
  
  /** 业务成功状态码（后端返回的code字段） */
  SUCCESS_CODE: 200,
  
  /** 请求超时时间（毫秒） */
  REQUEST_TIMEOUT: 30000
} as const

