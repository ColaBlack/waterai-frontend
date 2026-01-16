'use client'

import React, { useEffect, useState } from 'react'
import { Card, Form, Input, Button, Avatar, Space, Divider, Upload, App } from 'antd'
import { UserOutlined, LockOutlined, UploadOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import GlobalLayout from '@/components/GlobalLayout'
import { useUserStore } from '@/lib/store/userStore'
import { updateMyProfile, updateMyPassword } from '@/lib/api/userService/api/userController'
import { fileApi } from '@/lib/api/file'
import { USER_ROLE } from '@/lib/constants/roleEnums'
import { ImageCropper } from '@/components/ui/image-cropper'

export default function UserProfilePage() {
  const { message } = App.useApp()
  const { loginUser, fetchLoginUser } = useUserStore()
  const [profileForm] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [cropperVisible, setCropperVisible] = useState(false)
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null)

  useEffect(() => {
    fetchLoginUser()
  }, [fetchLoginUser])

  useEffect(() => {
    if (loginUser.id) {
      profileForm.setFieldsValue({
        userName: loginUser.userName,
        userProfile: loginUser.userProfile,
      })
    }
  }, [loginUser, profileForm])

  const handleUpdateProfile = async (values: API.UserUpdateMyRequest) => {
    setProfileLoading(true)
    try {
      const res = await updateMyProfile(values)
      if (res.data.code === 200) {
        message.success('更新个人资料成功')
        await fetchLoginUser()
      } else {
        message.error('更新失败：' + res.data.message)
      }
    } catch (error) {
      message.error('更新失败，请检查网络连接')
    } finally {
      setProfileLoading(false)
    }
  }

  const handleUpdatePassword = async (values: API.UserUpdatePasswordRequest) => {
    setPasswordLoading(true)
    try {
      const res = await updateMyPassword(values)
      if (res.data.code === 200) {
        message.success('修改密码成功')
        passwordForm.resetFields()
      } else {
        message.error('修改密码失败：' + res.data.message)
      }
    } catch (error) {
      message.error('修改密码失败，请检查网络连接')
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleAvatarFileSelect = (file: File) => {
    // 使用统一的图片验证工具
    import('@/lib/utils/imageCompress').then(({ validateImageFile }) => {
      // 验证图片
      const validation = validateImageFile(file, 5 * 1024 * 1024) // 5MB
      if (!validation.valid) {
        message.error(validation.error)
        return
      }

      // 检查图片尺寸，如果较大则显示裁剪界面
      const img = new Image()
      img.onload = () => {
        if (img.width > 800 || img.height > 800) {
          setSelectedAvatarFile(file)
          setCropperVisible(true)
        } else {
          // 直接上传
          handleAvatarUpload(file)
        }
      }
      img.onerror = () => {
        message.error('图片加载失败')
      }
      img.src = URL.createObjectURL(file)
    })
  }

  const handleAvatarUpload = async (avatarFile: File) => {
    setAvatarLoading(true)
    try {
      // 使用统一的图片压缩工具
      const { compressImage } = await import('@/lib/utils/imageCompress')
      
      // 压缩图片
      const compressedFile = await compressImage(avatarFile, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
      })

      // 上传压缩后的头像
      const uploadRes = await fileApi.uploadAvatar(compressedFile, loginUser.id)
      
      // 后端返回格式: { code: 200, data: "url", message: "..." }
      // axios 响应格式: response.data = { code: 200, data: "url", message: "..." }
      let avatarUrl: string | undefined
      
      if (uploadRes.data) {
        // 检查是否是 BaseResponse 格式
        if (uploadRes.data.data !== undefined) {
          avatarUrl = uploadRes.data.data
        } else if (typeof uploadRes.data === 'string') {
          // 如果直接返回字符串
          avatarUrl = uploadRes.data
        }
      }
      
      if (avatarUrl && typeof avatarUrl === 'string') {
        // 更新用户资料中的头像
        const updateRes = await updateMyProfile({
          userAvatar: avatarUrl,
        })
        
        if (updateRes.data.code === 200) {
          message.success('头像上传成功')
          // 刷新用户信息
          await fetchLoginUser()
        } else {
          message.error('头像更新失败：' + (updateRes.data.message || '未知错误'))
        }
      } else {
        const errorMsg = '头像上传失败：返回数据格式错误'
        console.error('头像上传响应格式错误:', uploadRes.data)
        message.error(errorMsg)
      }
    } catch (error: any) {
      console.error('头像上传失败:', error)
      message.error('头像上传失败，请重试')
    } finally {
      setAvatarLoading(false)
    }
  }

  const handleAvatarCropComplete = async (croppedFile: File) => {
    setCropperVisible(false)
    await handleAvatarUpload(croppedFile)
    setSelectedAvatarFile(null)
  }

  const handleAvatarUploadRequest: UploadProps['customRequest'] = async ({ file }) => {
    handleAvatarFileSelect(file as File)
  }

  return (
    <GlobalLayout>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '24px auto', 
        padding: '0 24px',
        width: '100%'
      }}>
        <h1 style={{ marginBottom: '24px' }}>个人中心</h1>

        {/* 用户信息卡片 */}
        <Card title="基本信息" style={{ marginBottom: '24px' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Space>
              <Upload
                customRequest={handleAvatarUploadRequest}
                showUploadList={false}
                accept="image/*"
                disabled={avatarLoading}
              >
                <div style={{ position: 'relative', cursor: 'pointer' }}>
                  <Avatar 
                    size={64} 
                    icon={<UserOutlined />} 
                    src={loginUser.userAvatar}
                    style={{ 
                      border: '2px solid #d9d9d9',
                      transition: 'all 0.3s',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#1890ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      border: '2px solid white',
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      document.querySelector('input[type="file"]')?.click()
                    }}
                  >
                    {avatarLoading ? (
                      <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        border: '2px solid white',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                      }} />
                    ) : (
                      <UploadOutlined style={{ color: 'white', fontSize: '12px' }} />
                    )}
                  </div>
                </div>
              </Upload>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  {loginUser.userName}
                </div>
                <div style={{ color: '#666', marginTop: '4px' }}>
                  {loginUser.userRole && USER_ROLE[loginUser.userRole as keyof typeof USER_ROLE]}
                </div>
              </div>
            </Space>

            <Divider />

            <Form
              form={profileForm}
              layout="vertical"
              onFinish={handleUpdateProfile}
            >
              <Form.Item
                label="用户昵称"
                name="userName"
                rules={[{ required: true, message: '请输入用户昵称' }]}
              >
                <Input placeholder="请输入用户昵称" />
              </Form.Item>

              <Form.Item
                label="用户简介"
                name="userProfile"
              >
                <Input.TextArea 
                  rows={4} 
                  placeholder="请输入用户简介" 
                  maxLength={200}
                  showCount
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={profileLoading}
                >
                  保存更改
                </Button>
              </Form.Item>
            </Form>
          </Space>
        </Card>

        {/* 修改密码卡片 */}
        <Card title="修改密码">
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handleUpdatePassword}
            style={{ maxWidth: '500px' }}
          >
            <Form.Item
              label="旧密码"
              name="oldPassword"
              rules={[{ required: true, message: '请输入旧密码' }]}
            >
              <Input.Password 
                prefix={<LockOutlined />}
                placeholder="请输入旧密码" 
              />
            </Form.Item>

            <Form.Item
              label="新密码"
              name="newPassword"
              rules={[
                { required: true, message: '请输入新密码' },
                { min: 6, message: '密码长度不能少于6位' },
                { max: 20, message: '密码长度不能超过20位' }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />}
                placeholder="请输入新密码（6-20位）" 
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={passwordLoading}
              >
                修改密码
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>

      {/* 头像裁剪弹窗 */}
      <ImageCropper
        visible={cropperVisible}
        imageFile={selectedAvatarFile}
        onCrop={handleAvatarCropComplete}
        onCancel={() => {
          setCropperVisible(false)
          setSelectedAvatarFile(null)
        }}
        aspectRatio={1}
        maxWidth={800}
        maxHeight={800}
      />
    </GlobalLayout>
  )
}

