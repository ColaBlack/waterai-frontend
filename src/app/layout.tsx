import type { Metadata } from 'next'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import '@ant-design/v5-patch-for-react-19'
import AntdAppProvider from '@/components/providers/AntdAppProvider'
import { SplashProvider } from '@/components/providers/SplashProvider'
import { RouteProgress } from '@/components/animations/RouteProgress'
import './globals.css'
import '@/styles/animations.css'
import '@/styles/nprogress.css'
import '@/styles/chat-enhanced.css'
import '@/styles/vision-chat-enhanced.css'

// 页面元数据配置
export const metadata: Metadata = {
  title: '水产品食品安全监测智能问答平台',
  description: 'AI-powered intelligent Q&A platform for aquatic food safety monitoring',
}

/**
 * 根布局组件
 * 提供全局的UI配置和主题设置
 * @param children - 子组件内容
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        {/* 首屏加载动画 */}
        <SplashProvider>
          {/* 路由加载进度条 */}
          <RouteProgress />
          
          {/* Ant Design 注册器，用于服务端渲染样式 */}
          <AntdRegistry>
            {/* 配置 Ant Design 主题和国际化 */}
            <ConfigProvider locale={zhCN} theme={{
              token: {
                colorPrimary: '#0EA5E9', // 主色调：天空蓝
                colorInfo: '#38BDF8',    // 信息色：亮天蓝
                colorSuccess: '#22C55E', // 成功色：绿色
                colorWarning: '#F97316', // 警告色：橙色
                borderRadius: 12,        // 圆角大小
                fontSize: 14,
              },
            }}>
              {/* 应用级别的 Ant Design 提供者 */}
              <AntdAppProvider>
                {children}
              </AntdAppProvider>
            </ConfigProvider>
          </AntdRegistry>
        </SplashProvider>
      </body>
    </html>
  )
}

