'use client'

import React from 'react'
import { Button } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import { formatTimestamp } from '@/lib/utils/messageParser'
import { colors } from './styles'

interface MessageActionsProps {
  timestamp: number
  isUser: boolean
  isStreaming: boolean
  content: string
  onCopySuccess?: () => void
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
        color: colors.text.disabled,
        paddingLeft: isUser ? '0' : '8px',
        paddingRight: isUser ? '8px' : '0',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        alignItems: 'center',
      }}
    >
      <span>{formatTimestamp(timestamp)}</span>
      {!isStreaming && (
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
