/**
 * 页面过渡动画组件
 * 用于路由切换时的进场和退场动画
 */
'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: React.ReactNode
  mode?: 'fade' | 'slide' | 'scale' | 'rotate' | 'flip'
}

const variants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
  },
  scale: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.2, opacity: 0 },
  },
  rotate: {
    initial: { rotate: -10, opacity: 0 },
    animate: { rotate: 0, opacity: 1 },
    exit: { rotate: 10, opacity: 0 },
  },
  flip: {
    initial: { rotateY: 90, opacity: 0 },
    animate: { rotateY: 0, opacity: 1 },
    exit: { rotateY: -90, opacity: 0 },
  },
}

export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  mode = 'fade' 
}) => {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={variants[mode]}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1],
        }}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
