/**
 * AI 模型相关常量配置
 */

/** 文本模型列表 */
export const TEXT_MODELS = [
  { label: 'DeepSeek V3.2（默认模型）', value: 'deepseek-v3.2' },
  { label: 'Kimi K2 Thinking（深度思考）', value: 'kimi-k2-thinking' },
  { label: 'Qwen3 Max 2026-01-23', value: 'qwen3-max-2026-01-23' },
  { label: 'MiniMax M2.1（仅思考模式）', value: 'MiniMax-M2.1' },
] as const

/** 视觉模型列表 */
export const VISION_MODELS = [
  { label: 'Qwen3-VL-Flash 2026-01-22（通义千问视觉-快速）', value: 'qwen3-vl-flash-2026-01-22' },
  { label: 'Qwen3-VL-Plus 2025-12-19（通义千问视觉-增强）', value: 'qwen3-vl-plus-2025-12-19' },
] as const

/** 默认选中的模型 */
export const DEFAULT_MODEL = 'deepseek-v3.2'

/** 文本模型值列表 */
export const TEXT_MODEL_VALUES = TEXT_MODELS.map(m => m.value)

/** 判断是否为文本模型 */
export function isTextModel(model: string): boolean {
  return TEXT_MODEL_VALUES.includes(model as any)
}

/** 判断是否为 MiniMax-M2.1 模型（强制思考模式） */
export function isMiniMaxM21(model: string): boolean {
  return model === 'MiniMax-M2.1'
}

/** 图片上传相关常量 */
export const IMAGE_UPLOAD_CONSTANTS = {
  /** 最多上传图片数量 */
  MAX_COUNT: 10,
  /** 支持的图片格式提示 */
  ACCEPT_FORMATS: 'JPG、PNG 等格式',
} as const

