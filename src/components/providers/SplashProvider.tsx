/**
 * 首屏加载Provider
 * 管理首屏加载状态
 */
'use client'

import React, { useState, useEffect } from 'react'
import { SplashScreen } from '@/components/animations/SplashScreen'

interface SplashProviderProps {
  children: React.ReactNode
}

export const SplashProvider: React.FC<SplashProviderProps> = ({ children }) => {
  const [showSplash, setShowSplash] = useState(true)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // 检查是否是首次加载
    const hasVisited = sessionStorage.getItem('hasVisited')
    
    if (hasVisited) {
      // 如果不是首次访问，快速显示内容
      setShowSplash(false)
      setIsReady(true)
    } else {
      // 首次访问，显示完整的加载动画
      sessionStorage.setItem('hasVisited', 'true')
    }
  }, [])

  const handleSplashComplete = () => {
    setShowSplash(false)
    setTimeout(() => {
      setIsReady(true)
    }, 100)
  }

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      {isReady && children}
    </>
  )
}
