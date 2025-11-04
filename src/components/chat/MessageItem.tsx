'use client'

import React from 'react'
import { message } from 'antd'
import { ChatMessage } from '@/lib/types/chat'
import { parseMessageContent } from '@/lib/utils/messageParser'
import AvatarBadge from './message/AvatarBadge'
import MessageContent from './message/MessageContent'
import MessageActions from './message/MessageActions'

/**
 * 消息项组件
 * 显示单条聊天消息，包括头像、内容和操作
 */
interface MessageItemProps {
  /** 消息对象 */
  message: ChatMessage
  /** 渲染键值，用于强制重新渲染 */
  renderKey?: string
}

function MessageItem({ message: chatMessage, renderKey }: MessageItemProps) {
  const [messageApi, contextHolder] = message.useMessage()
  const isUser = chatMessage.role === 'user'
  
  // 解析消息内容，提取思考过程和正常内容
  const parsedContent = parseMessageContent(chatMessage.content)
  const contentToRender = isUser ? chatMessage.content : (parsedContent.normalContent || '')

  const handleCopySuccess = () => {
    messageApi.success('已复制到剪贴板')
  }

  const handleCopyError = () => {
    messageApi.error('复制失败')
  }

  return (
    <>
      {contextHolder}
      <div
        data-renderkey={renderKey}
        style={{
          display: 'flex',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          marginBottom: '16px',
        }}
      >
        <div style={{ maxWidth: '80%', display: 'flex', gap: '12px', flexDirection: isUser ? 'row-reverse' : 'row' }}>
          <AvatarBadge isUser={isUser} />
          <div style={{ flex: 1 }}>
            <MessageContent
              content={contentToRender}
              isUser={isUser}
              isStreaming={chatMessage.isStreaming || false}
              thinkingProcess={parsedContent.thinkingProcess}
            />
            <MessageActions
              timestamp={chatMessage.timestamp}
              isUser={isUser}
              isStreaming={chatMessage.isStreaming || false}
              content={parsedContent.normalContent || chatMessage.content}
              onCopySuccess={handleCopySuccess}
              onCopyError={handleCopyError}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default MessageItem

