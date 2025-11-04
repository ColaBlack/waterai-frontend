'use client'

import React from 'react'
import { Space } from 'antd'
import ModelSelector from './ModelSelector'
import ModelFeatures from './ModelFeatures'

/**
 * 模型配置面板组件
 * 整合模型选择器和功能选项
 */
interface ModelConfigPanelProps {
  /** 当前选中的模型 */
  selectedModel: string
  /** 是否启用联网搜索 */
  useWebSearch: boolean
  /** 是否启用RAG */
  useRAG: boolean
  /** 是否启用工具调用 */
  useToolCalling: boolean
  /** 模型变化回调 */
  onModelChange: (model: string) => void
  /** 联网搜索变化回调 */
  onWebSearchChange: (checked: boolean) => void
  /** RAG变化回调 */
  onRAGChange: (checked: boolean) => void
  /** 工具调用变化回调 */
  onToolCallingChange: (checked: boolean) => void
}

export default function ModelConfigPanel({
  selectedModel,
  useWebSearch,
  useRAG,
  useToolCalling,
  onModelChange,
  onWebSearchChange,
  onRAGChange,
  onToolCallingChange,
}: ModelConfigPanelProps) {
  return (
    <div
      style={{
        padding: '12px 16px',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #fafbfc 100%)',
        borderRadius: '8px',
        border: '1px solid #e5e6eb',
        marginBottom: '12px',
      }}
    >
      <Space wrap size="middle">
        <ModelSelector value={selectedModel} onChange={onModelChange} />
        <ModelFeatures
          selectedModel={selectedModel}
          useWebSearch={useWebSearch}
          useRAG={useRAG}
          useToolCalling={useToolCalling}
          onWebSearchChange={onWebSearchChange}
          onRAGChange={onRAGChange}
          onToolCallingChange={onToolCallingChange}
        />
      </Space>
    </div>
  )
}

