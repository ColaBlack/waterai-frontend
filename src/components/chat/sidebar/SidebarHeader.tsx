'use client'

import React from 'react'
import { Button } from 'antd'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'

/**
 * 侧边栏头部组件
 * 包含新建对话和刷新按钮
 */
interface SidebarHeaderProps {
  /** 创建新对话回调 */
  onCreate: () => void
  /** 刷新列表回调 */
  onRefresh: () => void
  /** 是否正在加载 */
  loading: boolean
}

export default function SidebarHeader({ onCreate, onRefresh, loading }: SidebarHeaderProps) {
  return (
    <div
      style={{
        padding: '16px',
        borderBottom: '1px solid #e5e6eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onCreate}
        block
        style={{ marginRight: '8px' }}
      >
        新建对话
      </Button>
      <Button
        icon={<ReloadOutlined />}
        onClick={onRefresh}
        loading={loading}
      />
    </div>
  )
}

