'use client'

import React from 'react'
import { Collapse, Space } from 'antd'
import MarkdownRenderer from '../markdown/MarkdownRenderer'
import { messageStyles } from './styles'

interface ThinkingProcessPanelProps {
  content: string
}

export default function ThinkingProcessPanel({ content }: ThinkingProcessPanelProps) {
  if (!content) {
    return null
  }

  return (
    <div style={{ marginBottom: '12px' }}>
      <Collapse
        ghost
        defaultActiveKey={[]}
        expandIconPosition="end"
        style={messageStyles.collapse.thinking}
        items={[
          {
            key: 'thinking',
            label: (
              <Space>
                <span style={{ fontSize: '16px' }}>💭</span>
                <span style={{ fontWeight: 500 }}>深度思考</span>
              </Space>
            ),
            children: (
              <div style={{
                backgroundColor: '#ffffff',
                padding: '12px',
                borderRadius: '6px',
                ...messageStyles.content,
                overflowY: 'auto',
              }}>
                <MarkdownRenderer content={content} />
              </div>
            ),
          },
        ]}
      />
    </div>
  )
}

