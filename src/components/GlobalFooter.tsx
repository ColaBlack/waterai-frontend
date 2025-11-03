'use client'

import React from 'react'
import { Layout } from 'antd'

const { Footer } = Layout

export default function GlobalFooter() {
  return (
    <Footer style={{ 
      textAlign: 'center', 
      background: '#fafafa',
      padding: '24px 50px',
    }}>
      <div style={{ marginBottom: '8px' }}>
        水产品食品安全监测智能问答平台
      </div>
      <div style={{ color: '#666', fontSize: '14px' }}>
        © 2024 WaterAI. All rights reserved.
      </div>
    </Footer>
  )
}

