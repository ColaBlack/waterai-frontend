'use client'

import React, { useEffect, useState } from 'react'
import { Button, Card, Row, Col, Space, Typography } from 'antd'
import { CommentOutlined, TeamOutlined, SafetyOutlined, RocketOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import GlobalLayout from '@/components/GlobalLayout'
import { useUserStore } from '@/lib/store/userStore'
import ROLE_ENUM from '@/lib/constants/roleEnums'
import { checkAccess } from '@/lib/utils/checkAccess'
import { ParticleBackground } from '@/components/animations/ParticleBackground'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { TypewriterText } from '@/components/animations/TypewriterText'
import { GradientText } from '@/components/animations/GradientText'
import { staggerContainer, scaleIn, float } from '@/lib/animations/variants'

const { Title, Paragraph } = Typography

/**
 * 主页组件
 * 展示平台介绍、功能特性和用户入口
 * 根据用户权限显示不同的功能卡片
 */
export default function HomePage() {
  const router = useRouter()
  const { loginUser, fetchLoginUser } = useUserStore()
  // 客户端水合状态，防止服务端渲染不匹配
  const [isClient, setIsClient] = useState(false)

  // 组件挂载时获取用户信息
  useEffect(() => {
    setIsClient(true)
    fetchLoginUser()
  }, [fetchLoginUser])

  // 平台功能配置，包含权限控制
  const features = [
    {
      icon: <CommentOutlined style={{ fontSize: '48px', color: '#667eea' }} />,
      title: 'AI 智能问答',
      description: '基于先进的 AI 模型，提供专业的水产品食品安全咨询服务',
      action: () => router.push('/ai/chat'),
      needAuth: ROLE_ENUM.USER, // 需要用户权限
    },
    {
      icon: <SafetyOutlined style={{ fontSize: '48px', color: '#52c41a' }} />,
      title: '安全监测',
      description: '实时监测水产品质量，确保食品安全符合标准',
      action: () => router.push('/ai/chat'),
      needAuth: ROLE_ENUM.USER, // 需要用户权限
    },
    {
      icon: <TeamOutlined style={{ fontSize: '48px', color: '#ff7875' }} />,
      title: '用户管理',
      description: '管理员可以进行用户信息的增删改查操作',
      action: () => router.push('/admin/user'),
      needAuth: ROLE_ENUM.ADMIN, // 需要管理员权限
    },
    {
      icon: <RocketOutlined style={{ fontSize: '48px', color: '#ffa940' }} />,
      title: '快速入门',
      description: '查看使用文档，快速上手平台功能',
      action: () => router.push('/ai/chat'),
      needAuth: ROLE_ENUM.PUBLIC, // 公开访问
    },
  ]

  return (
    <GlobalLayout>
      {/* 粒子背景 */}
      <ParticleBackground particleCount={60} opacity={0.4} />
      
      {/* 主要展示区域 - 平台标题和入口按钮 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // 渐变背景
          padding: '80px 24px',
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <motion.div
          variants={float}
          animate="animate"
        >
          <GradientText
            gradient="linear-gradient(90deg, #ffffff, #f0f0f0, #ffffff)"
            animated={true}
          >
            <Title level={1} style={{ color: 'white', marginBottom: '16px' }}>
              <TypewriterText 
                text="水产品食品安全监测智能问答平台"
                speed={100}
                cursor={false}
              />
            </Title>
          </GradientText>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <Paragraph style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', marginBottom: '32px' }}>
            结合人工智能技术，为您提供专业的水产品食品安全监测服务
          </Paragraph>
        </motion.div>
        <Space size="large">
          {/* 根据用户状态显示不同的操作按钮 */}
          {!isClient ? (
            // 客户端未水合时显示加载状态
            <Button type="primary" size="large" loading>
              加载中...
            </Button>
          ) : !loginUser.userRole || loginUser.userRole === ROLE_ENUM.BAN ? (
            // 未登录或被禁用的用户显示登录注册按钮
            <>
              <Button type="primary" size="large" onClick={() => router.push('/user/login')}>
                立即登录
              </Button>
              <Button size="large" style={{ background: 'white', color: '#667eea' }} onClick={() => router.push('/user/register')}>
                注册账号
              </Button>
            </>
          ) : (
            // 已登录用户显示开始使用按钮
            <Button type="primary" size="large" onClick={() => router.push('/ai/chat')}>
              开始使用
            </Button>
          )}
        </Space>
      </motion.div>

      {/* 功能特性展示区域 */}
      <ScrollReveal direction="up" delay={0.2}>
        <div
          style={{
            maxWidth: '1200px',
            margin: '60px auto',
            padding: '0 24px',
          }}
        >
        <GradientText>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '48px' }}>
            平台功能
          </Title>
        </GradientText>
        
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <Row gutter={[24, 24]} justify="center">
            {/* 遍历功能列表，根据权限显示不同状态 */}
            {features.map((feature, index) => {
              // 检查用户是否有访问该功能的权限
              const hasAccess = isClient ? checkAccess(loginUser, feature.needAuth) : false
              return (
                <Col
                  key={index}
                  xs={24}
                  sm={12}
                  md={12}
                  lg={6}
                  xl={6}
                  xxl={6}
                >
                  <motion.div
                    variants={scaleIn}
                    whileHover={hasAccess ? { 
                      scale: 1.05,
                      boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                    } : {}}
                    whileTap={hasAccess ? { scale: 0.98 } : {}}
                  >
                    <Card
                      hoverable={hasAccess}
                      style={{
                        textAlign: 'center',
                        opacity: hasAccess ? 1 : 0.6,
                        height: '100%',
                        cursor: hasAccess ? 'pointer' : 'not-allowed',
                      }}
                      onClick={() => hasAccess && feature.action()}
                    >
                      <motion.div 
                        style={{ marginBottom: '16px' }}
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        {feature.icon}
                      </motion.div>
                  <Title level={4}>{feature.title}</Title>
                  <Paragraph style={{ color: '#666', minHeight: '48px' }}>
                    {feature.description}
                  </Paragraph>
                  {/* 对于无权限访问的功能，显示权限提示 */}
                  {isClient && !hasAccess && feature.needAuth !== ROLE_ENUM.PUBLIC && (
                    <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: '8px' }}>
                      需要{feature.needAuth === ROLE_ENUM.ADMIN ? '管理员' : '登录'}权限
                    </Paragraph>
                  )}
                </Card>
                  </motion.div>
                </Col>
              )
            })}
          </Row>
        </motion.div>
        </div>
      </ScrollReveal>

      {/* 平台介绍区域 */}
      <ScrollReveal direction="up" delay={0.3}>
        <div
          style={{
            background: '#fafbfc', // 浅灰色背景
            padding: '60px 24px',
            position: 'relative',
          }}
        >
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <GradientText>
              <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
                关于平台
              </Title>
            </GradientText>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card>
            {/* 平台介绍文字 */}
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
            </motion.div>
          </div>
        </div>
      </ScrollReveal>
    </GlobalLayout>
  )
}

