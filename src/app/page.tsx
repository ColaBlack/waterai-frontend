'use client'

import React, { useEffect } from 'react'
import { Button, Card, Space, Typography } from 'antd'
import { CommentOutlined, TeamOutlined, SafetyOutlined, RocketOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import GlobalLayout from '@/components/GlobalLayout'
import { useUserStore } from '@/lib/store/userStore'
import ROLE_ENUM from '@/lib/constants/roleEnums'
import { checkAccess } from '@/lib/utils/checkAccess'

const { Title, Paragraph } = Typography

export default function HomePage() {
  const router = useRouter()
  const { loginUser, fetchLoginUser } = useUserStore()

  useEffect(() => {
    fetchLoginUser()
  }, [fetchLoginUser])

  const features = [
    {
      icon: <CommentOutlined style={{ fontSize: '48px', color: '#667eea' }} />,
      title: 'AI 智能问答',
      description: '基于先进的 AI 模型，提供专业的水产品食品安全咨询服务',
      action: () => router.push('/ai/chat'),
      needAuth: ROLE_ENUM.USER,
    },
    {
      icon: <SafetyOutlined style={{ fontSize: '48px', color: '#52c41a' }} />,
      title: '安全监测',
      description: '实时监测水产品质量，确保食品安全符合标准',
      action: () => router.push('/ai/chat'),
      needAuth: ROLE_ENUM.USER,
    },
    {
      icon: <TeamOutlined style={{ fontSize: '48px', color: '#ff7875' }} />,
      title: '用户管理',
      description: '管理员可以进行用户信息的增删改查操作',
      action: () => router.push('/admin/user'),
      needAuth: ROLE_ENUM.ADMIN,
    },
    {
      icon: <RocketOutlined style={{ fontSize: '48px', color: '#ffa940' }} />,
      title: '快速入门',
      description: '查看使用文档，快速上手平台功能',
      action: () => router.push('/ai/chat'),
      needAuth: ROLE_ENUM.PUBLIC,
    },
  ]

  return (
    <GlobalLayout>
      {/* Hero Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '80px 24px',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <Title level={1} style={{ color: 'white', marginBottom: '16px' }}>
          水产品食品安全监测智能问答平台
        </Title>
        <Paragraph style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', marginBottom: '32px' }}>
          结合人工智能技术，为您提供专业的水产品食品安全监测服务
        </Paragraph>
        <Space size="large">
          {loginUser.userRole === ROLE_ENUM.PUBLIC ? (
            <>
              <Button type="primary" size="large" onClick={() => router.push('/user/login')}>
                立即登录
              </Button>
              <Button size="large" style={{ background: 'white', color: '#667eea' }} onClick={() => router.push('/user/register')}>
                注册账号
              </Button>
            </>
          ) : (
            <Button type="primary" size="large" onClick={() => router.push('/ai/chat')}>
              开始使用
            </Button>
          )}
        </Space>
      </div>

      {/* Features Section */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '60px auto',
          padding: '0 24px',
        }}
      >
        <Title level={2} style={{ textAlign: 'center', marginBottom: '48px' }}>
          平台功能
        </Title>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {features.map((feature, index) => {
            const hasAccess = checkAccess(loginUser, feature.needAuth)
            return (
              <Card
                key={index}
                hoverable={hasAccess}
                style={{
                  textAlign: 'center',
                  opacity: hasAccess ? 1 : 0.6,
                }}
                onClick={() => hasAccess && feature.action()}
              >
                <div style={{ marginBottom: '16px' }}>{feature.icon}</div>
                <Title level={4}>{feature.title}</Title>
                <Paragraph style={{ color: '#666' }}>
                  {feature.description}
                </Paragraph>
                {!hasAccess && feature.needAuth !== ROLE_ENUM.PUBLIC && (
                  <Paragraph type="secondary" style={{ fontSize: '12px' }}>
                    需要{feature.needAuth === ROLE_ENUM.ADMIN ? '管理员' : '登录'}权限
                  </Paragraph>
                )}
              </Card>
            )
          })}
        </div>
      </div>

      {/* About Section */}
      <div
        style={{
          background: '#fafbfc',
          padding: '60px 24px',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
            关于平台
          </Title>
          <Card>
            <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
              本平台是一个结合了人工智能技术的水产品食品安全监测智能问答系统。
              通过先进的自然语言处理技术，为用户提供专业的食品安全咨询服务，
              帮助企业和个人更好地了解和把握水产品质量安全标准。
            </Paragraph>
            <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
              平台支持多模型切换、联网搜索、RAG增强等功能，可以根据不同的场景和需求，
              提供最适合的解决方案。同时，平台还提供了完善的用户管理系统，
              方便管理员进行用户信息的管理和维护。
            </Paragraph>
          </Card>
        </div>
      </div>
    </GlobalLayout>
  )
}

