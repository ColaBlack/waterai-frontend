'use client'

import React from 'react'
import { motion } from 'framer-motion'
import MarkdownRenderer from './markdown/MarkdownRenderer'

interface StreamingTextProps {
  content: string
  isStreaming?: boolean
}

export default function StreamingText({ content, isStreaming = false }: StreamingTextProps) {
  return (
    <div style={{ position: 'relative', display: 'block', width: '100%' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <MarkdownRenderer content={content} />
      </motion.div>

      {isStreaming && content && (
        <motion.span
          style={{
            display: 'inline-block',
            width: '2px',
            height: '1em',
            backgroundColor: '#52c41a',
            marginLeft: '2px',
            verticalAlign: 'text-bottom',
          }}
          animate={{
            opacity: [1, 0, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </div>
  )
}
