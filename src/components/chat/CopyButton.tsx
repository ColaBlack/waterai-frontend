'use client';

import React from 'react';
import { Button, App } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';

interface CopyButtonProps {
  text: string;
  size?: 'small' | 'middle' | 'large';
  type?: 'text' | 'link' | 'default';
}

export function CopyButton({ text, size = 'small', type = 'text' }: CopyButtonProps) {
  const { message } = App.useApp();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      message.success('已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      message.error('复制失败');
    }
  };

  return (
    <Button
      type={type}
      size={size}
      icon={copied ? <CheckOutlined /> : <CopyOutlined />}
      onClick={handleCopy}
      style={{ 
        color: copied ? '#52c41a' : undefined,
        transition: 'color 0.3s'
      }}
    >
      {copied ? '已复制' : '复制'}
    </Button>
  );
}
