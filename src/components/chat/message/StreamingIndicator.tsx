'use client'

import React from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { messageStyles, colors } from './styles'

interface StreamingIndicatorProps {
  visible: boolean
}

export default function StreamingIndicator({ visible }: StreamingIndicatorProps) {
  if (!visible) {
    return null
  }

  return (
    <div style={messageStyles.indicator}>
      <LoadingOutlined style={{ color: colors.primary, fontSize: '14px' }} spin />
      <span style={{
        color: colors.primary,
        fontSize: '13px',
        fontWeight: 500,
      }}>
        AI 正在思考...
      </span>
    </div>
  )
}


