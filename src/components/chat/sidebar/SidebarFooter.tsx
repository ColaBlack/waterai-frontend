'use client'

import React from 'react'
import { Button } from 'antd'
import { LeftOutlined } from '@ant-design/icons'

/**
 * 侧边栏底部组件
 * 包含收起侧边栏按钮
 */
interface SidebarFooterProps {
  /** 收起侧边栏回调 */
  onCollapse: () => void
}

export default function SidebarFooter({ onCollapse }: SidebarFooterProps) {
  return (
    <div
      style={{
        padding: '8px',
        borderTop: '1px solid #e5e6eb',
        textAlign: 'center',
      }}
    >
      <Button
        type="text"
        icon={<LeftOutlined />}
        onClick={onCollapse}
        block
      >
        收起侧边栏
      </Button>
    </div>
  )
}

