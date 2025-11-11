'use client'

import React from 'react'
import { SAMPLE_QUESTIONS } from '@/lib/constants/chat'

interface SampleQuestionsProps {
  onUseSample: (question: string) => void
}

export default function SampleQuestions({ onUseSample }: SampleQuestionsProps) {
  return (
    <div style={{
      marginTop: '32px',
      width: '100%',
      maxWidth: '600px',
    }}>
      <h4 style={{
        marginBottom: '16px',
        textAlign: 'center',
      }}>
        💡 示例问题
      </h4>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '12px',
      }}>
        {SAMPLE_QUESTIONS.map((question, index) => (
          <div
            key={index}
            onClick={() => onUseSample(question)}
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
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


