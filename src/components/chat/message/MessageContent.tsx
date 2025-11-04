'use client'

import React from 'react'
import { Card } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import StreamingText from '../StreamingText'

/**
 * 消息内容组件
 * 显示消息的主体内容
 */
interface MessageContentProps {
  /** 消息内容 */
  content: string
  /** 是否为用户消息 */
  isUser: boolean
  /** 是否正在流式输出 */
  isStreaming: boolean
  /** 思考过程内容（可选） */
  thinkingProcess?: string
}

export default function MessageContent({
  content,
  isUser,
  isStreaming,
  thinkingProcess,
}: MessageContentProps) {
  return (
    <Card
      size="small"
      style={{
        backgroundColor: isUser ? '#f0f2f5' : '#ffffff',
        border: isUser ? 'none' : '1px solid #e5e6eb',
      }}
    >
      {/* 思考过程（如果存在） */}
      {thinkingProcess && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontWeight: 500, marginBottom: '8px' }}>💭 深度思考</div>
          <div style={{ backgroundColor: '#f5f7fa', padding: '12px', borderRadius: '6px' }}>
            <StreamingText
              content={thinkingProcess}
              isStreaming={false}
            />
          </div>
        </div>
      )}
      
      {/* 消息内容 */}
      <StreamingText
        content={content}
        isStreaming={isStreaming}
      />
      
      {/* 加载指示器 - 仅在还没有内容时显示 */}
      {isStreaming && !content && (
        <div style={{ marginTop: '8px', color: '#999' }}>
          <LoadingOutlined style={{ marginRight: '6px' }} />
          AI 正在思考...
        </div>
      )}
    </Card>
  )
}

