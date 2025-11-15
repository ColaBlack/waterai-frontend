'use client'

import React from 'react'
import { Select, Space } from 'antd'
import { TEXT_MODELS } from '@/lib/constants/models'

/**
 * 模型选择器组件
 * 用于选择文本模型
 */
interface ModelSelectorProps {
  /** 当前选中的模型 */
  value: string
  /** 模型变化回调 */
  onChange: (model: string) => void
}

export default function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '14px', color: '#4e5969', fontWeight: 500 }}>模型选择：</span>
      <Select
        value={value}
        onChange={onChange}
        style={{ width: 220 }}
        options={TEXT_MODELS}
      />
    </div>
  )
}

