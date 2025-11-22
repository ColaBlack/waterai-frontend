/**
 * 首屏加载动画组件
 * 在应用初始化时显示，资源加载完成后消失
 */
'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GradientText } from './GradientText'

interface SplashScreenProps {
  minDuration?: number // 最小显示时长（毫秒）
  onComplete?: () => void
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  minDuration = 1500,
  onComplete,
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // 模拟加载进度
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        // 加速到90%，然后减速
        const increment = prev < 90 ? Math.random() * 15 : Math.random() * 3
        return Math.min(prev + increment, 100)
      })
    }, 100)

    // 确保最小显示时长
    const minTimer = setTimeout(() => {
      setProgress(100)
    }, minDuration)

    // 监听页面加载完成
    const handleLoad = () => {
      setTimeout(() => {
        setProgress(100)
      }, 300)
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
    }

    return () => {
      clearInterval(progressInterval)
      clearTimeout(minTimer)
      window.removeEventListener('load', handleLoad)
    }
  }, [minDuration])

  useEffect(() => {
    if (progress >= 100) {
      // 延迟一点再隐藏，让用户看到100%
      const hideTimer = setTimeout(() => {
        setIsLoading(false)
        onComplete?.()
      }, 500)
      return () => clearTimeout(hideTimer)
    }
  }, [progress, onComplete])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            zIndex: 99999,
          }}
        >
          {/* Logo 动画 */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1],
            }}
            style={{
              marginBottom: '40px',
            }}
          >
            {/* 圆形Logo */}
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '4px solid rgba(255, 255, 255, 0.3)',
                borderTopColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                }}
              >
                🐟
              </motion.div>
            </motion.div>
          </motion.div>

          {/* 平台名称 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              marginBottom: '40px',
              textAlign: 'center',
            }}
          >
            <GradientText
              gradient="linear-gradient(90deg, #ffffff, #f0f0f0, #ffffff)"
              animated={true}
            >
              <h1 style={{ 
                color: 'white', 
                fontSize: '28px', 
                fontWeight: 'bold',
                margin: 0,
                marginBottom: '8px',
              }}>
                水产品食品安全监测
              </h1>
            </GradientText>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontSize: '16px',
              margin: 0,
            }}>
              智能问答平台
            </p>
          </motion.div>

          {/* 加载进度条 */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '300px', opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{
              width: '300px',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '2px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #ffffff, #f0f0f0)',
                borderRadius: '2px',
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
              }}
            />
          </motion.div>

          {/* 加载百分比 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{
              marginTop: '16px',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            {Math.round(progress)}%
          </motion.div>

          {/* 加载提示文字 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            style={{
              marginTop: '24px',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '14px',
            }}
          >
            <motion.span
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              正在加载资源...
            </motion.span>
          </motion.div>

          {/* 装饰性波纹 */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '200px',
            overflow: 'hidden',
          }}>
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                initial={{ y: 200 }}
                animate={{ y: 0 }}
                transition={{
                  delay: index * 0.2,
                  duration: 1,
                  ease: 'easeOut',
                }}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '100px',
                  background: `rgba(255, 255, 255, ${0.05 - index * 0.015})`,
                  borderRadius: '50% 50% 0 0',
                  transform: `translateY(${index * 20}px)`,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
