'use client'

import React, { useCallback, useMemo } from 'react'
import { Space, Typography, Button, Dropdown } from 'antd'
import { CommentOutlined, DownloadOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { exportChat, type ExportFormat } from '@/lib/utils/exportHelper'

const { Title } = Typography

interface ChatHeaderProps {
  chatId: string
  title?: string
}

export default function ChatHeader({ chatId, title = 'chat' }: ChatHeaderProps) {
  // 使用useCallback优化导出函数
  const handleExport = useCallback((format: ExportFormat) => {
    exportChat(chatId, format, title)
  }, [chatId, title])

  // 使用useMemo缓存菜单项，避免不必要的重新渲染
  const exportMenuItems: MenuProps['items'] = useMemo(() => [
    {
      key: 'markdown',
      label: 'Markdown',
      onClick: () => handleExport('markdown'),
    },
    {
      key: 'html',
      label: 'HTML',
      onClick: () => handleExport('html'),
    },
    {
      key: 'txt',
      label: '纯文本',
      onClick: () => handleExport('txt'),
    },
    {
      key: 'json',
      label: 'JSON',
      onClick: () => handleExport('json'),
    },
  ], [handleExport])

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Space>
        <CommentOutlined style={{ fontSize: '24px', color: '#667eea' }} />
        <Title level={4} style={{ margin: 0 }}>
          AI 智能问答
        </Title>
      </Space>
      
      <Space>
        {chatId && (
          <>
            <Dropdown menu={{ items: exportMenuItems }} placement="bottomRight">
              <Button icon={<DownloadOutlined />} size="small">
                导出对话
              </Button>
            </Dropdown>
            <span style={{ fontSize: '12px', color: '#999' }}>
              会话ID: {chatId.substring(0, 20)}...
            </span>
          </>
        )}
      </Space>
    </div>
  )
}

