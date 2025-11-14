'use client'

import React, { useState } from 'react'
import { Button } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd'
import ModelConfigPanel from './input/ModelConfigPanel'
import ImageUploader from './input/ImageUploader'
import MessageTextArea from './input/MessageTextArea'
import { useModelConfig } from './input/hooks/useModelConfig'
import { useSendMessage } from './input/hooks/useSendMessage'

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: (config: any) => void
  isConnecting: boolean
  chatId: string
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  isConnecting,
  chatId,
}: ChatInputProps) {
  const [imageFiles, setImageFiles] = useState<UploadFile[]>([])
  const modelConfig = useModelConfig()
  const { handleSend, handleEnterSend } = useSendMessage({
    value,
    selectedModel: modelConfig.selectedModel,
    isText: modelConfig.isText,
    imageFiles,
    isConnecting,
    chatId,
    onChange,
    onSend,
    setImageFiles,
  })

  return (
    <div style={{
      borderTop: '1px solid #e5e6eb',
      backgroundColor: '#fafbfc',
      padding: '16px',
    }}>
      <ModelConfigPanel
        selectedModel={modelConfig.selectedModel}
        onModelChange={modelConfig.setSelectedModel}
      />

      {!modelConfig.isText && (
        <ImageUploader fileList={imageFiles} onChange={setImageFiles} />
      )}

      <div style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-end',
      }}>
        <div style={{ flex: 1 }}>
          <MessageTextArea
            value={value}
            onChange={onChange}
            onEnterSend={handleEnterSend}
            disabled={isConnecting || !chatId}
            placeholder={
              isConnecting
                ? '连接中...'
                : !modelConfig.isText
                ? '请输入您的问题（Enter 发送，Shift+Enter 换行）'
                : '请输入您的问题（Enter 发送，Shift+Enter 换行，最多1000字）'
            }
          />
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          alignItems: 'center',
        }}>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={isConnecting}
            disabled={!value.trim() || !chatId}
            size="large"
          >
            发送
          </Button>
        </div>
      </div>
    </div>
  )
}
