/**
 * 页面加载动画组件
 * 首屏加载和路由切换时显示
 */
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GradientText } from './GradientText'

interface PageLoaderProps {
  text?: string
  fullscreen?: boolean
}

export const PageLoader: React.FC<PageLoaderProps> = ({ 
  text = '加载中...', 
  fullscreen = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: fullscreen ? 'fixed' : 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
      }}
    >
      {/* 旋转的圆环 */}
      <motion.div
        style={{
          width: '80px',
          height: '80px',
          border: '4px solid #f0f0f0',
          borderTop: '4px solid #667eea',
          borderRadius: '50%',
          marginBottom: '24px',
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* 加载文字 */}
      <GradientText>
        <motion.h3
          style={{ margin: 0, fontSize: '18px' }}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {text}
        </motion.h3>
      </GradientText>

      {/* 跳动的点 */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#667eea',
            }}
            animate={{
              y: [0, -12, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: index * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}
