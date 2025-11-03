'use client'

import React from 'react'
import { Layout, Button, List, Spin, Empty, Typography } from 'antd'
import { PlusOutlined, MessageOutlined, LeftOutlined, RightOutlined, ReloadOutlined } from '@ant-design/icons'
import { formatTimestamp } from '@/lib/utils/messageParser'

const { Sider } = Layout
const { Text } = Typography

interface ChatSidebarProps {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
  chatRoomList: API.ChatRoomVO[]
  currentChatId: string
  loading: boolean
  onRefresh: () => void
  onCreate: () => void
  onSwitch: (roomId: string) => void
}

export default function ChatSidebar({
  collapsed,
  onCollapsedChange,
  chatRoomList,
  currentChatId,
  loading,
  onRefresh,
  onCreate,
  onSwitch
}: ChatSidebarProps) {
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
        {/* 头部 */}
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

        {/* 聊天室列表 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <Spin />
            </div>
          ) : chatRoomList.length === 0 ? (
            <Empty
              description="暂无历史记录"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ marginTop: '32px' }}
            />
          ) : (
            <List
              dataSource={chatRoomList}
              renderItem={(item) => (
                <List.Item
                  onClick={() => item.chatroom && onSwitch(item.chatroom)}
                  style={{
                    padding: '12px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    marginBottom: '4px',
                    backgroundColor: item.chatroom === currentChatId ? '#e6f7ff' : 'transparent',
                    border: item.chatroom === currentChatId ? '1px solid #91d5ff' : '1px solid transparent',
                    transition: 'all 0.3s',
                  }}
                  className="chat-room-item"
                >
                  <List.Item.Meta
                    avatar={<MessageOutlined style={{ fontSize: '18px', color: '#667eea' }} />}
                    title={
                      <Text ellipsis style={{ fontSize: '14px', fontWeight: 500 }}>
                        {item.title || '未命名对话'}
                      </Text>
                    }
                    description={
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {item.createTime ? formatTimestamp(new Date(item.createTime).getTime()) : ''}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </div>

        {/* 折叠按钮 */}
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
            onClick={() => onCollapsedChange(true)}
            block
          >
            收起侧边栏
          </Button>
        </div>
      </div>

      <style jsx global>{`
        .chat-room-item:hover {
          background-color: #f5f6f7 !important;
        }
      `}</style>
    </Sider>
  )
}

