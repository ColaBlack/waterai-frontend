'use client'

import React from 'react'
import { Layout } from 'antd'
import GlobalHeader from './GlobalHeader'
import GlobalFooter from './GlobalFooter'

const { Content } = Layout

interface GlobalLayoutProps {
  children: React.ReactNode
  showFooter?: boolean
}

export default function GlobalLayout({ children, showFooter = true }: GlobalLayoutProps) {
  return (
    <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <GlobalHeader />
      <Content style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </Content>
      {showFooter && <GlobalFooter />}
    </Layout>
  )
}

