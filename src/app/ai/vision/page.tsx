'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Layout, Button, Divider, App } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import GlobalLayout from '@/components/GlobalLayout'
import VisionChatSidebar from '@/components/vision-chat/VisionChatSidebar'
import VisionChatHeader from '@/components/vision-chat/VisionChatHeader'
import VisionChatInterface from '@/components/vision-chat/vision-chat-interface'
import { useUserStore } from '@/lib/store/userStore'
import { getChatRecords } from '@/lib/api/chatService/api/visionChatController'

// 视觉聊天记录类型定义
interface VisionChatRecord {
  id?: number
  chatId?: string
  userId?: number
  userPrompt?: string
  aiResponse?: string
  content?: string
  imageUrls?: string[]
  visionModelType?: string
  modelName?: string
  messageType?: 'user' | 'ai' | 'assistant'
  createTime?: string
  updateTime?: string
  [key: string]: any
}
import { useVisionChatRoom } from '@/lib/hooks/useVisionChatRoom'

const { Content } = Layout

export default function VisionChatPage() {
  const { message } = App.useApp()
  const router = useRouter()
  const { loginUser, fetchLoginUser } = useUserStore()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // 从URL参数获取chatId
  const getChatIdFromUrl = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      return params.get('chatId') || undefined
    }
    return undefined
  }

  // 聊天室管理
  const {
    chatId,
    chatRoomList,
    loadingHistory,
    initChatRoom,
    createNewChat,
    switchChatRoom,
    loadChatRoomList,
  } = useVisionChatRoom(message)

  useEffect(() => {
    fetchLoginUser()
  }, [fetchLoginUser])

  useEffect(() => {
    // 初始化聊天室
    const urlChatId = getChatIdFromUrl()
    initChatRoom(urlChatId)
    loadChatRoomList()
  }, [initChatRoom, loadChatRoomList])

  // 转换聊天室列表格式供侧边栏使用
  const chatHistory = chatRoomList.map((room) => ({
    chatId: room.chatroom,
    title: room.title || '视觉对话',
    lastMessageTime: room.updateTime || room.createTime,
  }))

  const handleCreateNewChat = () => {
    createNewChat()
  }

  const handleSwitchChat = async (selectedChatId: string) => {
    await switchChatRoom(selectedChatId)
  }

  const handleNewMessage = useCallback((message: VisionChatRecord) => {
    // 新消息时刷新聊天室列表（标题可能已更新）
    setTimeout(() => {
      loadChatRoomList()
    }, 1000) // 延迟1秒，等待后端标题生成完成
  }, [loadChatRoomList])

  return (
    <GlobalLayout showFooter={false}>
      <div style={{ 
        display: 'flex', 
        width: '100vw',
        height: 'calc(100vh - 64px)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* 浮动展开按钮 */}
        {sidebarCollapsed && (
          <Button
            type="primary"
            icon={<RightOutlined />}
            onClick={() => setSidebarCollapsed(false)}
            style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 9999,
              borderRadius: '0 8px 8px 0',
              height: '120px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px 8px',
              boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)',
            }}
          >
            <span style={{ writingMode: 'vertical-rl', fontSize: '12px', marginTop: '8px' }}>
              历史记录
            </span>
          </Button>
        )}

        {/* 侧边栏 */}
        <VisionChatSidebar
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
          chatHistory={chatHistory}
          currentChatId={chatId}
          loading={loadingHistory}
          onRefresh={loadChatRoomList}
          onCreate={handleCreateNewChat}
          onSwitch={handleSwitchChat}
        />

        {/* 主内容区 */}
        <Layout style={{ background: '#ffffff', flex: 1, height: '100%', overflow: 'hidden' }}>
          <Content
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            {/* 头部 */}
            <div style={{ padding: '16px 24px' }}>
              <VisionChatHeader chatId={chatId} />
            </div>

            <Divider style={{ margin: 0 }} />

            {/* 视觉聊天界面 */}
            {chatId && (
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <VisionChatInterface
                  chatId={chatId}
                  onNewMessage={handleNewMessage}
                  className="h-full"
                />
              </div>
            )}
          </Content>
        </Layout>
      </div>
    </GlobalLayout>
  )
}

