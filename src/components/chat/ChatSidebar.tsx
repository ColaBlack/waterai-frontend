'use client'

import React from 'react'
import { Layout } from 'antd'
import SidebarHeader from './sidebar/SidebarHeader'
import ChatRoomList from './sidebar/ChatRoomList'
import SidebarFooter from './sidebar/SidebarFooter'

const { Sider } = Layout

/**
 * 聊天侧边栏组件
 * 显示聊天室历史记录列表，支持新建、刷新和切换聊天室
 */
interface ChatSidebarProps {
  /** 是否折叠 */
  collapsed: boolean
  /** 折叠状态变化回调 */
  onCollapsedChange: (collapsed: boolean) => void
  /** 聊天室列表 */
  chatRoomList: API.ChatRoomVO[]
  /** 当前选中的聊天室ID */
  currentChatId: string
  /** 是否正在加载 */
  loading: boolean
  /** 刷新列表回调 */
  onRefresh: () => void
  /** 创建新对话回调 */
  onCreate: () => void
  /** 切换聊天室回调 */
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
        {/* 头部：新建和刷新按钮 */}
        <SidebarHeader onCreate={onCreate} onRefresh={onRefresh} loading={loading} />

        {/* 聊天室列表 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          <ChatRoomList
            chatRoomList={chatRoomList}
            currentChatId={currentChatId}
            loading={loading}
            onSwitch={onSwitch}
          />
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

