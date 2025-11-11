'use client'

import React from 'react'
import { Empty } from 'antd'
import { CommentOutlined } from '@ant-design/icons'
import SampleQuestions from './SampleQuestions'

interface EmptyStateProps {
  onUseSample?: (question: string) => void
}

export default function EmptyState({ onUseSample }: EmptyStateProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
    }}>
      <Empty
        image={<CommentOutlined style={{ fontSize: '64px', color: '#999' }} />}
        description={
          <div>
            <h3>开始新的对话</h3>
            <p style={{ color: '#999' }}>请输入您的问题，或点击下方示例问题</p>
          </div>
        }
      />
      {onUseSample && <SampleQuestions onUseSample={onUseSample} />}
    </div>
  )
}
