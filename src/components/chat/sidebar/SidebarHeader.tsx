'use client'

import React, { useState } from 'react'
import { Button, Space } from 'antd'
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import ChatSearchDialog from '../ChatSearchDialog'

/**
 * 侧边栏头部组件
 * 包含新建对话、搜索和刷新按钮
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
  const [searchDialogOpen, setSearchDialogOpen] = useState(false)

  return (
    <>
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid #e5e6eb',
        }}
      >
        {/* 新建对话按钮 */}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onCreate}
          block
          style={{ marginBottom: '8px' }}
        >
          新建对话
        </Button>

        {/* 搜索和刷新按钮 */}
        <Space style={{ width: '100%' }}>
          <Button
            icon={<SearchOutlined />}
            onClick={() => setSearchDialogOpen(true)}
            block
            style={{ flex: 1 }}
          >
            搜索对话
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={onRefresh}
            loading={loading}
          />
        </Space>
      </div>

      {/* 搜索对话框 */}
      <ChatSearchDialog
        open={searchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
      />
    </>
  )
}

