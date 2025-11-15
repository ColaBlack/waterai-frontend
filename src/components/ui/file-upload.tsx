'use client';

import React, { useRef, useState } from 'react';
import { UploadOutlined, CloseOutlined, PictureOutlined, FileTextOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // MB
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;
  onUpload?: (files: File[]) => Promise<string[]>;
  className?: string;
  disabled?: boolean;
  preview?: boolean;
  children?: React.ReactNode;
}

interface FileWithPreview extends File {
  preview?: string;
}

export function FileUpload({
  accept = "image/*",
  multiple = false,
  maxSize = 10,
  maxFiles = 1,
  onFilesChange,
  onUpload,
  className,
  disabled = false,
  preview = true,
  children,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const fileArray = Array.from(newFiles);
    const validFiles: FileWithPreview[] = [];

    fileArray.forEach((file) => {
      // 检查文件大小
      if (file.size > maxSize * 1024 * 1024) {
        console.warn(`文件 ${file.name} 超过大小限制 ${maxSize}MB`);
        return;
      }

      // 检查文件数量
      if (files.length + validFiles.length >= maxFiles) {
        console.warn(`最多只能上传 ${maxFiles} 个文件`);
        return;
      }

      // 添加预览（限制预览图片大小）
      if (preview && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            // 限制预览图片的最大尺寸为 800x800
            const maxDimension = 800;
            let width = img.width;
            let height = img.height;
            
            if (width > maxDimension || height > maxDimension) {
              if (width > height) {
                height = (height / width) * maxDimension;
                width = maxDimension;
              } else {
                width = (width / height) * maxDimension;
                height = maxDimension;
              }
            }
            
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              file.preview = canvas.toDataURL('image/jpeg', 0.8);
          setFiles(prev => [...prev]);
            }
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }

      validFiles.push(file);
    });

    const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const handleUpload = async () => {
    if (!onUpload || files.length === 0) return;

    setUploading(true);
    try {
      await onUpload(files);
    } catch (error) {
      console.error('上传失败:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
    // 如果提供了onUpload回调，自动上传
    if (onUpload && e.dataTransfer.files.length > 0) {
      const fileArray = Array.from(e.dataTransfer.files);
      handleUpload();
    }
  };

  const openFileDialog = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* 上传区域 */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={disabled}
        />
        
        {children || (
          <div className="space-y-2">
            <UploadOutlined className="mx-auto" style={{ fontSize: '48px', color: '#9ca3af' }} />
            <div className="text-sm text-gray-600">
              <span className="font-medium text-primary">点击上传</span> 或拖拽文件到此处
            </div>
            <div className="text-xs text-gray-500">
              支持 {accept}，最大 {maxSize}MB
              {multiple && `，最多 ${maxFiles} 个文件`}
            </div>
          </div>
        )}
      </div>

      {/* 文件预览 */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">已选择的文件</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border bg-gray-50">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : file.type.startsWith('image/') ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <PictureOutlined style={{ fontSize: '32px', color: '#9ca3af' }} />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileTextOutlined style={{ fontSize: '32px', color: '#9ca3af' }} />
                    </div>
                  )}
                </div>
                
                {/* 删除按钮 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={disabled}
                >
                  <CloseOutlined style={{ fontSize: '12px' }} />
                </button>
                
                {/* 文件名 */}
                <div className="mt-1 text-xs text-gray-600 truncate" title={file.name}>
                  {file.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 上传按钮 */}
      {onUpload && files.length > 0 && (
        <Button
          onClick={handleUpload}
          disabled={disabled || uploading}
          block
          loading={uploading}
        >
          {uploading ? '上传中...' : '上传文件'}
        </Button>
      )}
    </div>
  );
}
