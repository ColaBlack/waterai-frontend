'use client'

import React, { useEffect, useRef, useLayoutEffect } from 'react'
import { marked } from 'marked'

interface StreamingTextProps {
  content: string
  isStreaming?: boolean
}

// 配置 marked
marked.setOptions({
  breaks: true,        // 支持 GFM 换行符
  gfm: true,           // 启用 GitHub Flavored Markdown
  headerIds: false,    // 不生成标题ID
  mangle: false,       // 不混淆邮箱地址
})

/**
 * 流式文本显示组件
 * 使用DOM直接操作确保实时更新
 */
export default function StreamingText({ content, isStreaming = false }: StreamingTextProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const lastContentRef = useRef<string>('')

  // 使用useLayoutEffect确保在浏览器绘制前同步更新
  useLayoutEffect(() => {
    if (contentRef.current && content !== lastContentRef.current) {
      try {
        // 使用marked渲染Markdown，保留换行符
        const html = marked.parse(content) as string
        
        // 直接设置innerHTML，强制浏览器立即渲染
        contentRef.current.innerHTML = html
        lastContentRef.current = content
      } catch (error) {
        console.error('Markdown parsing error:', error)
        // 降级方案：纯文本 + 换行
        contentRef.current.textContent = content
        lastContentRef.current = content
      }
    }
  }, [content])

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
      <div
        ref={contentRef}
        className="markdown-content"
        style={{ 
          fontSize: '15px', 
          lineHeight: '1.6',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          whiteSpace: 'pre-wrap',
          minHeight: '1em'
        }}
      />
      
      {/* 打字机光标 */}
      {isStreaming && content && (
        <span 
          style={{
            display: 'inline-block',
            width: '2px',
            height: '1em',
            backgroundColor: '#52c41a',
            marginLeft: '2px',
            animation: 'blink 1s infinite',
            verticalAlign: 'text-bottom'
          }}
        />
      )}
    </div>
  )
}

