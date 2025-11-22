/**
 * 滚动显示动画组件
 * 元素进入视口时触发动画
 */
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface ScrollRevealProps {
  children: React.ReactNode
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade'
  delay?: number
  duration?: number
  once?: boolean
  threshold?: number
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.5,
  once = true,
  threshold = 0.1,
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: threshold })

  const variants = {
    up: {
      hidden: { y: 50, opacity: 0 },
      visible: { y: 0, opacity: 1 },
    },
    down: {
      hidden: { y: -50, opacity: 0 },
      visible: { y: 0, opacity: 1 },
    },
    left: {
      hidden: { x: 50, opacity: 0 },
      visible: { x: 0, opacity: 1 },
    },
    right: {
      hidden: { x: -50, opacity: 0 },
      visible: { x: 0, opacity: 1 },
    },
    scale: {
      hidden: { scale: 0.8, opacity: 0 },
      visible: { scale: 1, opacity: 1 },
    },
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
  }

  return (
    <motion.div
      ref={ref}
      variants={variants[direction]}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
