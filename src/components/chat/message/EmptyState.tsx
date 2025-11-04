'use client'

import React from 'react'
import { Empty } from 'antd'
import { CommentOutlined } from '@ant-design/icons'
import { SAMPLE_QUESTIONS } from '@/lib/constants/chat'

/**
 * 空状态组件
 * 当消息列表为空时显示
 */
interface EmptyStateProps {
  /** 示例问题点击回调 */
  onUseSample?: (question: string) => void
}

export default function EmptyState({ onUseSample }: EmptyStateProps) {
  return (
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
      {onUseSample && <SampleQuestions onUseSample={onUseSample} />}
    </div>
  )
}

/**
 * 示例问题组件
 */
interface SampleQuestionsProps {
  /** 示例问题点击回调 */
  onUseSample: (question: string) => void
}

function SampleQuestions({ onUseSample }: SampleQuestionsProps) {
  return (
    <div style={{ marginTop: '32px', width: '100%', maxWidth: '600px' }}>
      <h4 style={{ marginBottom: '16px', textAlign: 'center' }}>💡 示例问题</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
        {SAMPLE_QUESTIONS.map((question, index) => (
          <div
            key={index}
            onClick={() => onUseSample(question)}
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              borderColor: '#e5e6eb',
              border: '1px solid #e5e6eb',
              borderRadius: '6px',
              transition: 'all 0.3s',
              backgroundColor: '#ffffff',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f7fa'
              e.currentTarget.style.borderColor = '#667eea'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff'
              e.currentTarget.style.borderColor = '#e5e6eb'
            }}
          >
            {question}
          </div>
        ))}
      </div>
    </div>
  )
}

