/**
 * 打字机文字动画组件
 * 逐字显示文字效果
 */
'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TypewriterTextProps {
  text: string
  speed?: number
  delay?: number
  cursor?: boolean
  onComplete?: () => void
  className?: string
  style?: React.CSSProperties
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 50,
  delay = 0,
  cursor = true,
  onComplete,
  className,
  style,
}) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (delay > 0) {
      const delayTimer = setTimeout(() => {
        setCurrentIndex(0)
      }, delay)
      return () => clearTimeout(delayTimer)
    }
  }, [delay])

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)
      return () => clearTimeout(timer)
    } else if (currentIndex === text.length && !isComplete) {
      setIsComplete(true)
      onComplete?.()
    }
  }, [currentIndex, text, speed, isComplete, onComplete])

  return (
    <span className={className} style={style}>
      {displayText}
      {cursor && !isComplete && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            display: 'inline-block',
            width: '2px',
            height: '1em',
            backgroundColor: 'currentColor',
            marginLeft: '2px',
            verticalAlign: 'text-bottom',
          }}
        />
      )}
    </span>
  )
}
