'use client'

import React, { useState } from 'react'
import { Card, Form, Input, Button, App } from 'antd'
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { userRegister } from '@/lib/api/userController'
import '../login/login.css'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')
  const [loading, setLoading] = useState(false)
  const { message } = App.useApp() // 使用 App hook 获取 message API

  const onFinish = async (values: API.UserRegisterRequest) => {
    if (values.userPassword !== values.checkPassword) {
      message.error('两次输入的密码不一致')
      return
    }

    setLoading(true)
    try {
      const res = await userRegister(values)
      if (res.data.code === 200) {
        message.success('注册成功！即将跳转到登录页面')
        setTimeout(() => {
          router.push(`/user/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`)
        }, 1000)
      } else {
        message.error('注册失败！' + res.data.message)
      }
    } catch (error) {
      message.error('注册失败，请检查网络连接')
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

      {/* 注册卡片容器 */}
      <div className="login-container">
        <Card className="login-card" variant="borderless">
          {/* 头部 */}
          <div className="login-header">
            <div className="logo-container">
              <SafetyOutlined className="logo-icon" style={{ fontSize: 48 }} />
            </div>
            <h2 className="login-title">欢迎注册</h2>
            <p className="login-subtitle">水产品食品安全监测智能问答平台</p>
          </div>

          {/* 注册表单 */}
          <Form
            name="register"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="userAccount"
              rules={[
                { required: true, message: '请输入账号' },
                { min: 4, message: '账号长度不能少于4位' },
                { max: 20, message: '账号长度不能超过20位' },
                { pattern: /^[a-zA-Z0-9]+$/, message: '账号只能包含字母和数字' }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="请输入账号（4-20位字母数字）"
                allowClear
              />
            </Form.Item>

            <Form.Item
              name="userPassword"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码长度不能少于6位' },
                { max: 20, message: '密码长度不能超过20位' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入密码（6-20位）"
                allowClear
              />
            </Form.Item>

            <Form.Item
              name="checkPassword"
              rules={[
                { required: true, message: '请再次输入密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('userPassword') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'))
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请再次输入密码"
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
                注册
              </Button>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <div className="register-link">
                已有账号？
                <Link href={`/user/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}>
                  立即登录
                </Link>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  )
}

