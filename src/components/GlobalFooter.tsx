'use client'

import React from 'react'
import { Layout } from 'antd'

const { Footer } = Layout

export default function GlobalFooter() {
  return (
    <Footer style={{ 
      textAlign: 'center', 
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F0F9FF 100%)',
      padding: '32px 50px',
      borderTop: '1px solid rgba(14, 165, 233, 0.1)',
    }}>
      <div style={{ 
        marginBottom: '12px',
        fontSize: '16px',
        fontWeight: 600,
        background: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        水产品食品安全监测智能问答平台
      </div>
      <div style={{ color: '#666', fontSize: '14px' }}>
        © 2026 WaterAI. All rights reserved.
      </div>
    </Footer>
  )
}

