'use client'

import React from 'react'
import { Button } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import { formatTimestamp } from '@/lib/utils/messageParser'

/**
 * 消息操作栏组件
 * 显示时间戳和操作按钮（如复制）
 */
interface MessageActionsProps {
  /** 消息时间戳 */
  timestamp: number
  /** 是否为用户消息 */
  isUser: boolean
  /** 是否正在流式输出 */
  isStreaming: boolean
  /** 复制内容 */
  content: string
  /** 复制成功回调 */
  onCopySuccess?: () => void
  /** 复制失败回调 */
  onCopyError?: () => void
}

export default function MessageActions({
  timestamp,
  isUser,
  isStreaming,
  content,
  onCopySuccess,
  onCopyError,
}: MessageActionsProps) {
  const handleCopy = async () => {
    const { copyToClipboard } = await import('@/lib/utils/messageParser')
    const success = await copyToClipboard(content)
    if (success) {
      onCopySuccess?.()
    } else {
      onCopyError?.()
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        marginTop: '4px',
        fontSize: '12px',
        color: '#999',
        paddingLeft: isUser ? '0' : '8px',
        paddingRight: isUser ? '8px' : '0',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        alignItems: 'center',
      }}
    >
      <span>{formatTimestamp(timestamp)}</span>
      {!isUser && !isStreaming && (
        <Button
          type="text"
          size="small"
          icon={<CopyOutlined />}
          onClick={handleCopy}
        >
          复制
        </Button>
      )}
    </div>
  )
}

