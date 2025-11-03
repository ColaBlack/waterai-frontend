'use client'

import React, { useState } from 'react'
import { Input, Button, Select, Space, Checkbox, Divider, Upload, Tag, message as antdMessage } from 'antd'
import { SendOutlined, PictureOutlined, InfoCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd'
import { ModelConfig } from '@/lib/types/chat'
import { MESSAGE_CONSTANTS } from '@/lib/constants/chat'

const { TextArea } = Input

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: (config: ModelConfig) => void
  isConnecting: boolean
  chatId: string
}

export default function ChatInput({ value, onChange, onSend, isConnecting, chatId }: ChatInputProps) {
  // 模型配置状态
  const [selectedModel, setSelectedModel] = useState<string>('glm-4.5-flash')
  const [useWebSearch, setUseWebSearch] = useState(false)
  const [useRAG, setUseRAG] = useState(false)
  const [useToolCalling, setUseToolCalling] = useState(false)
  const [imageFiles, setImageFiles] = useState<UploadFile[]>([])

  // 判断是否为文本模型
  const isTextModel = ['glm-z1-flash', 'glm-4.5-flash', 'glm-4-flash'].includes(selectedModel)

  // 处理模型切换
  const handleModelChange = (value: string) => {
    setSelectedModel(value)
    // 切换到视觉模型时，清空功能选项
    if (!['glm-z1-flash', 'glm-4.5-flash', 'glm-4-flash'].includes(value)) {
      setUseWebSearch(false)
      setUseRAG(false)
      setUseToolCalling(false)
    }
  }

  // 处理图片上传
  const handleImageChange = ({ fileList }: { fileList: UploadFile[] }) => {
    // 最多上传10张图片
    if (fileList.length > 10) {
      antdMessage.warning('最多上传10张图片')
      return
    }
    setImageFiles(fileList)
  }

  // 转换图片为 Base64
  const convertImagesToBase64 = async (files: UploadFile[]): Promise<string[]> => {
    const imageUrls: string[] = []
    
    for (const file of files) {
      if (file.originFileObj) {
        try {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(file.originFileObj!)
          })
          imageUrls.push(base64)
        } catch (error) {
          // 静默失败
        }
      }
    }
    
    return imageUrls
  }

  const handleSend = async () => {
    if (!value.trim() || isConnecting || !chatId) return

    // 清理输入值：移除尾随的换行符和空格
    const cleanedValue = value.trim()
    if (cleanedValue !== value) {
      onChange(cleanedValue)
    }

    const config: ModelConfig = {
      model: selectedModel,
      isVision: !isTextModel,
      useWebSearch: isTextModel ? useWebSearch : false,
      useRAG: isTextModel ? useRAG : false,
      useToolCalling: isTextModel ? useToolCalling : false,
    }

    // 如果是视觉模型且有图片，转换为 Base64
    if (!isTextModel && imageFiles.length > 0) {
      const imageUrls = await convertImagesToBase64(imageFiles)
      if (imageUrls.length > 0) {
        // 这里需要修改 onSend 的类型以支持图片
        ;(config as any).imageUrls = imageUrls
      }
    }

    onSend(config)
    // 发送后清空图片
    setImageFiles([])
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault()
      // 在发送前清理可能已经被添加的换行符
      const cleanedValue = value.trim()
      if (cleanedValue !== value) {
        onChange(cleanedValue)
      }
      handleSend()
    }
  }

  return (
    <div style={{ borderTop: '1px solid #e5e6eb', backgroundColor: '#fafbfc', padding: '16px' }}>
      {/* 模型配置区域 */}
      <div style={{
        padding: '12px 16px',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #fafbfc 100%)',
        borderRadius: '8px',
        border: '1px solid #e5e6eb',
        marginBottom: '12px',
      }}>
        <Space wrap size="middle">
          {/* 模型选择 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: '#4e5969', fontWeight: 500 }}>模型选择：</span>
            <Select
              value={selectedModel}
              onChange={handleModelChange}
              style={{ width: 220 }}
              options={[
                {
                  label: '文本模型',
                  options: [
                    { label: 'GLM-Z1-Flash（深度推理）', value: 'glm-z1-flash' },
                    { label: 'GLM-4.5-Flash（标准）', value: 'glm-4.5-flash' },
                    { label: 'GLM-4-Flash（普通）', value: 'glm-4-flash' },
                  ],
                },
                {
                  label: '视觉模型',
                  options: [
                    { label: 'GLM-4V-Flash（快速识别）', value: 'vision' },
                    { label: 'GLM-4.1V-Thinking-Flash（深度思考）', value: 'vision_reasoning' },
                  ],
                },
              ]}
            />
          </div>

          {/* 文本模型功能选项 */}
          {isTextModel ? (
            <>
              <Divider type="vertical" style={{ height: 24, margin: 0 }} />
              <Checkbox checked={useWebSearch} onChange={(e) => setUseWebSearch(e.target.checked)}>
                联网搜索
              </Checkbox>
              <Checkbox checked={useRAG} onChange={(e) => setUseRAG(e.target.checked)}>
                知识库检索（RAG）
              </Checkbox>
              <Checkbox checked={useToolCalling} onChange={(e) => setUseToolCalling(e.target.checked)}>
                水产品数据库检索
              </Checkbox>
            </>
          ) : (
            <>
              <Divider type="vertical" style={{ height: 24, margin: 0 }} />
              <Tag color="orange" icon={<InfoCircleOutlined />}>
                视觉模型暂不支持联网搜索和知识库功能
              </Tag>
            </>
          )}
        </Space>
      </div>

      {/* 视觉模型图片上传区域 */}
      {!isTextModel && (
        <div style={{ marginBottom: '12px' }}>
          <Upload
            listType="picture-card"
            fileList={imageFiles}
            onChange={handleImageChange}
            beforeUpload={() => false}
            accept="image/*"
            maxCount={10}
          >
            {imageFiles.length < 10 && (
              <div>
                <PictureOutlined />
                <div style={{ marginTop: 8 }}>上传图片</div>
              </div>
            )}
          </Upload>
          <div style={{ fontSize: '12px', color: '#86909c', marginTop: '8px' }}>
            支持上传 1-10 张图片，支持 JPG、PNG 等格式
          </div>
        </div>
      )}

      {/* 输入框区域 */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <TextArea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isConnecting
                ? '连接中...'
                : !isTextModel
                ? '请输入您的问题（Enter 发送，Shift+Enter 换行）'
                : '请输入您的问题（Enter 发送，Shift+Enter 换行，最多1000字）'
            }
            autoSize={{ minRows: MESSAGE_CONSTANTS.INPUT_MIN_ROWS, maxRows: MESSAGE_CONSTANTS.INPUT_MAX_ROWS }}
            maxLength={MESSAGE_CONSTANTS.MAX_LENGTH}
            showCount
            disabled={isConnecting || !chatId}
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
