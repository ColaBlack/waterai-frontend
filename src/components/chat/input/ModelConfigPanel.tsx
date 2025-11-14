'use client'

import React from 'react'
import { Space } from 'antd'
import ModelSelector from './ModelSelector'

/**
 * 模型配置面板组件
 * 只包含模型选择器，所有AI功能默认启用
 */
interface ModelConfigPanelProps {
  /** 当前选中的模型 */
  selectedModel: string
  /** 模型变化回调 */
  onModelChange: (model: string) => void
}

export default function ModelConfigPanel({
  selectedModel,
  onModelChange,
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
        {/* 所有AI功能（联网搜索、RAG、工具调用）默认启用，无需用户选择 */}
      </Space>
    </div>
  )
}

