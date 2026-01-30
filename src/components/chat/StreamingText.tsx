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
      <div>
        <MarkdownRenderer content={content} isStreaming={isStreaming} />
      </div>

      {isStreaming && content && (
        <span
          style={{
            display: 'inline-block',
            width: '2px',
            height: '1em',
            backgroundColor: '#52c41a',
            marginLeft: '2px',
            verticalAlign: 'text-bottom',
            animation: 'blink 1s ease-in-out infinite',
          }}
        />
      )}
      
      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
