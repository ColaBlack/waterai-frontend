/**
 * 悬浮元素动画组件
 * 创建漂浮的装饰性元素
 */
'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface FloatingElementsProps {
  count?: number
  colors?: string[]
  size?: { min: number; max: number }
  speed?: { min: number; max: number }
}

export const FloatingElements: React.FC<FloatingElementsProps> = ({
  count = 15,
  colors = ['#667eea', '#52c41a', '#faad14', '#1890ff', '#722ed1'],
  size = { min: 20, max: 60 },
  speed = { min: 10, max: 25 },
}) => {
  const elements = Array.from({ length: count }, (_, i) => {
    const randomSize = Math.random() * (size.max - size.min) + size.min
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    const randomDuration = Math.random() * (speed.max - speed.min) + speed.min
    const randomDelay = Math.random() * 5
    const randomX = Math.random() * 100
    const randomY = Math.random() * 100
    const randomShape = Math.random() > 0.5 ? '50%' : '8px'

    return {
      id: i,
      size: randomSize,
      color: randomColor,
      duration: randomDuration,
      delay: randomDelay,
      x: randomX,
      y: randomY,
      shape: randomShape,
    }
  })

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {elements.map((element) => (
        <motion.div
          key={element.id}
          style={{
            position: 'absolute',
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: element.size,
            height: element.size,
            background: element.color,
            borderRadius: element.shape,
            opacity: 0.1,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
