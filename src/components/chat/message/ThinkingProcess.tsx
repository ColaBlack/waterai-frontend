'use client'

import React from 'react'
import { Collapse } from 'antd'
import StreamingText from '../StreamingText'

/**
 * 思考过程组件
 * 显示AI的深度思考过程（如果有）
 */
interface ThinkingProcessProps {
  /** 思考过程内容 */
  content: string
}

export default function ThinkingProcess({ content }: ThinkingProcessProps) {
  if (!content) {
    return null
  }

  return (
    <Collapse
      size="small"
      style={{ marginBottom: '12px' }}
      items={[
        {
          key: 'thinking',
          label: (
            <span style={{ fontWeight: 500 }}>
              💭 深度思考
            </span>
          ),
          children: (
            <div style={{ backgroundColor: '#f5f7fa', padding: '12px', borderRadius: '6px' }}>
              <StreamingText
                content={content}
                isStreaming={false}
              />
            </div>
          ),
        },
      ]}
    />
  )
}

