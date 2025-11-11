'use client'

import React from 'react'
import { Card, Tag, Space, Alert } from 'antd'
import { LoadingOutlined, ToolOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import type { ToolCall } from '@/lib/types/chat'
import { messageStyles, colors } from './styles'

interface ToolCallItemProps {
  tool: ToolCall
  index: number
}

function getStatusTag(status?: string) {
  switch (status) {
    case 'calling':
      return <Tag color="processing" icon={<LoadingOutlined spin />}>执行中</Tag>
    case 'completed':
      return <Tag color="success" icon={<CheckCircleOutlined />}>已完成</Tag>
    case 'failed':
      return <Tag color="error" icon={<CloseCircleOutlined />}>失败</Tag>
    case 'pending':
    default:
      return <Tag color="default">等待中</Tag>
  }
}

function getBorderColor(status?: string): string {
  switch (status) {
    case 'completed':
      return messageStyles.toolCard.borderLeft.completed
    case 'failed':
      return messageStyles.toolCard.borderLeft.failed
    case 'calling':
      return messageStyles.toolCard.borderLeft.calling
    default:
      return messageStyles.toolCard.borderLeft.default
  }
}

export default function ToolCallItem({ tool, index }: ToolCallItemProps) {
  return (
    <Card
      key={tool.id || index}
      size="small"
      style={{
        marginBottom: '8px',
        borderLeft: `3px solid ${getBorderColor(tool.status)}`,
      }}
      title={
        <Space>
          <ToolOutlined />
          <span style={{ fontWeight: 500 }}>{tool.name}</span>
          {getStatusTag(tool.status)}
        </Space>
      }
    >
      {tool.arguments && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{
            fontWeight: 500,
            marginBottom: '6px',
            fontSize: '13px',
            color: colors.text.secondary,
          }}>
            📥 调用参数:
          </div>
          <div style={messageStyles.codeBlock}>
            {tool.arguments}
          </div>
        </div>
      )}

      {tool.status === 'calling' && (
        <div style={{ marginBottom: '12px' }}>
          <Alert
            message="工具正在执行中..."
            type="info"
            icon={<LoadingOutlined />}
            showIcon
            style={{ fontSize: '12px' }}
          />
        </div>
      )}

      {tool.status === 'failed' && tool.error && (
        <div style={{ marginBottom: '12px' }}>
          <Alert
            message="工具调用失败"
            description={tool.error}
            type="error"
            showIcon
            style={{ fontSize: '12px' }}
          />
        </div>
      )}

      {tool.status === 'completed' && tool.result && (
        <div>
          <div style={{
            fontWeight: 500,
            marginBottom: '6px',
            fontSize: '13px',
            color: colors.text.secondary,
          }}>
            ✅ 执行结果:
          </div>
          <div style={messageStyles.resultBlock}>
            {tool.result}
          </div>
        </div>
      )}

      {tool.status === 'completed' && !tool.result && (
        <div style={{
          color: colors.text.tertiary,
          fontSize: '12px',
          fontStyle: 'italic',
        }}>
          工具执行完成，无返回值
        </div>
      )}
    </Card>
  )
}


