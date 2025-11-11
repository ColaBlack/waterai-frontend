'use client'

import React, { useEffect, useRef } from 'react'
import { ChatMessage } from '@/lib/types/chat'
import MessageItem from './MessageItem'
import EmptyState from './message/EmptyState'

interface MessageListProps {
  messages: ChatMessage[]
  renderCounter?: number
  isLoading: boolean
  onUseSample?: (question: string) => void
}

export default function MessageList({
  messages,
  renderCounter = 0,
  isLoading,
  onUseSample,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const lastMessageCountRef = useRef<number>(0)
  const lastRenderCounterRef = useRef<number>(0)

  useEffect(() => {
    const messageCount = messages.length
    const messageCountChanged = messageCount !== lastMessageCountRef.current
    const renderCounterChanged = renderCounter !== lastRenderCounterRef.current

    if (messageCountChanged || renderCounterChanged) {
      lastMessageCountRef.current = messageCount
      lastRenderCounterRef.current = renderCounter

      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      })
    }
  }, [messages.length, renderCounter])

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
      }}
    >
      {messages.length === 0 && !isLoading ? (
        <EmptyState onUseSample={onUseSample} />
      ) : (
        <>
          {messages.map((msg, index) => (
            <MessageItem
              key={`${renderCounter}-${index}-${msg.content.length}`}
              message={msg}
              renderKey={`${renderCounter}-${msg.content.length}`}
            />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  )
}
