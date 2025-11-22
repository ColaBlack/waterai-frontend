'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { Modal, Input, Select, List, Tag, Button, Space, Empty, Spin, App } from 'antd'
import { SearchOutlined, ClockCircleOutlined, MessageOutlined } from '@ant-design/icons'
import { searchChats } from '@/lib/api/chatService/api/chatSearchController'
import { useRouter } from 'next/navigation'

// 不再需要 Search 组件

interface ChatSearchDialogProps {
  open: boolean
  onClose: () => void
}

const PAGE_SIZE = 10

export default function ChatSearchDialog({ open, onClose }: ChatSearchDialogProps) {
  const router = useRouter()
  const { message } = App.useApp()
  const [keyword, setKeyword] = useState('')
  const [chatType, setChatType] = useState<'text' | 'vision' | 'all'>('all')
  const [results, setResults] = useState<API.ChatSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(1)

  // 使用useCallback优化函数，避免不必要的重新渲染
  const handleSearch = useCallback(async (page: number = 1) => {
    const trimmedKeyword = keyword.trim()
    if (!trimmedKeyword) {
      message.warning('请输入搜索关键词')
      return
    }

    setLoading(true)
    setCurrent(page)
    try {
      const response = await searchChats({
        keyword: trimmedKeyword,
        chatType,
        current: page,
        pageSize: PAGE_SIZE,
      })

      const res = response.data
      if (res.code === 200 && res.data) {
        setResults(res.data.records || [])
        setTotal(res.data.total || 0)
      } else {
        message.error(res.message || '搜索失败')
        setResults([])
        setTotal(0)
      }
    } catch (error) {
      console.error('搜索失败', error)
      message.error('搜索失败，请稍后重试')
      setResults([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [keyword, chatType])

  const handleSelectChat = useCallback((chatId: string) => {
    router.push(`/ai/chat/${chatId}`)
    onClose()
  }, [router, onClose])

  const handleReset = useCallback(() => {
    setKeyword('')
    setChatType('all')
    setResults([])
    setTotal(0)
    setCurrent(1)
  }, [])

  return (
    <Modal
      title={
        <Space>
          <SearchOutlined />
          <span>搜索对话</span>
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      {/* 搜索栏 */}
      <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
        <Select
          value={chatType}
          onChange={setChatType}
          style={{ width: 120 }}
        >
          <Select.Option value="all">全部</Select.Option>
          <Select.Option value="text">文本对话</Select.Option>
          <Select.Option value="vision">视觉对话</Select.Option>
        </Select>
        <Input
          placeholder="输入关键词搜索对话内容..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onPressEnter={() => handleSearch(1)}
          allowClear
        />
        <Button 
          type="primary" 
          icon={<SearchOutlined />}
          onClick={() => handleSearch(1)}
          loading={loading}
        >
          搜索
        </Button>
      </Space.Compact>

      {/* 操作按钮 */}
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button size="small" onClick={handleReset}>
            重置
          </Button>
          {total > 0 && (
            <span style={{ color: '#999', fontSize: 12 }}>
              找到 {total} 条结果
            </span>
          )}
        </Space>
      </div>

      {/* 搜索结果列表 */}
      <div style={{ maxHeight: 500, overflowY: 'auto' }}>
        {loading ? (
          <Spin tip="搜索中..." spinning={true}>
            <div style={{ textAlign: 'center', padding: '40px 0', minHeight: '100px' }} />
          </Spin>
        ) : results.length === 0 ? (
          <Empty
            description={keyword ? '未找到相关对话' : '请输入关键词开始搜索'}
            style={{ padding: '40px 0' }}
          />
        ) : (
          <List
            dataSource={results}
            pagination={
              total > PAGE_SIZE
                ? {
                    current,
                    pageSize: PAGE_SIZE,
                    total,
                    onChange: handleSearch,
                    size: 'small',
                    showSizeChanger: false,
                    showTotal: (total) => `共 ${total} 条`,
                  }
                : false
            }
            renderItem={(item) => (
              <List.Item
                key={item.chatId}
                onClick={() => handleSelectChat(item.chatId!)}
                style={{
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  padding: '12px 16px',
                  borderRadius: 8,
                  marginBottom: 8,
                }}
                className="search-result-item"
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <span style={{ fontWeight: 500 }}>{item.title}</span>
                      <Tag color={item.chatType === 'text' ? 'blue' : 'purple'}>
                        {item.chatType === 'text' ? '文本' : '视觉'}
                      </Tag>
                    </Space>
                  }
                  description={
                    <div>
                      {/* 内容片段（包含高亮） */}
                      <div
                        style={{
                          marginBottom: 8,
                          fontSize: 13,
                          color: '#666',
                          lineHeight: 1.6,
                        }}
                        dangerouslySetInnerHTML={{ __html: item.snippet || '' }}
                      />
                      {/* 元信息 */}
                      <Space size="large" style={{ fontSize: 12, color: '#999' }}>
                        <span>
                          <MessageOutlined /> {item.messageCount} 条消息
                        </span>
                        <span>
                          <ClockCircleOutlined />{' '}
                          {item.lastMessageTime
                            ? new Date(item.lastMessageTime).toLocaleString('zh-CN')
                            : ''}
                        </span>
                      </Space>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>

      <style jsx global>{`
        .search-result-item:hover {
          background-color: #f5f5f5 !important;
        }
        .search-result-item mark {
          background-color: #fff566;
          padding: 2px 4px;
          border-radius: 2px;
          font-weight: 500;
        }
      `}</style>
    </Modal>
  )
}
