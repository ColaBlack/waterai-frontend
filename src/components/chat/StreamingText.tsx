'use client'

import React from 'react'
import MarkdownRenderer from './markdown/MarkdownRenderer'

interface StreamingTextProps {
  content: string
  isStreaming?: boolean
}

export default function StreamingText({ content, isStreaming = false }: StreamingTextProps) {
  return (
    <div style={{ position: 'relative', display: 'block', width: '100%' }}>
      <MarkdownRenderer content={content} />

      {isStreaming && content && (
        <span
          style={{
            display: 'inline-block',
            width: '2px',
            height: '1em',
            backgroundColor: '#52c41a',
            marginLeft: '2px',
            animation: 'blink 1s infinite',
            verticalAlign: 'text-bottom',
          }}
        />
      )}
    </div>
  )
}
