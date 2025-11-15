'use client';

import React, { useState } from 'react';
import { CameraOutlined, UploadOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Avatar, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { fileApi } from '@/api/file';
import { cn } from '@/lib/utils';
import { compressImage, validateImageFile } from '@/lib/utils/imageCompress';

interface AvatarUploadProps {
  userId: number;
  currentAvatar?: string;
  onAvatarChange?: (avatarUrl: string) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AvatarUpload({
  userId,
  currentAvatar,
  onAvatarChange,
  size = 'md',
  className,
}: AvatarUploadProps) {
  const [avatar, setAvatar] = useState(currentAvatar);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证图片
    const validation = validateImageFile(file, 5 * 1024 * 1024); // 5MB
    if (!validation.valid) {
      message.error(validation.error);
      return;
    }

    // 创建预览
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // 压缩并上传文件
    try {
      const compressedFile = await compressImage(file, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
      });
      await uploadAvatar(compressedFile);
    } catch (error) {
      console.error('图片处理失败:', error);
      message.error('图片处理失败，请重试');
    }
  };

  const uploadAvatar = async (file: File) => {
    setIsUploading(true);
    try {
      const response = await fileApi.uploadAvatar(file, userId);
      const avatarUrl = response.data;
      
      setAvatar(avatarUrl);
      setPreviewImage(null);
      onAvatarChange?.(avatarUrl);
      
      // 这里可以调用用户信息更新API
      console.log('头像上传成功:', avatarUrl);
      
    } catch (error) {
      console.error('头像上传失败:', error);
      alert('头像上传失败，请重试');
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  const removePreview = () => {
    setPreviewImage(null);
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        {/* 头像显示 */}
        <Avatar 
          size={size === 'sm' ? 64 : size === 'md' ? 96 : 128}
            src={previewImage || avatar} 
          icon={<UserOutlined />}
          style={{ width: '100%', height: '100%' }}
          />

        {/* 上传按钮 */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-200 rounded-full flex items-center justify-center group">
          <label
            htmlFor={`avatar-upload-${userId}`}
            className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="bg-white bg-opacity-90 rounded-full p-2">
              {isUploading ? (
                <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <UploadOutlined style={{ fontSize: '20px', color: '#4b5563' }} />
              )}
            </div>
          </label>
        </div>

        {/* 预览时的删除按钮 */}
        {previewImage && !isUploading && (
          <button
            onClick={removePreview}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <CloseOutlined style={{ fontSize: '12px' }} />
          </button>
        )}

        {/* 上传进度指示器 */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="text-white text-xs">上传中...</div>
          </div>
        )}
      </div>

      {/* 隐藏的文件输入 */}
      <input
        id={`avatar-upload-${userId}`}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      {/* 上传提示 */}
      <div className="mt-2 text-center">
        <Button
          type="default"
          size="small"
          onClick={() => document.getElementById(`avatar-upload-${userId}`)?.click()}
          disabled={isUploading}
          loading={isUploading}
        >
          {isUploading ? '上传中...' : '更换头像'}
        </Button>
        <div className="text-xs text-gray-500 mt-1">
          支持 JPG、PNG、GIF 格式，最大 5MB
        </div>
      </div>
    </div>
  );
}

// 简化版头像上传组件，只显示头像和悬停上传
export function SimpleAvatarUpload({
  userId,
  currentAvatar,
  onAvatarChange,
  size = 'md',
  className,
}: AvatarUploadProps) {
  const [avatar, setAvatar] = useState(currentAvatar);
  const [isUploading, setIsUploading] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证图片
    const validation = validateImageFile(file, 5 * 1024 * 1024); // 5MB
    if (!validation.valid) {
      message.error(validation.error);
      return;
    }

    setIsUploading(true);
    try {
      // 压缩图片
      const compressedFile = await compressImage(file, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
      });
      
      const response = await fileApi.uploadAvatar(compressedFile, userId);
      const avatarUrl = response.data?.data || response.data;
      
      setAvatar(avatarUrl);
      onAvatarChange?.(avatarUrl);
      message.success('头像上传成功');
      
    } catch (error: any) {
      console.error('头像上传失败:', error);
      message.error(error?.response?.data?.message || error?.message || '头像上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn("relative inline-block group", className)}>
      <Avatar 
        size={size === 'sm' ? 32 : size === 'md' ? 48 : 64}
        src={avatar}
        icon={<UserOutlined />}
      />

      {/* 悬停上传覆盖层 */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-full flex items-center justify-center">
        <label
          htmlFor={`simple-avatar-upload-${userId}`}
          className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {isUploading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <CameraOutlined style={{ fontSize: '16px', color: 'white' }} />
          )}
        </label>
      </div>

      <input
        id={`simple-avatar-upload-${userId}`}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
}
