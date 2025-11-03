'use client'

import React from 'react'
import { Space, Typography } from 'antd'
import { CommentOutlined } from '@ant-design/icons'

const { Title } = Typography

interface ChatHeaderProps {
  chatId: string
}

export default function ChatHeader({ chatId }: ChatHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Space>
        <CommentOutlined style={{ fontSize: '24px', color: '#667eea' }} />
        <Title level={4} style={{ margin: 0 }}>
          AI 智能问答
        </Title>
      </Space>
      {chatId && (
        <span style={{ fontSize: '12px', color: '#999' }}>
          会话ID: {chatId.substring(0, 20)}...
        </span>
      )}
    </div>
  )
}

