/**
 * 渐变文字动画组件
 */
'use client'

import { motion } from 'framer-motion'
import { CSSProperties } from 'react'

interface GradientTextProps {
  children: React.ReactNode
  gradient?: string
  animated?: boolean
  className?: string
  style?: CSSProperties
}

export const GradientText: React.FC<GradientTextProps> = ({ 
  children,
  gradient = 'linear-gradient(90deg, #1890ff, #52c41a, #faad14)',
  animated = true,
  className,
  style
}) => {
  const textStyle: CSSProperties = {
    background: gradient,
    backgroundSize: animated ? '200% 200%' : '100% 100%',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 'bold',
    display: 'inline-block',
    ...style
  }

  if (!animated) {
    return (
      <span style={textStyle} className={className}>
        {children}
      </span>
    )
  }

  return (
    <motion.span
      style={textStyle}
      className={className}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'linear'
      }}
    >
      {children}
    </motion.span>
  )
}
