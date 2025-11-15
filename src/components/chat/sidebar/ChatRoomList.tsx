'use client'

import React from 'react'
import { List, Spin, Empty, Typography, Button, App } from 'antd'
import { MessageOutlined, DeleteOutlined } from '@ant-design/icons'
import { formatTimestamp } from '@/lib/utils/messageParser'
import request from '@/lib/utils/request'

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
  /** 刷新列表回调 */
  onRefresh?: () => void
}

export default function ChatRoomList({
  chatRoomList,
  currentChatId,
  loading,
  onSwitch,
  onRefresh,
}: ChatRoomListProps) {
  const { message, modal } = App.useApp()

  // 删除聊天室
  const handleDelete = async (e: React.MouseEvent, chatroomId: string) => {
    e.stopPropagation() // 阻止事件冒泡
    
    modal.confirm({
      title: '确认删除',
      content: '确定要删除这个聊天室吗？此操作不可恢复。',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await request.delete(`/ai/chat-room/${chatroomId}`)
          if (response.data?.code === 200) {
            message.success('删除成功')
            onRefresh?.()
          } else {
            message.error('删除失败')
          }
        } catch (error) {
          message.error('删除失败')
        }
      }
    })
  }
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
            position: 'relative',
          }}
          className="chat-room-item"
        >
          <List.Item.Meta
            avatar={<MessageOutlined style={{ fontSize: '18px', color: '#667eea' }} />}
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
                  onClick={(e) => item.chatroom && handleDelete(e, item.chatroom)}
                  style={{ marginLeft: '8px' }}
                />
              </div>
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

