/**
 * 路由加载进度条组件
 * 页面切换时显示顶部进度条
 */
'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置 NProgress
NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.08,
  easing: 'ease',
  speed: 500,
})

export const RouteProgress = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    NProgress.start()
    const timer = setTimeout(() => {
      NProgress.done()
    }, 300)

    return () => {
      clearTimeout(timer)
      NProgress.done()
    }
  }, [pathname, searchParams])

  return null
}
