'use client'

import React from 'react'
import { Avatar, Button, Card, Collapse, message } from 'antd'
import { UserOutlined, RobotOutlined, CopyOutlined, LoadingOutlined } from '@ant-design/icons'
import { ChatMessage } from '@/lib/types/chat'
import { parseMessageContent, formatTimestamp, copyToClipboard } from '@/lib/utils/messageParser'
import StreamingText from './StreamingText'

interface MessageItemProps {
  message: ChatMessage
  renderKey?: string
}

function MessageItem({ message: chatMessage, renderKey }: MessageItemProps) {
  const [messageApi, contextHolder] = message.useMessage()
  const isUser = chatMessage.role === 'user'
  
  const parsedContent = parseMessageContent(chatMessage.content)
  const contentToRender = isUser ? chatMessage.content : (parsedContent.normalContent || '')

  const handleCopy = async () => {
    const success = await copyToClipboard(parsedContent.normalContent || chatMessage.content)
    if (success) {
      messageApi.success('已复制到剪贴板')
    } else {
      messageApi.error('复制失败')
    }
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
        <Avatar
          icon={isUser ? <UserOutlined /> : <RobotOutlined />}
          style={{
            backgroundColor: isUser ? '#667eea' : '#52c41a',
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1 }}>
          <Card
            size="small"
            style={{
              backgroundColor: isUser ? '#f0f2f5' : '#ffffff',
              border: isUser ? 'none' : '1px solid #e5e6eb',
            }}
          >
            {/* 思考过程（如果存在） */}
            {parsedContent.thinkingProcess && (
              <Collapse
                size="small"
                style={{ marginBottom: '12px' }}
                items={[
                  {
                    key: 'thinking',
                    label: (
                      <span style={{ fontWeight: 500 }}>
                        💭 深度思考
                      </span>
                    ),
                    children: (
                      <div style={{ backgroundColor: '#f5f7fa', padding: '12px', borderRadius: '6px' }}>
                        <StreamingText
                          content={parsedContent.thinkingProcess}
                          isStreaming={false}
                        />
                      </div>
                    ),
                  },
                ]}
              />
            )}
            
            {/* 消息内容 - 使用StreamingText组件 */}
            <StreamingText
              content={contentToRender}
              isStreaming={chatMessage.isStreaming}
            />
            
            {/* 加载指示器 - 仅在还没有内容时显示 */}
            {chatMessage.isStreaming && !chatMessage.content && (
              <div style={{ marginTop: '8px', color: '#999' }}>
                <LoadingOutlined style={{ marginRight: '6px' }} />
                AI 正在思考...
              </div>
            )}
          </Card>
          
          {/* 消息操作栏 */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginTop: '4px',
              fontSize: '12px',
              color: '#999',
              paddingLeft: isUser ? '0' : '8px',
              paddingRight: isUser ? '8px' : '0',
              justifyContent: isUser ? 'flex-end' : 'flex-start',
              alignItems: 'center',
            }}
          >
            <span>{formatTimestamp(chatMessage.timestamp)}</span>
            {!isUser && !chatMessage.isStreaming && (
              <Button
                type="text"
                size="small"
                icon={<CopyOutlined />}
                onClick={handleCopy}
              >
                复制
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default MessageItem

