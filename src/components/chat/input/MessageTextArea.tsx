'use client'

import React from 'react'
import { Input } from 'antd'
import { MESSAGE_CONSTANTS } from '@/lib/constants/chat'

const { TextArea } = Input

/**
 * 消息输入框组件
 * 可复用的文本输入框，支持多行输入和键盘快捷键
 */
interface MessageTextAreaProps {
  /** 输入值 */
  value: string
  /** 值变化回调 */
  onChange: (value: string) => void
  /** 回车发送回调 */
  onEnterSend?: () => void
  /** 是否禁用 */
  disabled?: boolean
  /** 占位符文本 */
  placeholder?: string
  /** 是否显示字数统计 */
  showCount?: boolean
}

export default function MessageTextArea({
  value,
  onChange,
  onEnterSend,
  disabled = false,
  placeholder,
  showCount = true,
}: MessageTextAreaProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && onEnterSend) {
      e.preventDefault()
      onEnterSend()
    }
  }

  return (
    <TextArea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      autoSize={{ minRows: MESSAGE_CONSTANTS.INPUT_MIN_ROWS, maxRows: MESSAGE_CONSTANTS.INPUT_MAX_ROWS }}
      maxLength={MESSAGE_CONSTANTS.MAX_LENGTH}
      showCount={showCount}
      disabled={disabled}
    />
  )
}

