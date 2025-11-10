'use client'

import React from 'react'
import { Card, Collapse, Tag, Space, Alert } from 'antd'
import { LoadingOutlined, FileTextOutlined, ToolOutlined, DatabaseOutlined, CheckCircleOutlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons'
import StreamingText from '../StreamingText'
import type { AIMessageMetadata, ToolCallStatus } from '@/lib/types/chat'

/**
 * 消息内容组件
 * 显示消息的主体内容
 */
interface MessageContentProps {
  /** 消息内容 */
  content: string
  /** 是否为用户消息 */
  isUser: boolean
  /** 是否正在流式输出 */
  isStreaming: boolean
  /** 思考过程内容（可选） */
  thinkingProcess?: string
  /** AI消息的元数据（可选） */
  metadata?: AIMessageMetadata
}

export default function MessageContent({
  content,
  isUser,
  isStreaming,
  thinkingProcess,
  metadata,
}: MessageContentProps) {
  const hasRAGDocs = metadata?.retrievedDocuments && metadata.retrievedDocuments.length > 0
  const hasToolCalls = metadata?.toolCalls && metadata.toolCalls.length > 0
  const hasMetadata = hasRAGDocs || hasToolCalls

  return (
    <Card
      size="small"
      style={{
        backgroundColor: isUser ? '#f0f2f5' : '#ffffff',
        border: isUser ? 'none' : '1px solid #e5e6eb',
      }}
    >
      {/* RAG检索文档 */}
      {hasRAGDocs && (
        <div style={{ marginBottom: '12px' }}>
          <Collapse
            ghost
            defaultActiveKey={[]}
            expandIconPosition="end"
            style={{ backgroundColor: '#f0f9ff', borderRadius: '6px', padding: '4px' }}
            items={[
              {
                key: 'rag',
                label: (
                  <Space>
                    <DatabaseOutlined style={{ color: '#1890ff' }} />
                    <span style={{ fontWeight: 500 }}>
                      已检索到 {metadata!.retrievedDocuments!.length} 个相关文档
                    </span>
                  </Space>
                ),
                children: (
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {metadata!.retrievedDocuments!.map((doc, index) => (
                      <Card
                        key={doc.id || index}
                        size="small"
                        style={{ marginBottom: '8px' }}
                        title={
                          <Space>
                            <FileTextOutlined />
                            <span>{doc.source || `文档 ${index + 1}`}</span>
                            {doc.score !== undefined && (
                              <Tag color="blue">相似度: {(doc.score * 100).toFixed(1)}%</Tag>
                            )}
                          </Space>
                        }
                      >
                        <div style={{ fontSize: '13px', color: '#666', whiteSpace: 'pre-wrap' }}>
                          {doc.content}
                        </div>
                      </Card>
                    ))}
                  </div>
                ),
              },
            ]}
          />
        </div>
      )}

      {/* 工具调用信息 */}
      {hasToolCalls && (
        <div style={{ marginBottom: '12px' }}>
          <Collapse
            ghost
            defaultActiveKey={isStreaming ? ['tools'] : []}
            expandIconPosition="end"
            style={{ backgroundColor: '#fff7e6', borderRadius: '6px', padding: '4px' }}
            items={[
              {
                key: 'tools',
                label: (
                  <Space>
                    <ToolOutlined style={{ color: '#fa8c16' }} />
                    <span style={{ fontWeight: 500 }}>
                      工具调用 ({metadata!.toolCalls!.length})
                    </span>
                    {isStreaming && metadata!.toolCalls!.some(t => t.status === 'calling' || t.status === 'pending') && (
                      <Tag color="processing" icon={<SyncOutlined spin />}>
                        执行中...
                      </Tag>
                    )}
                  </Space>
                ),
                children: (
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {metadata!.toolCalls!.map((tool, index) => {
                      const getStatusTag = (status?: ToolCallStatus) => {
                        switch (status) {
                          case 'calling':
                            return <Tag color="processing" icon={<SyncOutlined spin />}>执行中</Tag>
                          case 'completed':
                            return <Tag color="success" icon={<CheckCircleOutlined />}>已完成</Tag>
                          case 'failed':
                            return <Tag color="error" icon={<CloseCircleOutlined />}>失败</Tag>
                          case 'pending':
                          default:
                            return <Tag color="default">等待中</Tag>
                        }
                      }

                      return (
                        <Card
                          key={tool.id || index}
                          size="small"
                          style={{ 
                            marginBottom: '8px',
                            borderLeft: `3px solid ${
                              tool.status === 'completed' ? '#52c41a' :
                              tool.status === 'failed' ? '#ff4d4f' :
                              tool.status === 'calling' ? '#1890ff' : '#d9d9d9'
                            }`
                          }}
                          title={
                            <Space>
                              <ToolOutlined />
                              <span style={{ fontWeight: 500 }}>{tool.name}</span>
                              {getStatusTag(tool.status)}
                            </Space>
                          }
                        >
                          {tool.arguments && (
                            <div style={{ marginBottom: '12px' }}>
                              <div style={{ fontWeight: 500, marginBottom: '6px', fontSize: '13px', color: '#595959' }}>
                                📥 调用参数:
                              </div>
                              <div style={{ 
                                fontSize: '12px', 
                                color: '#262626', 
                                backgroundColor: '#fafafa', 
                                padding: '10px', 
                                borderRadius: '4px', 
                                whiteSpace: 'pre-wrap', 
                                wordBreak: 'break-all',
                                border: '1px solid #f0f0f0',
                                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, "source-code-pro", monospace'
                              }}>
                                {tool.arguments}
                              </div>
                            </div>
                          )}
                          
                          {tool.status === 'calling' && (
                            <div style={{ marginBottom: '12px' }}>
                              <Alert
                                message="工具正在执行中..."
                                type="info"
                                icon={<LoadingOutlined />}
                                showIcon
                                style={{ fontSize: '12px' }}
                              />
                            </div>
                          )}
                          
                          {tool.status === 'failed' && tool.error && (
                            <div style={{ marginBottom: '12px' }}>
                              <Alert
                                message="工具调用失败"
                                description={tool.error}
                                type="error"
                                showIcon
                                style={{ fontSize: '12px' }}
                              />
                            </div>
                          )}
                          
                          {tool.status === 'completed' && tool.result && (
                            <div>
                              <div style={{ fontWeight: 500, marginBottom: '6px', fontSize: '13px', color: '#595959' }}>
                                ✅ 执行结果:
                              </div>
                              <div style={{ 
                                fontSize: '12px', 
                                color: '#262626', 
                                backgroundColor: '#f6ffed', 
                                padding: '10px', 
                                borderRadius: '4px', 
                                whiteSpace: 'pre-wrap',
                                border: '1px solid #b7eb8f',
                                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, "source-code-pro", monospace',
                                maxHeight: '200px',
                                overflowY: 'auto'
                              }}>
                                {tool.result}
                              </div>
                            </div>
                          )}
                          
                          {tool.status === 'completed' && !tool.result && (
                            <div style={{ color: '#8c8c8c', fontSize: '12px', fontStyle: 'italic' }}>
                              工具执行完成，无返回值
                            </div>
                          )}
                        </Card>
                      )
                    })}
                  </div>
                ),
              },
            ]}
          />
        </div>
      )}

      {/* 思考过程（如果存在）- 可折叠 */}
      {thinkingProcess && (
        <div style={{ marginBottom: '12px' }}>
          <Collapse
            ghost
            defaultActiveKey={[]}
            expandIconPosition="end"
            style={{ backgroundColor: '#f5f7fa', borderRadius: '6px', padding: '4px' }}
            items={[
              {
                key: 'thinking',
                label: (
                  <Space>
                    <span style={{ fontSize: '16px' }}>💭</span>
                    <span style={{ fontWeight: 500 }}>
                      深度思考
                    </span>
                  </Space>
                ),
                children: (
                  <div style={{ 
                    backgroundColor: '#ffffff', 
                    padding: '12px', 
                    borderRadius: '6px',
                    maxHeight: '400px',
                    overflowY: 'auto'
                  }}>
                    <StreamingText
                      content={thinkingProcess}
                      isStreaming={false}
                    />
                  </div>
                ),
              },
            ]}
          />
        </div>
      )}
      
      {/* 消息内容 */}
      <StreamingText
        content={content}
        isStreaming={isStreaming}
      />
      
      {/* AI 正在思考提示 - 当 SSE 连接未断开时显示，即使已有部分内容 */}
      {isStreaming && (
        <div style={{ 
          marginTop: '12px', 
          padding: '8px 12px',
          backgroundColor: '#f0f9ff',
          borderRadius: '6px',
          border: '1px solid #bae7ff',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <LoadingOutlined style={{ color: '#1890ff', fontSize: '14px' }} spin />
          <span style={{ color: '#1890ff', fontSize: '13px', fontWeight: 500 }}>
            AI 正在思考...
          </span>
        </div>
      )}
    </Card>
  )
}

