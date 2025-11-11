import { useCallback } from 'react'
import type { UploadFile } from 'antd'
import type { ModelConfig } from '@/lib/types/chat'
import { convertImagesToBase64, cleanInputValue } from '../utils'

interface UseSendMessageParams {
  value: string
  selectedModel: string
  useWebSearch: boolean
  useRAG: boolean
  useToolCalling: boolean
  isText: boolean
  imageFiles: UploadFile[]
  isConnecting: boolean
  chatId: string
  onChange: (value: string) => void
  onSend: (config: ModelConfig) => void
  setImageFiles: (files: UploadFile[]) => void
}

export function useSendMessage({
  value,
  selectedModel,
  useWebSearch,
  useRAG,
  useToolCalling,
  isText,
  imageFiles,
  isConnecting,
  chatId,
  onChange,
  onSend,
  setImageFiles,
}: UseSendMessageParams) {
  const handleSend = useCallback(async () => {
    if (!value.trim() || isConnecting || !chatId) return

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

    if (!isText && imageFiles.length > 0) {
      const imageUrls = await convertImagesToBase64(imageFiles)
      if (imageUrls.length > 0) {
        ;(config as any).imageUrls = imageUrls
      }
    }

    onSend(config)
    setImageFiles([])
  }, [
    value,
    selectedModel,
    useWebSearch,
    useRAG,
    useToolCalling,
    isText,
    imageFiles,
    isConnecting,
    chatId,
    onChange,
    onSend,
    setImageFiles,
  ])

  const handleEnterSend = useCallback(() => {
    const cleanedValue = cleanInputValue(value)
    if (cleanedValue !== value) {
      onChange(cleanedValue)
    }
    handleSend()
  }, [value, onChange, handleSend])

  return {
    handleSend,
    handleEnterSend,
  }
}


