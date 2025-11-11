'use client'

import React from 'react'
import { Collapse, Card, Tag, Space } from 'antd'
import { DatabaseOutlined, FileTextOutlined } from '@ant-design/icons'
import type { RetrievedDocument } from '@/lib/types/chat'
import { messageStyles } from './styles'

interface RAGDocumentsPanelProps {
  documents: RetrievedDocument[]
}

export default function RAGDocumentsPanel({ documents }: RAGDocumentsPanelProps) {
  if (!documents || documents.length === 0) {
    return null
  }

  return (
    <div style={{ marginBottom: '12px' }}>
      <Collapse
        ghost
        defaultActiveKey={[]}
        expandIconPosition="end"
        style={messageStyles.collapse.rag}
        items={[
          {
            key: 'rag',
            label: (
              <Space>
                <DatabaseOutlined style={{ color: '#1890ff' }} />
                <span style={{ fontWeight: 500 }}>
                  已检索到 {documents.length} 个相关文档
                </span>
              </Space>
            ),
            children: (
              <div style={messageStyles.content.scrollable}>
                {documents.map((doc, index) => (
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
                    <div style={{
                      fontSize: '13px',
                      color: '#666',
                      whiteSpace: 'pre-wrap',
                    }}>
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
  )
}


