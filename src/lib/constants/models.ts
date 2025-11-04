/**
 * AI 模型相关常量配置
 */

/** 文本模型列表 */
export const TEXT_MODELS = [
  { label: 'GLM-Z1-Flash（深度推理）', value: 'glm-z1-flash' },
  { label: 'GLM-4.5-Flash（标准）', value: 'glm-4.5-flash' },
  { label: 'GLM-4-Flash（普通）', value: 'glm-4-flash' },
] as const

/** 视觉模型列表 */
export const VISION_MODELS = [
  { label: 'GLM-4V-Flash（快速识别）', value: 'vision' },
  { label: 'GLM-4.1V-Thinking-Flash（深度思考）', value: 'vision_reasoning' },
] as const

/** 默认选中的模型 */
export const DEFAULT_MODEL = 'glm-4.5-flash'

/** 文本模型值列表 */
export const TEXT_MODEL_VALUES = TEXT_MODELS.map(m => m.value)

/** 判断是否为文本模型 */
export function isTextModel(model: string): boolean {
  return TEXT_MODEL_VALUES.includes(model as any)
}

/** 图片上传相关常量 */
export const IMAGE_UPLOAD_CONSTANTS = {
  /** 最多上传图片数量 */
  MAX_COUNT: 10,
  /** 支持的图片格式提示 */
  ACCEPT_FORMATS: 'JPG、PNG 等格式',
} as const

