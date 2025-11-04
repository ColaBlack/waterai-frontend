'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Layout, Button, Divider, App } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import { useParams } from 'next/navigation'
import GlobalLayout from '@/components/GlobalLayout'
import ChatSidebar from '@/components/chat/ChatSidebar'
import ChatHeader from '@/components/chat/ChatHeader'
import MessageList from '@/components/chat/MessageList'
import ChatInput from '@/components/chat/ChatInput'
import { useChatRoom } from '@/lib/hooks/useChatRoom'
import { useChatMessages } from '@/lib/hooks/useChatMessages'

const { Content } = Layout

export default function ChatPage() {
  const params = useParams()
  const { message } = App.useApp()
  const chatIdFromParams = params.chatId ? (Array.isArray(params.chatId) ? params.chatId[0] : params.chatId) : undefined
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // 聊天室管理
  const {
    chatId,
    chatRoomList,
    loadingHistory,
    initChatRoom,
    createNewChat,
    switchChatRoom,
    loadChatRoomList,
    createChatRoom,
    updateChatId
  } = useChatRoom()

  // 消息管理
  const handleFirstMessage = useCallback(async (prompt: string): Promise<string | null> => {
    const newChatId = await createChatRoom(prompt)
    
    if (newChatId && newChatId !== chatId) {
      updateChatId(newChatId)
    }
    
    return newChatId
  }, [createChatRoom, chatId, updateChatId])

  const {
    messages,
    renderCounter,
    userInput,
    isConnecting,
    isLoading,
    setUserInput,
    sendMessage,
    loadHistoryMessages,
    closeConnection,
    clearMessages
  } = useChatMessages(chatId, message, handleFirstMessage)

  // 初始化
  useEffect(() => {
    initChatRoom(chatIdFromParams)
    loadChatRoomList()
  }, [chatIdFromParams, initChatRoom, loadChatRoomList])

  // 加载历史消息
  useEffect(() => {
    if (chatId && chatIdFromParams && chatId === chatIdFromParams) {
      loadHistoryMessages()
    } else if (!chatIdFromParams) {
      clearMessages()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatIdFromParams, chatId]) // 只依赖 chatId 和 chatIdFromParams，函数使用 useCallback 已稳定

  // 清理
  useEffect(() => {
    return () => {
      closeConnection()
    }
  }, [closeConnection])

  // 创建新聊天
  const handleCreateNewChat = () => {
    closeConnection()
    clearMessages()
    createNewChat()
  }

  // 切换聊天室
  const handleSwitchChatRoom = async (roomId: string) => {
    if (!roomId || roomId === chatId) {
      return
    }
    
    closeConnection()
    clearMessages()
    await switchChatRoom(roomId)
  }

  // 使用示例问题
  const handleUseSample = (question: string) => {
    setUserInput(question)
  }

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
        <ChatSidebar
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
          chatRoomList={chatRoomList}
          currentChatId={chatId}
          loading={loadingHistory}
          onRefresh={loadChatRoomList}
          onCreate={handleCreateNewChat}
          onSwitch={handleSwitchChatRoom}
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
              <ChatHeader chatId={chatId} />
            </div>

            <Divider style={{ margin: 0 }} />

            {/* 消息列表 */}
            <MessageList
              messages={messages}
              renderCounter={renderCounter}
              isLoading={isLoading}
              onUseSample={handleUseSample}
            />

            {/* 输入框 */}
            <ChatInput
              value={userInput}
              onChange={setUserInput}
              onSend={sendMessage}
              isConnecting={isConnecting}
              chatId={chatId}
            />
          </Content>
        </Layout>
      </div>
    </GlobalLayout>
  )
}

