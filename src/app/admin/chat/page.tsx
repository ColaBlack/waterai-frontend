'use client'

import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, Card, App, Tabs, Avatar, Image, Collapse } from 'antd'
import { DeleteOutlined, EyeOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import GlobalLayout from '@/components/GlobalLayout'
import request from '@/lib/utils/request'
import { CopyButton } from '@/components/chat/CopyButton'

interface ChatRoom {
  chatroom: string
  title: string
  userId: number
  createTime: string
  updateTime: string
}

interface VisionChatRoom {
  chatroom: string
  title: string
  userId: number
  createTime: string
  updateTime: string
}

export default function AdminChatManagePage() {
  const { message, modal } = App.useApp()
  const [activeTab, setActiveTab] = useState('text')
  const [textChatRooms, setTextChatRooms] = useState<ChatRoom[]>([])
  const [visionChatRooms, setVisionChatRooms] = useState<VisionChatRoom[]>([])
  const [loading, setLoading] = useState(false)
  const [messagesModalVisible, setMessagesModalVisible] = useState(false)
  const [currentMessages, setCurrentMessages] = useState<any[]>([])
  const [currentChatroom, setCurrentChatroom] = useState<string>('')
  const [isCurrentVision, setIsCurrentVision] = useState(false)

  // 加载文字聊天室列表
  const loadTextChatRooms = async () => {
    setLoading(true)
    try {
      const response = await request.get('/ai/chat-room/admin/list')
      if (response.data?.code === 200) {
        setTextChatRooms(response.data.data || [])
      }
    } catch (error) {
      message.error('加载文字聊天室失败')
    } finally {
      setLoading(false)
    }
  }

  // 加载视觉聊天室列表
  const loadVisionChatRooms = async () => {
    setLoading(true)
    try {
      const response = await request.get('/ai/vision-chat-room/admin/list')
      if (response.data?.code === 200) {
        setVisionChatRooms(response.data.data || [])
      }
    } catch (error) {
      message.error('加载视觉聊天室失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'text') {
      loadTextChatRooms()
    } else {
      loadVisionChatRooms()
    }
  }, [activeTab])

  // 查看聊天记录
  const handleViewMessages = async (chatroomId: string, isVision: boolean) => {
    try {
      const url = isVision 
        ? `/vision-chat/records/${chatroomId}`
        : `/ai/chat-room/${chatroomId}/messages`
      
      const response = await request.get(url)
      if (response.data?.code === 200) {
        setCurrentMessages(response.data.data || [])
        setCurrentChatroom(chatroomId)
        setIsCurrentVision(isVision)
        setMessagesModalVisible(true)
      }
    } catch (error) {
      message.error('加载聊天记录失败')
    }
  }

  // 删除聊天室
  const handleDeleteChatRoom = (chatroomId: string, isVision: boolean) => {
    modal.confirm({
      title: '确认删除',
      content: '确定要删除这个聊天室吗？此操作不可恢复。',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const url = isVision
            ? `/ai/vision-chat-room/${chatroomId}`
            : `/ai/chat-room/${chatroomId}`
          
          const response = await request.delete(url)
          if (response.data?.code === 200) {
            message.success('删除成功')
            if (isVision) {
              loadVisionChatRooms()
            } else {
              loadTextChatRooms()
            }
          }
        } catch (error) {
          message.error('删除失败')
        }
      }
    })
  }

  const textColumns: ColumnsType<ChatRoom> = [
    {
      title: '聊天室ID',
      dataIndex: 'chatroom',
      key: 'chatroom',
      width: 200,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewMessages(record.chatroom, false)}
          >
            查看
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteChatRoom(record.chatroom, false)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  const visionColumns: ColumnsType<VisionChatRoom> = [
    {
      title: '聊天室ID',
      dataIndex: 'chatroom',
      key: 'chatroom',
      width: 200,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewMessages(record.chatroom, true)}
          >
            查看
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteChatRoom(record.chatroom, true)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <GlobalLayout>
      <div style={{ padding: '24px' }}>
        <Card title="聊天记录管理">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: 'text',
                label: '文字对话',
                children: (
                  <Table
                    columns={textColumns}
                    dataSource={textChatRooms}
                    loading={loading}
                    rowKey="chatroom"
                    pagination={{
                      showTotal: (total) => `共 ${total} 条记录`,
                      showSizeChanger: true,
                    }}
                  />
                ),
              },
              {
                key: 'vision',
                label: '视觉对话',
                children: (
                  <Table
                    columns={visionColumns}
                    dataSource={visionChatRooms}
                    loading={loading}
                    rowKey="chatroom"
                    pagination={{
                      showTotal: (total) => `共 ${total} 条记录`,
                      showSizeChanger: true,
                    }}
                  />
                ),
              },
            ]}
          />
        </Card>

        {/* 聊天记录详情模态框 */}
        <Modal
          title={`聊天记录 - ${currentChatroom}`}
          open={messagesModalVisible}
          onCancel={() => setMessagesModalVisible(false)}
          footer={null}
          width={800}
        >
          <div style={{ maxHeight: '500px', overflowY: 'auto', padding: '16px' }}>
            {currentMessages.map((msg, index) => {
              // 根据聊天室类型判断消息类型：文字模型用大写，视觉模型用小写
              const isUserMessage = isCurrentVision 
                ? msg.messageType === 'user' 
                : msg.messageType === 'USER'
              const isAssistantMessage = isCurrentVision 
                ? msg.messageType === 'assistant' 
                : msg.messageType === 'ASSISTANT'
              
              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: isUserMessage ? 'flex-end' : 'flex-start',
                    marginBottom: '16px',
                  }}
                >
                  {/* AI头像在左侧 */}
                  {isAssistantMessage && (
                    <Avatar
                      icon={<RobotOutlined />}
                      style={{ backgroundColor: '#1890ff', marginRight: '12px', flexShrink: 0 }}
                    />
                  )}
                  
                  {/* 消息内容 */}
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: '12px 16px',
                      backgroundColor: '#f0f0f0',
                      color: '#000',
                      borderRadius: '12px',
                      wordBreak: 'break-word',
                    }}
                  >
                  {/* 处理 AI 消息中的 <think> 标签 */}
                  {isAssistantMessage && msg.content.includes('<think>') ? (
                    <div>
                      {(() => {
                        const thinkRegex = /<think>([\s\S]*?)<\/think>/g;
                        const parts: React.ReactNode[] = [];
                        let lastIndex = 0;
                        let match;
                        let thinkIndex = 0;

                        while ((match = thinkRegex.exec(msg.content)) !== null) {
                          // 添加 <think> 之前的文本
                          if (match.index > lastIndex) {
                            parts.push(
                              <span key={`text-${lastIndex}`}>
                                {msg.content.substring(lastIndex, match.index)}
                              </span>
                            );
                          }

                          // 添加折叠的思考内容
                          const thinkContent = match[1];
                          parts.push(
                            <Collapse
                              key={`think-${thinkIndex}`}
                              ghost
                              style={{ 
                                marginTop: '8px', 
                                marginBottom: '8px',
                                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                borderRadius: '6px'
                              }}
                              items={[
                                {
                                  key: '1',
                                  label: (
                                    <span style={{ 
                                      fontWeight: 500,
                                      color: '#1890ff'
                                    }}>
                                      💭 深度思考过程
                                    </span>
                                  ),
                                  children: (
                                    <div style={{ 
                                      whiteSpace: 'pre-wrap',
                                      fontStyle: 'italic',
                                      color: '#666',
                                      padding: '8px'
                                    }}>
                                      {thinkContent}
                                    </div>
                                  )
                                }
                              ]}
                            />
                          );

                          lastIndex = match.index + match[0].length;
                          thinkIndex++;
                        }

                        // 添加最后的文本
                        if (lastIndex < msg.content.length) {
                          parts.push(
                            <span key={`text-${lastIndex}`}>
                              {msg.content.substring(lastIndex)}
                            </span>
                          );
                        }

                        return parts;
                      })()}
                    </div>
                  ) : (
                    <div>{msg.content}</div>
                  )}
                  {msg.imageUrls && msg.imageUrls.length > 0 && (
                    <div style={{ marginTop: '8px' }}>
                      <Image.PreviewGroup>
                        {msg.imageUrls.map((url: string, i: number) => (
                          <Image
                            key={i}
                            src={url}
                            alt="图片"
                            style={{ maxWidth: '200px', marginRight: '8px', borderRadius: '8px', cursor: 'pointer' }}
                          />
                        ))}
                      </Image.PreviewGroup>
                    </div>
                  )}
                  {msg.createTime && (
                    <div style={{ 
                      fontSize: '12px', 
                      marginTop: '4px',
                      opacity: 0.7,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span>{msg.createTime}</span>
                      <CopyButton text={msg.content} />
                    </div>
                  )}
                  </div>
                  
                  {/* 用户头像在右侧 */}
                  {isUserMessage && (
                    <Avatar
                      icon={<UserOutlined />}
                      style={{ backgroundColor: '#87d068', marginLeft: '12px', flexShrink: 0 }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </Modal>
      </div>
    </GlobalLayout>
  )
}
