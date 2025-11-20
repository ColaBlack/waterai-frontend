'use client'

import React, { useState } from 'react'
import { Card, Form, Input, Button, App } from 'antd'
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { userLogin } from '@/lib/api/userService/api/userController'
import { useUserStore } from '@/lib/store/userStore'
import './login.css'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')
  const [loading, setLoading] = useState(false)
  const { fetchLoginUser } = useUserStore()
  const { message } = App.useApp() // 使用 App hook 获取 message API

  const onFinish = async (values: API.UserLoginRequest) => {
    setLoading(true)
    try {
      const res = await userLogin(values)
      if (res.data.code === 200) {
        const { token, id, userName, userAvatar, userRole } = res.data.data || {}
        
        // 保存JWT token和用户信息到localStorage
        if (token) {
          localStorage.setItem('token', token)
        }
        if (id) {
          localStorage.setItem('userId', String(id))
        }
        if (userName) {
          localStorage.setItem('userName', userName)
        }
        
        // 更新用户状态
        await fetchLoginUser()
        
        message.success('登录成功！即将跳转')
        router.push(redirect || '/')
      } else {
        message.error('登录失败！' + res.data.message)
      }
    } catch (error) {
      message.error('登录失败，请检查网络连接')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      {/* 背景装饰 */}
      <div className="background-decoration">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div>

      {/* 登录卡片容器 */}
      <div className="login-container">
        <Card className="login-card" variant="borderless">
          {/* 头部 */}
          <div className="login-header">
            <div className="logo-container">
              <SafetyOutlined className="logo-icon" style={{ fontSize: 48 }} />
            </div>
            <h2 className="login-title">欢迎登录</h2>
            <p className="login-subtitle">水产品食品安全监测智能问答平台</p>
          </div>

          {/* 登录表单 */}
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="userAccount"
              rules={[{ required: true, message: '请输入账号' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="请输入账号"
                allowClear
              />
            </Form.Item>

            <Form.Item
              name="userPassword"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入密码"
                allowClear
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="login-btn"
              >
                登录
              </Button>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <div className="register-link">
                还没有账号？
                <Link href={`/user/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}>
                  立即注册
                </Link>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  )
}

