'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Modal, Button, Slider, Space } from 'antd'
import { ZoomInOutlined, ZoomOutOutlined, RotateLeftOutlined, RotateRightOutlined } from '@ant-design/icons'

interface ImageCropperProps {
  /** 是否显示裁剪弹窗 */
  visible: boolean
  /** 原始图片文件 */
  imageFile: File | null
  /** 裁剪完成回调 */
  onCrop: (croppedFile: File) => void
  /** 取消回调 */
  onCancel: () => void
  /** 裁剪框宽高比（可选，如 1 表示正方形） */
  aspectRatio?: number
  /** 最大宽度 */
  maxWidth?: number
  /** 最大高度 */
  maxHeight?: number
}

export function ImageCropper({
  visible,
  imageFile,
  onCrop,
  onCancel,
  aspectRatio,
  maxWidth = 1920,
  maxHeight = 1920,
}: ImageCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [imageSrc, setImageSrc] = useState<string>('')
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [imageData, setImageData] = useState<{ width: number; height: number; img: HTMLImageElement | null }>({
    width: 0,
    height: 0,
    img: null,
  })

  const CANVAS_WIDTH = 600
  const CANVAS_HEIGHT = 400

  // 加载图片
  useEffect(() => {
    if (imageFile && visible) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const src = e.target?.result as string
        setImageSrc(src)
        
        const img = new Image()
        img.onload = () => {
          setImageData({ width: img.width, height: img.height, img })
          
          // 初始化裁剪区域
          let cropWidth: number
          let cropHeight: number
          
          if (aspectRatio) {
            // 根据宽高比计算裁剪区域
            if (CANVAS_WIDTH / CANVAS_HEIGHT > aspectRatio) {
              cropHeight = CANVAS_HEIGHT * 0.8
              cropWidth = cropHeight * aspectRatio
            } else {
              cropWidth = CANVAS_WIDTH * 0.8
              cropHeight = cropWidth / aspectRatio
            }
          } else {
            cropWidth = CANVAS_WIDTH * 0.8
            cropHeight = CANVAS_HEIGHT * 0.8
          }
          
          setCropArea({
            x: (CANVAS_WIDTH - cropWidth) / 2,
            y: (CANVAS_HEIGHT - cropHeight) / 2,
            width: cropWidth,
            height: cropHeight,
          })
          
          setScale(1)
          setRotation(0)
          setPosition({ x: 0, y: 0 })
        }
        img.src = src
      }
      reader.readAsDataURL(imageFile)
    }
  }, [imageFile, visible, aspectRatio])

  // 绘制图片和裁剪框
  useEffect(() => {
    if (!canvasRef.current || !imageSrc || !imageData.img) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // 绘制半透明背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // 保存上下文
    ctx.save()
    
    // 移动到画布中心
    ctx.translate(canvas.width / 2, canvas.height / 2)
    
    // 应用旋转
    ctx.rotate((rotation * Math.PI) / 180)
    
    // 应用缩放和位置
    ctx.scale(scale, scale)
    ctx.translate(position.x, position.y)
    
    // 计算图片显示尺寸（保持宽高比）
    const imgAspect = imageData.width / imageData.height
    let displayWidth = canvas.height * 1.5
    let displayHeight = canvas.height * 1.5
    
    if (imgAspect > 1) {
      displayHeight = displayWidth / imgAspect
    } else {
      displayWidth = displayHeight * imgAspect
    }
    
    // 绘制图片
    ctx.drawImage(imageData.img, -displayWidth / 2, -displayHeight / 2, displayWidth, displayHeight)
    
    // 恢复上下文
    ctx.restore()
    
    // 绘制裁剪框
    ctx.strokeStyle = '#1890ff'
    ctx.lineWidth = 2
    ctx.setLineDash([])
    ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height)
    
    // 绘制裁剪框的四个角
    const cornerSize = 20
    ctx.fillStyle = '#1890ff'
    
    // 左上角
    ctx.fillRect(cropArea.x - 2, cropArea.y - 2, cornerSize, 4)
    ctx.fillRect(cropArea.x - 2, cropArea.y - 2, 4, cornerSize)
    
    // 右上角
    ctx.fillRect(cropArea.x + cropArea.width - cornerSize, cropArea.y - 2, cornerSize, 4)
    ctx.fillRect(cropArea.x + cropArea.width - 2, cropArea.y - 2, 4, cornerSize)
    
    // 左下角
    ctx.fillRect(cropArea.x - 2, cropArea.y + cropArea.height - 2, cornerSize, 4)
    ctx.fillRect(cropArea.x - 2, cropArea.y + cropArea.height - cornerSize, 4, cornerSize)
    
    // 右下角
    ctx.fillRect(cropArea.x + cropArea.width - cornerSize, cropArea.y + cropArea.height - 2, cornerSize, 4)
    ctx.fillRect(cropArea.x + cropArea.width - 2, cropArea.y + cropArea.height - cornerSize, 4, cornerSize)
    
    // 清除裁剪区域外的内容
    ctx.globalCompositeOperation = 'destination-in'
    ctx.fillStyle = '#000'
    ctx.fillRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height)
  }, [imageSrc, scale, rotation, position, cropArea, imageData])

  // 处理鼠标拖拽
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // 检查是否在裁剪框内
    if (
      x >= cropArea.x &&
      x <= cropArea.x + cropArea.width &&
      y >= cropArea.y &&
      y <= cropArea.y + cropArea.height
    ) {
      setIsDragging(true)
      setDragStart({ x: x - position.x, y: y - position.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setPosition({
      x: x - dragStart.x,
      y: y - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // 裁剪图片
  const handleCrop = () => {
    if (!imageData.img || !imageFile) return
    
    // 创建新的canvas用于裁剪
    const cropCanvas = document.createElement('canvas')
    const cropCtx = cropCanvas.getContext('2d')
    if (!cropCtx) return
    
    // 计算裁剪区域在原图中的位置
    // 首先需要计算图片在canvas中的显示尺寸
    const imgAspect = imageData.width / imageData.height
    let displayWidth = CANVAS_HEIGHT * 1.5
    let displayHeight = CANVAS_HEIGHT * 1.5
    
    if (imgAspect > 1) {
      displayHeight = displayWidth / imgAspect
    } else {
      displayWidth = displayHeight * imgAspect
    }
    
    // 计算裁剪区域相对于图片中心的位置
    const cropCenterX = cropArea.x + cropArea.width / 2 - CANVAS_WIDTH / 2
    const cropCenterY = cropArea.y + cropArea.height / 2 - CANVAS_HEIGHT / 2
    
    // 应用旋转和缩放变换
    const cos = Math.cos((rotation * Math.PI) / 180)
    const sin = Math.sin((rotation * Math.PI) / 180)
    
    // 反向变换到原图坐标系
    const rotatedX = (cropCenterX - position.x) * cos + (cropCenterY - position.y) * sin
    const rotatedY = -(cropCenterX - position.x) * sin + (cropCenterY - position.y) * cos
    
    // 计算在原图中的裁剪区域
    const scaleX = imageData.width / displayWidth / scale
    const scaleY = imageData.height / displayHeight / scale
    
    const cropX = (imageData.width / 2) + rotatedX * scaleX - (cropArea.width * scaleX) / 2
    const cropY = (imageData.height / 2) + rotatedY * scaleY - (cropArea.height * scaleY) / 2
    const cropWidth = cropArea.width * scaleX
    const cropHeight = cropArea.height * scaleY
    
    // 确保裁剪区域在图片范围内
    const finalX = Math.max(0, Math.min(cropX, imageData.width))
    const finalY = Math.max(0, Math.min(cropY, imageData.height))
    const finalWidth = Math.min(cropWidth, imageData.width - finalX, maxWidth)
    const finalHeight = Math.min(cropHeight, imageData.height - finalY, maxHeight)
    
    // 设置裁剪canvas尺寸
    cropCanvas.width = finalWidth
    cropCanvas.height = finalHeight
    
    // 如果图片有旋转，需要先旋转再裁剪
    if (rotation !== 0) {
      // 创建一个临时canvas来旋转图片
      const tempCanvas = document.createElement('canvas')
      const tempCtx = tempCanvas.getContext('2d')
      if (!tempCtx) return
      
      // 计算旋转后的尺寸
      const rad = (rotation * Math.PI) / 180
      const rotatedWidth = Math.abs(imageData.width * Math.cos(rad)) + Math.abs(imageData.height * Math.sin(rad))
      const rotatedHeight = Math.abs(imageData.width * Math.sin(rad)) + Math.abs(imageData.height * Math.cos(rad))
      
      tempCanvas.width = rotatedWidth
      tempCanvas.height = rotatedHeight
      
      tempCtx.translate(rotatedWidth / 2, rotatedHeight / 2)
      tempCtx.rotate(rad)
      tempCtx.drawImage(imageData.img, -imageData.width / 2, -imageData.height / 2)
      
      // 从旋转后的图片中裁剪
      cropCtx.drawImage(tempCanvas, finalX, finalY, finalWidth, finalHeight, 0, 0, finalWidth, finalHeight)
    } else {
      // 直接裁剪
      cropCtx.drawImage(imageData.img, finalX, finalY, finalWidth, finalHeight, 0, 0, finalWidth, finalHeight)
    }
    
    // 转换为Blob
    cropCanvas.toBlob((blob) => {
      if (blob) {
        const croppedFile = new File(
          [blob],
          imageFile.name.replace(/\.[^/.]+$/, '') + '.jpg',
          {
            type: 'image/jpeg',
            lastModified: Date.now(),
          }
        )
        onCrop(croppedFile)
      }
    }, 'image/jpeg', 0.9)
  }

  return (
    <Modal
      title="裁剪图片"
      open={visible}
      onCancel={onCancel}
      width={700}
      footer={
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={handleCrop}>
            确认裁剪
          </Button>
        </Space>
      }
    >
      <div style={{ marginBottom: '16px' }}>
        <Space>
          <Button
            icon={<ZoomOutOutlined />}
            onClick={() => setScale(Math.max(0.5, scale - 0.1))}
          >
            缩小
          </Button>
          <Button
            icon={<ZoomInOutlined />}
            onClick={() => setScale(Math.min(3, scale + 0.1))}
          >
            放大
          </Button>
          <Button
            icon={<RotateLeftOutlined />}
            onClick={() => setRotation(rotation - 90)}
          >
            左旋转
          </Button>
          <Button
            icon={<RotateRightOutlined />}
            onClick={() => setRotation(rotation + 90)}
          >
            右旋转
          </Button>
        </Space>
      </div>
      
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          overflow: 'hidden',
          background: '#f5f5f5',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
      
      <div style={{ marginTop: '16px' }}>
        <div style={{ marginBottom: '8px' }}>缩放: {Math.round(scale * 100)}%</div>
        <Slider
          min={50}
          max={300}
          value={scale * 100}
          onChange={(value) => setScale(value / 100)}
        />
      </div>
    </Modal>
  )
}
