'use client'

import React, { useEffect, useRef } from 'react'
import { ChatMessage } from '@/lib/types/chat'
import MessageItem from './MessageItem'
import EmptyState from './message/EmptyState'

/**
 * 消息列表组件
 * 负责显示聊天消息列表，并处理自动滚动
 */
interface MessageListProps {
  /** 消息列表 */
  messages: ChatMessage[]
  /** 渲染计数器，用于强制重新渲染 */
  renderCounter?: number
  /** 是否正在加载 */
  isLoading: boolean
  /** 使用示例问题回调 */
  onUseSample?: (question: string) => void
}

export default function MessageList({ messages, renderCounter = 0, isLoading, onUseSample }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const lastMessageCountRef = useRef<number>(0)
  const lastRenderCounterRef = useRef<number>(0)

  // 自动滚动到底部 - 只在消息数量变化或渲染计数器变化时触发
  useEffect(() => {
    const messageCount = messages.length
    const messageCountChanged = messageCount !== lastMessageCountRef.current
    const renderCounterChanged = renderCounter !== lastRenderCounterRef.current
    
    if (messageCountChanged || renderCounterChanged) {
      lastMessageCountRef.current = messageCount
      lastRenderCounterRef.current = renderCounter
      
      // 使用 requestAnimationFrame 确保 DOM 更新后再滚动
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

