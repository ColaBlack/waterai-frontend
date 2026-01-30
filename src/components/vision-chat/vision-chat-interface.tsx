'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SendOutlined, PictureOutlined, CloseOutlined, CameraOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Input, Card, Select, Space, Empty, App, Modal, Image as AntImage, Spin } from 'antd';
import { getChatRecords } from '@/lib/api/chatService/api/visionChatController';
import AvatarBadge from '@/components/chat/message/AvatarBadge';
import { formatTimestamp } from '@/lib/utils/messageParser';
import { VISION_MODELS } from '@/lib/constants/models';
import { compressImage, validateImageFile } from '@/lib/utils/imageCompress';
import { ImageCropper } from '@/components/ui/image-cropper';
import StreamingText from '@/components/chat/StreamingText';
import { useUserStore } from '@/lib/store/userStore';
import { CopyButton } from '@/components/chat/CopyButton';
import { fileApi } from '@/lib/api/file';

interface VisionChatRecord {
  id?: number
  chatId?: string
  userId?: number
  userPrompt?: string
  aiResponse?: string
  content?: string
  imageUrls?: string[]
  visionModelType?: string
  modelName?: string
  messageType?: 'user' | 'ai' | 'assistant'
  createTime?: string
  updateTime?: string
  [key: string]: any
}

interface VisionChatInterfaceProps {
  chatId: string;
  onNewMessage?: (message: VisionChatRecord) => void;
}

export default function VisionChatInterface({ 
  chatId, 
  onNewMessage
}: VisionChatInterfaceProps) {
  const { message } = App.useApp();
  const { loginUser } = useUserStore();
  const [messages, setMessages] = useState<VisionChatRecord[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [modelName, setModelName] = useState<string>('qwen3-vl-flash-2026-01-22');
  const [streamingResponse, setStreamingResponse] = useState('');
  const [cropperVisible, setCropperVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isSendingMessageRef = useRef(false);

  useEffect(() => {
    loadChatHistory();
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingResponse]);

  const loadChatHistory = async () => {
    if (isSendingMessageRef.current) {
      return;
    }

    try {
      const response = await getChatRecords({ chatId });
      if (response.data) {
        const data: any = response.data;
        if (data.code === 200 && Array.isArray(data.data)) {
          setMessages(data.data);
        } else if (Array.isArray(response.data)) {
          setMessages(response.data);
        }
      }
    } catch (error) {
      console.error('加载聊天记录失败:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileSelect = async (files: File[]) => {
    if (files.length > 1) {
      message.error('只能上传1张图片');
      return;
    }
    
    if (selectedImageFiles.length > 0 || imageUrls.length > 0) {
      message.warning('已存在图片，将替换为新图片');
      setImageUrls([]);
      setSelectedImageFiles([]);
    }
    
    const file = files[0];
    const validation = validateImageFile(file, 5 * 1024 * 1024);
    if (!validation.valid) {
      message.error(validation.error);
      return;
    }
    
    const img = new window.Image()
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);
      setSelectedFile(file);
      setCropperVisible(true);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      message.error('图片加载失败，请重试');
    };
    
    img.src = objectUrl;
  }
  
  const uploadImageToServer = async (file: File): Promise<string> => {
    try {
      const imageUrl = await fileApi.uploadChatImage(file, chatId);
      return imageUrl;
    } catch (error) {
      console.error('上传图片失败:', error);
      throw error;
    }
  };

  const processAndUploadImage = async (file: File) => {
    setIsUploading(true);
    try {
      const compressedFile = await compressImage(file, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.8,
      });
      
      const imageUrl = await uploadImageToServer(compressedFile);
      setImageUrls([imageUrl]);
      message.success('图片上传成功');
    } catch (error) {
      console.error('图片处理失败:', error);
      message.error('图片上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCropComplete = async (croppedFile: File) => {
    setCropperVisible(false);
    setSelectedFile(null);
    // 处理裁剪后的图片（上传到图床）
    await processAndUploadImage(croppedFile);
  };

  const removeImage = () => {
    setImageUrls([]);
    setSelectedImageFiles([]);
  };

  const handleSend = async () => {
    if (!inputValue.trim() && imageUrls.length === 0) return;
    if (isLoading || isUploading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);
    setStreamingResponse('');
    isSendingMessageRef.current = true;

    const userId = loginUser?.id || 
      (typeof window !== 'undefined' && localStorage.getItem('userId') 
        ? parseInt(localStorage.getItem('userId')!) 
        : null)
    
    if (!userId) {
      message.error('用户未登录，请先登录');
      setIsLoading(false);
      return;
    }

    const imageUrlList = [...imageUrls];

    const newUserMessage: VisionChatRecord = {
      id: Date.now(),
      chatId,
      userId,
      messageType: 'user',
      content: userMessage || '请分析这些图片',
      imageUrls: imageUrlList,
      createTime: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setImageUrls([]);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('/api/ai/chat/vision', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          userPrompt: userMessage || '请分析这些图片',
          chatId,
          imageUrls: imageUrlList,
          visionModelName: modelName,
        }),
      });

      if (!response.ok) {
        throw new Error('请求失败');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('无法读取响应流');

      let fullResponse = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data.trim()) {
              fullResponse += data;
              setStreamingResponse(fullResponse);
            }
          }
        }
      }

      const aiMessage: VisionChatRecord = {
        id: Date.now() + 1,
        chatId,
        userId,
        messageType: 'assistant',
        content: fullResponse,
        imageUrls: [],
        modelName: modelName,
        createTime: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setStreamingResponse('');
      onNewMessage?.(aiMessage);

      setTimeout(() => {
        isSendingMessageRef.current = false;
        loadChatHistory();
      }, 1000);

    } catch (error) {
      console.error('发送消息失败:', error);
      setStreamingResponse('');
      isSendingMessageRef.current = false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff' }}>
      {/* 模型选择 */}
      <div style={{ 
        padding: '16px', 
        borderBottom: '1px solid #e5e6eb',
        background: '#fafbfc',
      }}>
        <Space wrap size="middle" style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: '#4e5969', fontWeight: 500 }}>模型选择：</span>
            <Select
              value={modelName}
              onChange={(value) => setModelName(value)}
              style={{ width: 300 }}
              options={VISION_MODELS as any}
            />
          </div>
        </Space>
      </div>

      {/* 消息列表 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
      }}>
        {messages.length === 0 && !isLoading ? (
          <Empty
            image={<CameraOutlined style={{ fontSize: '64px', color: '#999' }} />}
            description={
              <div>
                <h3>开始视觉对话</h3>
                <p style={{ color: '#999' }}>上传图片并输入问题，AI将为您分析图片内容</p>
              </div>
            }
            style={{ marginTop: '80px' }}
          />
        ) : (
          messages.map((message) => {
            const isUser = message.messageType === 'user';
            return (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                  marginBottom: '16px',
                }}
              >
                <div style={{
                  maxWidth: '80%',
                  display: 'flex',
                  gap: '12px',
                  flexDirection: isUser ? 'row-reverse' : 'row',
                }}>
                  <AvatarBadge isUser={isUser} />
                  <div style={{ flex: 1 }}>
                    <Card
                      size="small"
                      style={{
                        backgroundColor: isUser ? '#f0f2f5' : '#ffffff',
                        border: isUser ? 'none' : '1px solid #e5e6eb',
                      }}
                    >
                      {/* 图片显示 */}
                      {message.imageUrls && message.imageUrls.length > 0 && (
                        <div style={{
                          marginBottom: '12px',
                          display: 'grid',
                          gridTemplateColumns: message.imageUrls.length === 1
                            ? '1fr'
                            : message.imageUrls.length === 2
                            ? 'repeat(2, 1fr)'
                            : 'repeat(auto-fit, minmax(120px, 1fr))',
                          gap: '8px',
                        }}>
                          <AntImage.PreviewGroup>
                            {message.imageUrls.map((url, index) => (
                              <div key={index} style={{ position: 'relative' }}>
                                <AntImage
                                  src={url}
                                  alt={`图片 ${index + 1}`}
                                  style={{
                                    width: '100%',
                                    maxWidth: (message.imageUrls?.length || 0) === 1 ? '400px' : '200px',
                                    maxHeight: '200px',
                                    objectFit: 'contain',
                                    cursor: 'pointer',
                                    borderRadius: '6px',
                                    border: '1px solid #e5e6eb',
                                    display: 'block',
                                    margin: '0 auto',
                                  }}
                                  onError={(e) => {
                                    console.error('图片加载失败:', url);
                                  }}
                                />
                              </div>
                            ))}
                          </AntImage.PreviewGroup>
                        </div>
                      )}

                      {/* 消息内容 */}
                      <div style={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        color: isUser ? '#262626' : '#262626',
                      }}>
                        {isUser ? (
                          message.content
                        ) : (
                          <StreamingText content={message.content || ''} isStreaming={false} />
                        )}
                      </div>

                      {/* 时间和复制按钮 */}
                      <div style={{
                        marginTop: '8px',
                        fontSize: '12px',
                        color: '#8c8c8c',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <span>{message.createTime ? formatTimestamp(new Date(message.createTime).getTime()) : ''}</span>
                        <CopyButton text={message.content || ''} />
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            );
          })
            )}

        {/* 流式响应显示 */}
        {streamingResponse && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '16px',
          }}>
            <div style={{
              maxWidth: '80%',
              display: 'flex',
              gap: '12px',
            }}>
              <AvatarBadge isUser={false} />
              <Card
                size="small"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e6eb',
                }}
              >
                <StreamingText content={streamingResponse} isStreaming={true} />
              </Card>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div style={{
        borderTop: '1px solid #e5e6eb',
        backgroundColor: '#fafbfc',
        padding: '16px',
      }}>
        {/* 图片预览 */}
        {imageUrls.length > 0 && (
          <div style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '12px',
          }}>
            {imageUrls.map((url, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <img
                  src={url}
                  alt={`预览 ${index + 1}`}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    border: '1px solid #e5e6eb',
                  }}
                />
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={removeImage}
                  disabled={isUploading}
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    width: '20px',
                    height: '20px',
                    padding: 0,
                    minWidth: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#ff4d4f',
                    border: '2px solid white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                />
              </div>
            ))}
          </div>
        )}
        
        {/* 处理进度提示 */}
        {isUploading && (
          <div style={{ 
            marginBottom: '12px',
            padding: '12px',
            backgroundColor: '#f0f2f5',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />} />
            <span style={{ color: '#666' }}>正在上传图片到服务器...</span>
          </div>
        )}

        {/* 文件上传按钮 */}
        <div 
          style={{ marginBottom: '12px' }}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const files = e.dataTransfer.files;
            if (files && files.length > 0) {
              const fileArray = Array.from(files).filter(file => file.type.startsWith('image/'));
              if (fileArray.length === 0) {
                message.error('请上传图片文件');
                return;
              }
              // 限制文件数量为1
              if (fileArray.length > 1) {
                message.error('只能上传1张图片');
                return;
              }
              handleFileSelect(fileArray);
            }
          }}
        >
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={async (e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                const fileArray = Array.from(files);
                handleFileSelect(fileArray);
                // 清空input，允许重复选择同一文件
                e.target.value = '';
              }
            }}
            style={{ display: 'none' }}
            id="vision-image-upload"
          disabled={isUploading}
          />
          <Button
            icon={<PictureOutlined />}
            disabled={isLoading}
            onClick={() => {
              if (!isLoading) {
                document.getElementById('vision-image-upload')?.click();
              }
            }}
            style={{
              width: '100%',
              height: '40px',
              border: '1px dashed #d9d9d9',
              borderRadius: '6px',
            }}
          >
            点击或拖拽上传图片
          </Button>
          </div>

        {/* 输入框和发送按钮 */}
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end',
        }}>
          <div style={{ flex: 1 }}>
            <Input.TextArea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
              placeholder={
                imageUrls.length > 0
                  ? '请输入您的问题（Enter 发送，Shift+Enter 换行）'
                  : '请输入您的问题，或先上传图片（Enter 发送，Shift+Enter 换行）'
              }
              autoSize={{ minRows: 2, maxRows: 6 }}
            disabled={isLoading}
          />
          </div>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={isLoading}
            disabled={isLoading || isUploading || (!inputValue.trim() && imageUrls.length === 0)}
            size="large"
          >
            发送
          </Button>
        </div>
      </div>

      {/* 图片裁剪弹窗 */}
      <ImageCropper
        visible={cropperVisible}
        imageFile={selectedFile}
        onCrop={handleCropComplete}
        onCancel={() => {
          setCropperVisible(false);
          setSelectedFile(null);
        }}
        maxWidth={1920}
        maxHeight={1920}
      />

      {/* 图片预览弹窗 */}
      <Modal
        open={previewVisible}
        title="图片预览"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width="80%"
        style={{ maxWidth: '1200px' }}
      >
        <AntImage
          src={previewImage}
          alt="预览"
          style={{ width: '100%' }}
          preview={false}
        />
      </Modal>
    </div>
  );
}
