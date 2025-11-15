'use client'

import React from 'react'
import { Layout, List, Spin, Empty, Typography, Button, App } from 'antd'
import { CameraOutlined, ReloadOutlined, LeftOutlined, DeleteOutlined } from '@ant-design/icons'
import { formatTimestamp } from '@/lib/utils/messageParser'
import SidebarHeader from '@/components/chat/sidebar/SidebarHeader'
import SidebarFooter from '@/components/chat/sidebar/SidebarFooter'

const { Sider } = Layout
const { Text } = Typography

interface VisionChatSidebarProps {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
  chatHistory: Array<{ chatId: string; title: string; lastMessageTime: string }>
  currentChatId: string
  loading: boolean
  onRefresh: () => void
  onCreate: () => void
  onSwitch: (chatId: string) => void
}

export default function VisionChatSidebar({
  collapsed,
  onCollapsedChange,
  chatHistory,
  currentChatId,
  loading,
  onRefresh,
  onCreate,
  onSwitch,
}: VisionChatSidebarProps) {
  const { message, modal } = App.useApp()
  const request = require('@/lib/utils/request').default

  // 删除聊天室
  const handleDelete = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation()
    
    modal.confirm({
      title: '确认删除',
      content: '确定要删除这个聊天室吗？此操作不可恢复。',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await request.delete(`/ai/vision-chat-room/${chatId}`)
          if (response.data?.code === 200) {
            message.success('删除成功')
            onRefresh()
          } else {
            message.error('删除失败')
          }
        } catch (error) {
          message.error('删除失败')
        }
      }
    })
  }
  return (
    <Sider
      width={280}
      collapsed={collapsed}
      collapsedWidth={0}
      style={{
        background: '#fafbfc',
        borderRight: '1px solid #e5e6eb',
        overflow: 'hidden',
      }}
    >
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* 头部：新建和刷新按钮 */}
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
            icon={<CameraOutlined />}
            onClick={onCreate}
            block
            style={{ marginRight: '8px' }}
          >
            新建视觉对话
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={onRefresh}
            loading={loading}
          />
        </div>

        {/* 聊天历史列表 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <Spin />
            </div>
          ) : chatHistory.length === 0 ? (
            <Empty
              description="暂无历史记录"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ marginTop: '32px' }}
            />
          ) : (
            <List
              dataSource={chatHistory}
              renderItem={(item) => (
                <List.Item
                  onClick={() => onSwitch(item.chatId)}
                  style={{
                    padding: '12px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    marginBottom: '4px',
                    backgroundColor: item.chatId === currentChatId ? '#e6f7ff' : 'transparent',
                    border: item.chatId === currentChatId ? '1px solid #91d5ff' : '1px solid transparent',
                    transition: 'all 0.3s',
                  }}
                  className="chat-room-item"
                >
                  <List.Item.Meta
                    avatar={<CameraOutlined style={{ fontSize: '18px', color: '#667eea' }} />}
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text ellipsis style={{ fontSize: '14px', fontWeight: 500, flex: 1 }}>
                          {item.title || '未命名对话'}
                        </Text>
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={(e) => handleDelete(e, item.chatId)}
                          style={{ marginLeft: '8px' }}
                        />
                      </div>
                    }
                    description={
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {item.lastMessageTime ? formatTimestamp(new Date(item.lastMessageTime).getTime()) : ''}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </div>

        {/* 底部：收起按钮 */}
        <SidebarFooter onCollapse={() => onCollapsedChange(true)} />
      </div>

      <style jsx global>{`
        .chat-room-item:hover {
          background-color: #f5f6f7 !important;
        }
      `}</style>
    </Sider>
  )
}

