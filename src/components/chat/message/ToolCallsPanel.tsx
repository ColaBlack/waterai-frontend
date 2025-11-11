'use client'

import React from 'react'
import { Collapse, Tag, Space } from 'antd'
import { ToolOutlined, SyncOutlined } from '@ant-design/icons'
import type { ToolCall } from '@/lib/types/chat'
import ToolCallItem from './ToolCallItem'
import { messageStyles } from './styles'

interface ToolCallsPanelProps {
  toolCalls: ToolCall[]
  isStreaming: boolean
}

export default function ToolCallsPanel({ toolCalls, isStreaming }: ToolCallsPanelProps) {
  if (!toolCalls || toolCalls.length === 0) {
    return null
  }

  const hasActiveTool = toolCalls.some(t => t.status === 'calling' || t.status === 'pending')

  return (
    <div style={{ marginBottom: '12px' }}>
      <Collapse
        ghost
        defaultActiveKey={isStreaming ? ['tools'] : []}
        expandIconPosition="end"
        style={messageStyles.collapse.tools}
        items={[
          {
            key: 'tools',
            label: (
              <Space>
                <ToolOutlined style={{ color: '#fa8c16' }} />
                <span style={{ fontWeight: 500 }}>
                  工具调用 ({toolCalls.length})
                </span>
                {isStreaming && hasActiveTool && (
                  <Tag color="processing" icon={<SyncOutlined spin />}>
                    执行中...
                  </Tag>
                )}
              </Space>
            ),
            children: (
              <div style={messageStyles.content}>
                {toolCalls.map((tool, index) => (
                  <ToolCallItem key={tool.id || index} tool={tool} index={index} />
                ))}
              </div>
            ),
          },
        ]}
      />
    </div>
  )
}


