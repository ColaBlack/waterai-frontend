'use client'

import React from 'react'
import { Avatar } from 'antd'
import { UserOutlined, RobotOutlined } from '@ant-design/icons'

/**
 * 头像徽章组件
 * 用于显示用户或AI的头像
 */
interface AvatarBadgeProps {
  /** 是否为用户 */
  isUser: boolean
}

export default function AvatarBadge({ isUser }: AvatarBadgeProps) {
  return (
    <Avatar
      icon={isUser ? <UserOutlined /> : <RobotOutlined />}
      style={{
        backgroundColor: isUser ? '#667eea' : '#52c41a',
        flexShrink: 0,
      }}
    />
  )
}

