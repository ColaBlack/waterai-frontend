import type { Metadata } from 'next'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import '@ant-design/v5-patch-for-react-19'
import AntdAppProvider from '@/components/providers/AntdAppProvider'
import './globals.css'

export const metadata: Metadata = {
  title: '水产品食品安全监测智能问答平台',
  description: 'AI-powered intelligent Q&A platform for aquatic food safety monitoring',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <AntdRegistry>
          <ConfigProvider locale={zhCN} theme={{
            token: {
              colorPrimary: '#667eea',
              borderRadius: 8,
            },
          }}>
            <AntdAppProvider>
              {children}
            </AntdAppProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}

