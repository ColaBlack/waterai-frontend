'use client'

import React, { useEffect, useState } from 'react'
import { Card, Form, Input, Button, message, Avatar, Space, Divider } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import GlobalLayout from '@/components/GlobalLayout'
import { useUserStore } from '@/lib/store/userStore'
import { updateMyProfile, updateMyPassword } from '@/api/userService/userController'
import { USER_ROLE } from '@/lib/constants/roleEnums'

export default function UserProfilePage() {
  const { loginUser, fetchLoginUser } = useUserStore()
  const [profileForm] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  useEffect(() => {
    fetchLoginUser()
  }, [fetchLoginUser])

  useEffect(() => {
    if (loginUser.id) {
      profileForm.setFieldsValue({
        userName: loginUser.userName,
        userAvatar: loginUser.userAvatar,
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
              <Avatar size={64} icon={<UserOutlined />} src={loginUser.userAvatar} />
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
                label="用户头像"
                name="userAvatar"
              >
                <Input placeholder="请输入头像URL" />
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
    </GlobalLayout>
  )
}

