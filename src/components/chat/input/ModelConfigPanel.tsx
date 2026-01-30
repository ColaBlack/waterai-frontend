'use client'

import React from 'react'
import { Space, Switch, Tooltip } from 'antd'
import { BulbOutlined } from '@ant-design/icons'
import ModelSelector from './ModelSelector'
import { isMiniMaxM21 } from '@/lib/constants/models'

/**
 * 模型配置面板组件
 * 包含模型选择器和深度思考开关
 */
interface ModelConfigPanelProps {
  /** 当前选中的模型 */
  selectedModel: string
  /** 模型变化回调 */
  onModelChange: (model: string) => void
  /** 是否启用深度思考 */
  enableThinking?: boolean
  /** 深度思考开关回调 */
  onThinkingChange?: (enabled: boolean) => void
}

export default function ModelConfigPanel({
  selectedModel,
  onModelChange,
  enableThinking = false,
  onThinkingChange,
}: ModelConfigPanelProps) {
  // MiniMax-M2.1 强制启用思考模式
  const isMiniMax = isMiniMaxM21(selectedModel)
  const effectiveThinking = isMiniMax ? true : enableThinking

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
        
        {/* 深度思考开关 */}
        {onThinkingChange && (
          <Tooltip 
            title={
              isMiniMax 
                ? "MiniMax-M2.1 模型仅支持思考模式，无法关闭" 
                : "启用后，AI会展示详细的思考过程和推理步骤，适合复杂问题分析"
            }
          >
            <Space>
              <BulbOutlined style={{ color: effectiveThinking ? '#1890ff' : '#8c8c8c' }} />
              <span style={{ fontSize: '14px', color: '#595959' }}>深度思考</span>
              <Switch
                checked={effectiveThinking}
                onChange={onThinkingChange}
                size="small"
                disabled={isMiniMax}
              />
            </Space>
          </Tooltip>
        )}
        
        {/* 所有AI功能（联网搜索、RAG、工具调用）默认启用，无需用户选择 */}
      </Space>
    </div>
  )
}

