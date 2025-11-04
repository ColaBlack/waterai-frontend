'use client'

import React from 'react'
import { Upload, message } from 'antd'
import { PictureOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd'
import { IMAGE_UPLOAD_CONSTANTS } from '@/lib/constants/models'

/**
 * 图片上传组件
 * 用于视觉模型上传图片
 */
interface ImageUploaderProps {
  /** 文件列表 */
  fileList: UploadFile[]
  /** 文件列表变化回调 */
  onChange: (fileList: UploadFile[]) => void
}

export default function ImageUploader({ fileList, onChange }: ImageUploaderProps) {
  const handleChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    // 最多上传指定数量的图片
    if (newFileList.length > IMAGE_UPLOAD_CONSTANTS.MAX_COUNT) {
      message.warning(`最多上传${IMAGE_UPLOAD_CONSTANTS.MAX_COUNT}张图片`)
      return
    }
    onChange(newFileList)
  }

  return (
    <div style={{ marginBottom: '12px' }}>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onChange={handleChange}
        beforeUpload={() => false}
        accept="image/*"
        maxCount={IMAGE_UPLOAD_CONSTANTS.MAX_COUNT}
      >
        {fileList.length < IMAGE_UPLOAD_CONSTANTS.MAX_COUNT && (
          <div>
            <PictureOutlined />
            <div style={{ marginTop: 8 }}>上传图片</div>
          </div>
        )}
      </Upload>
      <div style={{ fontSize: '12px', color: '#86909c', marginTop: '8px' }}>
        支持上传 1-{IMAGE_UPLOAD_CONSTANTS.MAX_COUNT} 张图片，支持 {IMAGE_UPLOAD_CONSTANTS.ACCEPT_FORMATS}
      </div>
    </div>
  )
}

