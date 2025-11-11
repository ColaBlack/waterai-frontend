'use client'

import React from 'react'
import { Avatar } from 'antd'
import { UserOutlined, RobotOutlined } from '@ant-design/icons'

interface AvatarBadgeProps {
  isUser: boolean
}

const AVATAR_STYLES = {
  user: {
    backgroundColor: '#667eea',
  },
  ai: {
    backgroundColor: '#52c41a',
  },
} as const

export default function AvatarBadge({ isUser }: AvatarBadgeProps) {
  return (
    <Avatar
      icon={isUser ? <UserOutlined /> : <RobotOutlined />}
      style={{
        ...(isUser ? AVATAR_STYLES.user : AVATAR_STYLES.ai),
        flexShrink: 0,
      }}
    />
  )
}
