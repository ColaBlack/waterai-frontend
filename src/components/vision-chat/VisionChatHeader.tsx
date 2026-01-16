'use client'

import React from 'react'
import { Space, Typography } from 'antd'
import { CameraOutlined } from '@ant-design/icons'

const { Title } = Typography

interface VisionChatHeaderProps {
  chatId: string
}

export default function VisionChatHeader({ chatId }: VisionChatHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Space>
        <CameraOutlined style={{ fontSize: '24px', color: '#667eea' }} />
        <Title level={4} style={{ margin: 0 }}>
          视觉AI对话
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


