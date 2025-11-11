'use client'

import React from 'react'
import { Card } from 'antd'
import StreamingText from '../StreamingText'
import RAGDocumentsPanel from './RAGDocumentsPanel'
import ToolCallsPanel from './ToolCallsPanel'
import ThinkingProcessPanel from './ThinkingProcessPanel'
import StreamingIndicator from './StreamingIndicator'
import type { AIMessageMetadata } from '@/lib/types/chat'
import { messageStyles } from './styles'

interface MessageContentProps {
  content: string
  isUser: boolean
  isStreaming: boolean
  thinkingProcess?: string
  metadata?: AIMessageMetadata
}

export default function MessageContent({
  content,
  isUser,
  isStreaming,
  thinkingProcess,
  metadata,
}: MessageContentProps) {
  const cardStyle = isUser ? messageStyles.card.user : messageStyles.card.ai

  return (
    <Card size="small" style={cardStyle}>
      {metadata?.retrievedDocuments && metadata.retrievedDocuments.length > 0 && (
        <RAGDocumentsPanel documents={metadata.retrievedDocuments} />
      )}

      {metadata?.toolCalls && metadata.toolCalls.length > 0 && (
        <ToolCallsPanel
          toolCalls={metadata.toolCalls}
          isStreaming={isStreaming}
        />
      )}

      {thinkingProcess && (
        <ThinkingProcessPanel content={thinkingProcess} />
      )}

      <StreamingText content={content} isStreaming={isStreaming} />

      <StreamingIndicator visible={isStreaming} />
    </Card>
  )
}
