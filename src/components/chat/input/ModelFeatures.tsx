'use client'

import React from 'react'
import { Checkbox, Divider, Tag, Space } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { isTextModel } from '@/lib/constants/models'

/**
 * 模型功能选项组件
 * 用于配置文本模型的功能选项（联网搜索、RAG、工具调用等）
 */
interface ModelFeaturesProps {
  /** 当前选中的模型 */
  selectedModel: string
  /** 是否启用联网搜索 */
  useWebSearch: boolean
  /** 是否启用RAG */
  useRAG: boolean
  /** 是否启用工具调用 */
  useToolCalling: boolean
  /** 联网搜索变化回调 */
  onWebSearchChange: (checked: boolean) => void
  /** RAG变化回调 */
  onRAGChange: (checked: boolean) => void
  /** 工具调用变化回调 */
  onToolCallingChange: (checked: boolean) => void
}

export default function ModelFeatures({
  selectedModel,
  useWebSearch,
  useRAG,
  useToolCalling,
  onWebSearchChange,
  onRAGChange,
  onToolCallingChange,
}: ModelFeaturesProps) {
  const isText = isTextModel(selectedModel)

  if (!isText) {
    return (
      <>
        <Divider type="vertical" style={{ height: 24, margin: 0 }} />
        <Tag color="orange" icon={<InfoCircleOutlined />}>
          视觉模型暂不支持联网搜索和知识库功能
        </Tag>
      </>
    )
  }

  return (
    <>
      <Divider type="vertical" style={{ height: 24, margin: 0 }} />
      <Checkbox checked={useWebSearch} onChange={(e) => onWebSearchChange(e.target.checked)}>
        联网搜索
      </Checkbox>
      <Checkbox checked={useRAG} onChange={(e) => onRAGChange(e.target.checked)}>
        知识库检索（RAG）
      </Checkbox>
      <Checkbox checked={useToolCalling} onChange={(e) => onToolCallingChange(e.target.checked)}>
        水产品数据库检索
      </Checkbox>
    </>
  )
}

