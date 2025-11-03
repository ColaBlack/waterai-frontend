'use client'

import React, { useEffect, useRef } from 'react'
import { Empty, Card } from 'antd'
import { CommentOutlined } from '@ant-design/icons'
import { ChatMessage } from '@/lib/types/chat'
import { SAMPLE_QUESTIONS } from '@/lib/constants/chat'
import MessageItem from './MessageItem'

interface MessageListProps {
  messages: ChatMessage[]
  renderCounter?: number
  isLoading: boolean
  onUseSample?: (question: string) => void
}

export default function MessageList({ messages, renderCounter = 0, isLoading, onUseSample }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    })
  }, [messages, renderCounter])

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
      }}
    >
      {messages.length === 0 && !isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Empty
            image={<CommentOutlined style={{ fontSize: '64px', color: '#999' }} />}
            description={
              <div>
                <h3>开始新的对话</h3>
                <p style={{ color: '#999' }}>请输入您的问题，或点击下方示例问题</p>
              </div>
            }
          />
          
          {/* 示例问题 */}
          <div style={{ marginTop: '32px', width: '100%', maxWidth: '600px' }}>
            <h4 style={{ marginBottom: '16px', textAlign: 'center' }}>💡 示例问题</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
              {SAMPLE_QUESTIONS.map((question, index) => (
                <Card
                  key={index}
                  hoverable
                  size="small"
                  onClick={() => onUseSample?.(question)}
                  style={{
                    cursor: 'pointer',
                    borderColor: '#e5e6eb',
                    transition: 'all 0.3s',
                  }}
                  styles={{
                    body: { padding: '12px 16px' }
                  }}
                >
                  {question}
                </Card>
              ))}
            </div>
          </div>
        </div>
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

