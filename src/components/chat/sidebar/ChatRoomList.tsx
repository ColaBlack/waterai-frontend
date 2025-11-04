'use client'

import React from 'react'
import { List, Spin, Empty, Typography } from 'antd'
import { MessageOutlined } from '@ant-design/icons'
import { formatTimestamp } from '@/lib/utils/messageParser'

const { Text } = Typography

/**
 * 聊天室列表组件
 * 显示用户的所有聊天室历史记录
 */
interface ChatRoomListProps {
  /** 聊天室列表 */
  chatRoomList: API.ChatRoomVO[]
  /** 当前选中的聊天室ID */
  currentChatId: string
  /** 是否正在加载 */
  loading: boolean
  /** 切换聊天室回调 */
  onSwitch: (roomId: string) => void
}

export default function ChatRoomList({
  chatRoomList,
  currentChatId,
  loading,
  onSwitch,
}: ChatRoomListProps) {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <Spin />
      </div>
    )
  }

  if (chatRoomList.length === 0) {
    return (
      <Empty
        description="暂无历史记录"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        style={{ marginTop: '32px' }}
      />
    )
  }

  return (
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
  )
}

