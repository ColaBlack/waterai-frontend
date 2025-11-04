'use client'

import React, { useState } from 'react'
import { Button, Space } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd'
import { ModelConfig } from '@/lib/types/chat'
import { isTextModel, DEFAULT_MODEL } from '@/lib/constants/models'
import ModelConfigPanel from './input/ModelConfigPanel'
import ImageUploader from './input/ImageUploader'
import MessageTextArea from './input/MessageTextArea'
import { convertImagesToBase64, cleanInputValue } from './input/utils'

/**
 * 聊天输入组件
 * 整合模型配置、图片上传和消息输入功能
 */
interface ChatInputProps {
  /** 输入值 */
  value: string
  /** 值变化回调 */
  onChange: (value: string) => void
  /** 发送消息回调 */
  onSend: (config: ModelConfig) => void
  /** 是否正在连接 */
  isConnecting: boolean
  /** 当前聊天室ID */
  chatId: string
}

export default function ChatInput({ value, onChange, onSend, isConnecting, chatId }: ChatInputProps) {
  // 模型配置状态
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL)
  const [useWebSearch, setUseWebSearch] = useState(false)
  const [useRAG, setUseRAG] = useState(false)
  const [useToolCalling, setUseToolCalling] = useState(false)
  const [imageFiles, setImageFiles] = useState<UploadFile[]>([])

  const isText = isTextModel(selectedModel)

  // 处理模型切换
  const handleModelChange = (newModel: string) => {
    setSelectedModel(newModel)
    // 切换到视觉模型时，清空功能选项
    if (!isTextModel(newModel)) {
      setUseWebSearch(false)
      setUseRAG(false)
      setUseToolCalling(false)
    }
  }

  // 处理发送消息
  const handleSend = async () => {
    if (!value.trim() || isConnecting || !chatId) return

    // 清理输入值
    const cleanedValue = cleanInputValue(value)
    if (cleanedValue !== value) {
      onChange(cleanedValue)
    }

    const config: ModelConfig = {
      model: selectedModel,
      isVision: !isText,
      useWebSearch: isText ? useWebSearch : false,
      useRAG: isText ? useRAG : false,
      useToolCalling: isText ? useToolCalling : false,
    }

    // 如果是视觉模型且有图片，转换为 Base64
    if (!isText && imageFiles.length > 0) {
      const imageUrls = await convertImagesToBase64(imageFiles)
      if (imageUrls.length > 0) {
        ;(config as any).imageUrls = imageUrls
      }
    }

    onSend(config)
    // 发送后清空图片
    setImageFiles([])
  }

  // 处理回车发送
  const handleEnterSend = () => {
    const cleanedValue = cleanInputValue(value)
    if (cleanedValue !== value) {
      onChange(cleanedValue)
    }
    handleSend()
  }

  return (
    <div style={{ borderTop: '1px solid #e5e6eb', backgroundColor: '#fafbfc', padding: '16px' }}>
      {/* 模型配置面板 */}
      <ModelConfigPanel
        selectedModel={selectedModel}
        useWebSearch={useWebSearch}
        useRAG={useRAG}
        useToolCalling={useToolCalling}
        onModelChange={handleModelChange}
        onWebSearchChange={setUseWebSearch}
        onRAGChange={setUseRAG}
        onToolCallingChange={setUseToolCalling}
      />

      {/* 视觉模型图片上传区域 */}
      {!isText && (
        <ImageUploader fileList={imageFiles} onChange={setImageFiles} />
      )}

      {/* 输入框区域 */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <MessageTextArea
            value={value}
            onChange={onChange}
            onEnterSend={handleEnterSend}
            disabled={isConnecting || !chatId}
            placeholder={
              isConnecting
                ? '连接中...'
                : !isText
                ? '请输入您的问题（Enter 发送，Shift+Enter 换行）'
                : '请输入您的问题（Enter 发送，Shift+Enter 换行，最多1000字）'
            }
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
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
