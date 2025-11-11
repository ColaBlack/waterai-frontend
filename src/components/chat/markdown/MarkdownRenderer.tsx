'use client'

import React, { useLayoutEffect, useRef } from 'react'
import { marked } from './config'

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const lastContentRef = useRef<string>('')

  useLayoutEffect(() => {
    if (!contentRef.current || content === lastContentRef.current) {
      return
    }

    const contentStr = typeof content === 'string' ? content : String(content || '')

    try {
      if (content === null || content === undefined) {
        contentRef.current.innerHTML = ''
        lastContentRef.current = contentStr
        return
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('[MarkdownRenderer] Rendering:', {
          length: contentStr.length,
          hasNewlines: contentStr.includes('\n'),
          preview: contentStr.substring(0, 200),
        })
      }

      const html = marked.parse(contentStr) as string
      contentRef.current.innerHTML = html
      lastContentRef.current = contentStr
    } catch (error) {
      console.error('[MarkdownRenderer] Parse error:', error)
      if (contentRef.current) {
        contentRef.current.style.whiteSpace = 'pre-wrap'
        contentRef.current.textContent = contentStr
        lastContentRef.current = contentStr
      }
    }
  }, [content])

  return (
    <div
      ref={contentRef}
      className="markdown-content"
      style={{
        fontSize: '15px',
        lineHeight: '1.8',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        minHeight: '1em',
      }}
    />
  )
}


