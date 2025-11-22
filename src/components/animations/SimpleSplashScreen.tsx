/**
 * 简洁版首屏加载动画
 * 更轻量的加载动画选项
 */
'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SimpleSplashScreenProps {
  minDuration?: number
  onComplete?: () => void
}

export const SimpleSplashScreen: React.FC<SimpleSplashScreenProps> = ({
  minDuration = 1000,
  onComplete,
}) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      onComplete?.()
    }, minDuration)

    const handleLoad = () => {
      setTimeout(() => {
        setIsLoading(false)
        onComplete?.()
      }, 300)
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
    }

    return () => {
      clearTimeout(timer)
      window.removeEventListener('load', handleLoad)
    }
  }, [minDuration, onComplete])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            zIndex: 99999,
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.4, 0, 0.2, 1],
            }}
            style={{
              textAlign: 'center',
            }}
          >
            {/* 图标 */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                fontSize: '80px',
                marginBottom: '20px',
              }}
            >
              🐟
            </motion.div>

            {/* 文字 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
                margin: 0,
              }}
            >
              水产品安全监测平台
            </motion.h1>

            {/* 加载点 */}
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              justifyContent: 'center',
              marginTop: '24px',
            }}>
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'white',
                  }}
                  animate={{
                    y: [0, -12, 0],
                    opacity: [0.5, 1, 0.5],
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
        </motion.div>
      )}
    </AnimatePresence>
  )
}
