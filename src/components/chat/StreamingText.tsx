'use client'

import React, { useEffect, useRef, useLayoutEffect } from 'react'
import { marked } from 'marked'

interface StreamingTextProps {
  content: string
  isStreaming?: boolean
}

// 配置 marked - 支持 GFM 换行符和列表
marked.setOptions({
  breaks: true,        // 支持 GFM 换行符（单个换行符转换为 <br>）
  gfm: true,           // 启用 GitHub Flavored Markdown（支持列表等）
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
      // 确保 content 是字符串
      const contentStr = typeof content === 'string' ? content : String(content || '')
      
      try {
        // 如果内容为 null 或 undefined，清空内容
        if (content === null || content === undefined) {
          contentRef.current.innerHTML = ''
          lastContentRef.current = contentStr
          return
        }
        
        // 即使内容为空字符串，也要渲染（保留空白字符和换行符）
        // 因为流式传输时，内容可能暂时为空，但后续会有内容
        
        // 开发环境：记录原始内容，便于调试
        if (process.env.NODE_ENV === 'development') {
          console.log('[StreamingText] Rendering content:', {
            contentLength: contentStr.length,
            hasNewlines: contentStr.includes('\n'),
            hasListItems: /^[-*+]\s+/m.test(contentStr),
            contentPreview: contentStr.substring(0, 200).replace(/\n/g, '\\n')
          })
        }
        
        // 使用 marked 渲染 Markdown
        // breaks: true - 单个换行符转换为 <br>，这样换行会被保留
        // gfm: true - 启用 GitHub Flavored Markdown（支持列表、任务列表等）
        // marked 会自动识别列表项（以 -、* 或 + 开头，后面跟空格）
        const html = marked.parse(contentStr) as string
        
        // 开发环境：记录渲染后的 HTML
        if (process.env.NODE_ENV === 'development') {
          console.log('[StreamingText] Rendered HTML:', {
            htmlLength: html.length,
            hasListTags: html.includes('<ul>') || html.includes('<li>'),
            hasBrTags: html.includes('<br>'),
            htmlPreview: html.substring(0, 300)
          })
        }
        
        // 直接设置 innerHTML，让浏览器渲染 Markdown HTML
        contentRef.current.innerHTML = html
        lastContentRef.current = contentStr
      } catch (error) {
        console.error('Markdown parsing error:', error, 'Content:', contentStr.substring(0, 100))
        // 降级方案：纯文本显示，保留换行符和所有字符
        if (contentRef.current) {
          contentRef.current.style.whiteSpace = 'pre-wrap'
          contentRef.current.textContent = contentStr
          lastContentRef.current = contentStr
        }
      }
    }
  }, [content])

  return (
    <div style={{ position: 'relative', display: 'block', width: '100%' }}>
      <div
        ref={contentRef}
        className="markdown-content"
        style={{ 
          fontSize: '15px', 
          lineHeight: '1.8',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
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

