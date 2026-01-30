'use client'

import React, { useLayoutEffect, useRef } from 'react'
import { marked } from './config'

interface MarkdownRendererProps {
  content: string
  isStreaming?: boolean
}

export default function MarkdownRenderer({ content, isStreaming = false }: MarkdownRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const lastContentRef = useRef<string>('')

  useLayoutEffect(() => {
    if (!contentRef.current) {
      return
    }

    // 流式传输时，即使内容相同也要重新渲染，因为可能需要更新 Markdown 解析
    if (!isStreaming && content === lastContentRef.current) {
      return
    }

    const contentStr = typeof content === 'string' ? content : String(content || '')

    try {
      if (content === null || content === undefined) {
        contentRef.current.innerHTML = ''
        lastContentRef.current = contentStr
        return
      }

      // 始终尝试解析 Markdown，即使在流式传输中
      const html = marked.parse(contentStr) as string
      
      // 检查解析结果是否合理（避免内容丢失）
      if (html && html.length > 0) {
        contentRef.current.innerHTML = html
      } else {
        // 如果Markdown解析结果为空，使用原始文本
        contentRef.current.style.whiteSpace = 'pre-wrap'
        contentRef.current.textContent = contentStr
      }
      lastContentRef.current = contentStr
    } catch (error) {
      // Markdown解析错误，使用原始文本
      if (contentRef.current) {
        contentRef.current.style.whiteSpace = 'pre-wrap'
        contentRef.current.textContent = contentStr
        lastContentRef.current = contentStr
      }
    }
  }, [content, isStreaming])

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


