'use client'

import React, { useEffect, useState } from 'react'
import { Button, Space, Typography, Row, Col } from 'antd'
import { 
  CommentOutlined, 
  TeamOutlined, 
  SafetyOutlined, 
  RocketOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
  StarOutlined,
  ArrowRightOutlined,
  DatabaseOutlined,
  CloudOutlined,
  LockOutlined,
} from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import GlobalLayout from '@/components/GlobalLayout'
import { useUserStore } from '@/lib/store/userStore'
import ROLE_ENUM from '@/lib/constants/roleEnums'
import { checkAccess } from '@/lib/utils/checkAccess'

const { Title, Paragraph, Text } = Typography

/**
 * 主页组件
 * 展示平台介绍、功能特性和用户入口
 */
export default function HomePage() {
  const router = useRouter()
  const { loginUser, fetchLoginUser } = useUserStore()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    fetchLoginUser()
  }, [fetchLoginUser])

  // 功能特性数据
  const features = [
    {
      icon: CommentOutlined,
      title: 'AI 智能问答',
      description: '基于先进的大语言模型，提供专业的水产品食品安全咨询服务',
      action: () => router.push('/ai/chat'),
      needAuth: ROLE_ENUM.USER,
      color: '#0EA5E9',
    },
    {
      icon: SafetyOutlined,
      title: '监测数据',
      description: '海量水产品检测数据，确保真实准确',
      action: () => router.push('/ai/chat'),
      needAuth: ROLE_ENUM.USER,
      color: '#22C55E',
    },
    {
      icon: TeamOutlined,
      title: '信息管理',
      description: '管理员可以进行系统信息的增删改查操作',
      action: () => router.push('/admin/user'),
      needAuth: ROLE_ENUM.ADMIN,
      color: '#F97316',
    },
    {
      icon: RocketOutlined,
      title: '快速入门',
      description: '进行智能问答，快速上手平台功能',
      action: () => router.push('/ai/chat'),
      needAuth: ROLE_ENUM.PUBLIC,
      color: '#38BDF8',
    },
  ]

  // 平台特点
  const highlights = [
    {
      icon: DatabaseOutlined,
      title: '海量数据',
      description: '整合多源水产品检测数据',
      color: '#0EA5E9',
    },
    {
      icon: CloudOutlined,
      title: '云端服务',
      description: '随时随地访问',
      color: '#22C55E',
    },
    {
      icon: LockOutlined,
      title: '安全可靠',
      description: '数据加密存储',
      color: '#F97316',
    },
  ]

  return (
    <GlobalLayout>
      {/* Hero 区域 - 全新设计 */}
      <div style={{
        background: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* 背景装饰 */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          backgroundImage: `
            radial-gradient(circle at 20% 30%, white 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, white 0%, transparent 50%)
          `,
        }} />

        {/* 波浪装饰 */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100px',
          background: 'white',
          clipPath: 'ellipse(100% 100% at 50% 100%)',
        }} />

        <div style={{ 
          position: 'relative', 
          zIndex: 1, 
          maxWidth: '1400px', 
          margin: '0 auto',
          padding: '80px 24px 120px',
        }}>
          <Row gutter={[48, 48]} align="middle">
            {/* 左侧文字 */}
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div style={{
                  display: 'inline-block',
                  background: 'rgba(255,255,255,0.2)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  marginBottom: '24px',
                  backdropFilter: 'blur(10px)',
                }}>
                  <Text style={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>
                    🐟 专业的水产品安全监测平台
                  </Text>
                </div>

                <Title 
                  level={1} 
                  style={{ 
                    color: 'white', 
                    fontSize: '52px',
                    fontWeight: 800,
                    lineHeight: 1.2,
                    marginBottom: '24px',
                  }}
                >
                  智能化食品安全
                  <br />
                  监测解决方案
                </Title>

                <Paragraph style={{ 
                  fontSize: '20px', 
                  color: 'rgba(255,255,255,0.95)', 
                  marginBottom: '40px',
                  lineHeight: 1.6,
                }}>
                  结合人工智能技术，为您提供专业的水产品食品安全监测服务，
                  让食品安全更透明、更可靠
                </Paragraph>

                <Space size="large" wrap>
                  {!isClient ? (
                    <Button 
                      type="primary" 
                      size="large" 
                      loading
                      style={{ 
                        height: '56px', 
                        fontSize: '18px', 
                        padding: '0 40px',
                        borderRadius: '28px',
                      }}
                    >
                      加载中...
                    </Button>
                  ) : !loginUser.userRole || loginUser.userRole === ROLE_ENUM.BAN ? (
                    <>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          type="primary" 
                          size="large"
                          onClick={() => router.push('/user/login')}
                          style={{ 
                            height: '56px', 
                            fontSize: '18px', 
                            padding: '0 40px',
                            background: 'white',
                            color: '#0EA5E9',
                            border: 'none',
                            borderRadius: '28px',
                            fontWeight: 600,
                            boxShadow: '0 8px 24px rgba(255,255,255,0.3)',
                          }}
                        >
                          立即开始
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          size="large"
                          icon={<ArrowRightOutlined />}
                          onClick={() => router.push('/user/register')}
                          style={{ 
                            height: '56px', 
                            fontSize: '18px', 
                            padding: '0 40px',
                            background: 'rgba(255,255,255,0.15)',
                            color: 'white',
                            border: '2px solid rgba(255,255,255,0.3)',
                            borderRadius: '28px',
                            fontWeight: 500,
                            backdropFilter: 'blur(10px)',
                          }}
                        >
                          了解更多
                        </Button>
                      </motion.div>
                    </>
                  ) : (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        type="primary" 
                        size="large"
                        onClick={() => router.push('/ai/chat')}
                        style={{ 
                          height: '56px', 
                          fontSize: '18px', 
                          padding: '0 40px',
                          background: 'white',
                          color: '#0EA5E9',
                          border: 'none',
                          borderRadius: '28px',
                          fontWeight: 600,
                          boxShadow: '0 8px 24px rgba(255,255,255,0.3)',
                        }}
                      >
                        开始使用
                      </Button>
                    </motion.div>
                  )}
                </Space>

                {/* 平台特点标签 */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  style={{ marginTop: '48px' }}
                >
                  <Space size="middle" wrap>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircleOutlined style={{ fontSize: '20px', color: 'white' }} />
                      <Text style={{ color: 'white', fontSize: '15px' }}>专业可靠</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ThunderboltOutlined style={{ fontSize: '20px', color: 'white' }} />
                      <Text style={{ color: 'white', fontSize: '15px' }}>快速响应</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <StarOutlined style={{ fontSize: '20px', color: 'white' }} />
                      <Text style={{ color: 'white', fontSize: '15px' }}>持续更新</Text>
                    </div>
                  </Space>
                </motion.div>
              </motion.div>
            </Col>

            {/* 右侧插图 */}
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ textAlign: 'center' }}
              >
                {/* SVG 插图 */}
                <div style={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '24px',
                  padding: '40px',
                  border: '2px solid rgba(255,255,255,0.2)',
                }}>
                  <svg width="100%" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* 电脑屏幕 */}
                    <rect x="50" y="40" width="300" height="180" rx="8" fill="white" fillOpacity="0.9"/>
                    <rect x="60" y="50" width="280" height="140" rx="4" fill="#F0F9FF"/>
                    
                    {/* 屏幕内容 - 聊天气泡 */}
                    <rect x="80" y="70" width="120" height="30" rx="15" fill="#F3F4F6"/>
                    <rect x="220" y="110" width="140" height="30" rx="15" fill="white" stroke="#E5E7EB"/>
                    <rect x="80" y="150" width="100" height="30" rx="15" fill="#F3F4F6"/>
                    
                    {/* 电脑底座 */}
                    <rect x="180" y="220" width="40" height="30" fill="white" fillOpacity="0.9"/>
                    <rect x="120" y="250" width="160" height="8" rx="4" fill="white" fillOpacity="0.9"/>
                    
                    {/* 装饰元素 - 鱼 */}
                    <circle cx="320" cy="100" r="30" fill="white" fillOpacity="0.3"/>
                    <text x="305" y="115" fontSize="32">🐟</text>
                    
                    {/* 装饰元素 - 安全盾牌 */}
                    <circle cx="80" cy="240" r="25" fill="white" fillOpacity="0.3"/>
                    <text x="68" y="252" fontSize="28">🛡️</text>
                    
                    {/* 装饰元素 - AI */}
                    <circle cx="340" cy="220" r="25" fill="white" fillOpacity="0.3"/>
                    <text x="328" y="232" fontSize="28">🤖</text>
                  </svg>
                </div>
              </motion.div>
            </Col>
          </Row>
        </div>
      </div>

      {/* 平台特点区域 */}
      <div style={{ 
        background: 'white',
        padding: '80px 24px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '60px' }}
          >
            <Title 
              level={2} 
              style={{ 
                fontSize: '42px', 
                fontWeight: 800,
                marginBottom: '16px',
                background: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              为什么选择我们
            </Title>
            <Paragraph style={{ fontSize: '18px', color: '#666' }}>
              专业、可靠、高效的水产品食品安全监测解决方案
            </Paragraph>
          </motion.div>

          <Row gutter={[32, 32]}>
            {highlights.map((item, index) => {
              const Icon = item.icon
              return (
                <Col xs={24} md={8} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -8 }}
                  >
                    <div style={{
                      textAlign: 'center',
                      padding: '40px 24px',
                      borderRadius: '24px',
                      background: `linear-gradient(135deg, ${item.color}08 0%, ${item.color}03 100%)`,
                      border: `2px solid ${item.color}20`,
                      transition: 'all 0.3s ease',
                    }}>
                      <div style={{
                        display: 'inline-flex',
                        padding: '20px',
                        background: `${item.color}15`,
                        borderRadius: '20px',
                        marginBottom: '24px',
                      }}>
                        <Icon style={{ fontSize: '48px', color: item.color }} />
                      </div>
                      <Title level={4} style={{ fontSize: '22px', marginBottom: '12px' }}>
                        {item.title}
                      </Title>
                      <Paragraph style={{ fontSize: '15px', color: '#666', marginBottom: 0 }}>
                        {item.description}
                      </Paragraph>
                    </div>
                  </motion.div>
                </Col>
              )
            })}
          </Row>
        </div>
      </div>

      {/* 功能展示区域 */}
      <div style={{ 
        background: 'linear-gradient(180deg, #F0F9FF 0%, #FFFFFF 100%)',
        padding: '80px 24px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '60px' }}
          >
            <Title 
              level={2} 
              style={{ 
                fontSize: '42px', 
                fontWeight: 800,
                marginBottom: '16px',
                background: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              核心功能
            </Title>
            <Paragraph style={{ fontSize: '18px', color: '#666' }}>
              一站式解决水产品食品安全监测的所有需求
            </Paragraph>
          </motion.div>

          <Row gutter={[24, 24]}>
            {features.map((feature, index) => {
              const hasAccess = isClient ? checkAccess(loginUser, feature.needAuth) : false
              const Icon = feature.icon
              
              return (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={hasAccess ? { y: -8 } : {}}
                    style={{
                      cursor: hasAccess ? 'pointer' : 'not-allowed',
                      height: '100%',
                    }}
                    onClick={() => hasAccess && feature.action()}
                  >
                    <div style={{
                      background: hasAccess ? 'white' : 'rgba(0,0,0,0.02)',
                      borderRadius: '24px',
                      padding: '32px 24px',
                      border: `2px solid ${hasAccess ? feature.color + '20' : 'rgba(0,0,0,0.05)'}`,
                      boxShadow: hasAccess ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
                      transition: 'all 0.3s ease',
                      opacity: hasAccess ? 1 : 0.5,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}>
                      <div style={{
                        display: 'inline-flex',
                        padding: '16px',
                        background: `${feature.color}15`,
                        borderRadius: '16px',
                        marginBottom: '20px',
                        alignSelf: 'flex-start',
                      }}>
                        <Icon style={{ fontSize: '32px', color: feature.color }} />
                      </div>
                      
                      <Title 
                        level={4} 
                        style={{ 
                          fontSize: '20px', 
                          fontWeight: 700,
                          marginBottom: '12px',
                          color: hasAccess ? '#1a1a1a' : '#999',
                        }}
                      >
                        {feature.title}
                      </Title>
                      
                      <Paragraph 
                        style={{ 
                          fontSize: '14px', 
                          color: hasAccess ? '#666' : '#999',
                          lineHeight: 1.6,
                          marginBottom: hasAccess ? '16px' : 0,
                          flex: 1,
                        }}
                      >
                        {feature.description}
                      </Paragraph>

                      {!hasAccess && feature.needAuth !== ROLE_ENUM.PUBLIC && (
                        <Text style={{ fontSize: '13px', color: '#999' }}>
                          需要{feature.needAuth === ROLE_ENUM.ADMIN ? '管理员' : '登录'}权限
                        </Text>
                      )}
                    </div>
                  </motion.div>
                </Col>
              )
            })}
          </Row>
        </div>
      </div>

      {/* CTA 区域 */}
      <div style={{
        background: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
        padding: '80px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* 背景装饰 */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          backgroundImage: `
            radial-gradient(circle at 30% 50%, white 0%, transparent 50%),
            radial-gradient(circle at 70% 50%, white 0%, transparent 50%)
          `,
        }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Title 
            level={2} 
            style={{ 
              color: 'white',
              fontSize: '42px', 
              fontWeight: 800,
              marginBottom: '24px',
            }}
          >
            准备好开始了吗？
          </Title>
          
          <Paragraph style={{ fontSize: '20px', color: 'rgba(255,255,255,0.95)', marginBottom: '40px' }}>
            立即注册，体验智能化的水产品食品安全监测服务
          </Paragraph>

          <Space size="large">
            {!isClient ? (
              <Button 
                type="primary" 
                size="large" 
                loading 
                style={{ 
                  height: '56px', 
                  fontSize: '18px', 
                  padding: '0 40px', 
                  borderRadius: '28px',
                  background: 'white',
                  color: '#0EA5E9',
                }}
              >
                加载中...
              </Button>
            ) : !loginUser.userRole || loginUser.userRole === ROLE_ENUM.BAN ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    type="primary" 
                    size="large"
                    onClick={() => router.push('/user/register')}
                    style={{ 
                      height: '56px', 
                      fontSize: '18px', 
                      padding: '0 40px',
                      background: 'white',
                      color: '#0EA5E9',
                      border: 'none',
                      borderRadius: '28px',
                      fontWeight: 600,
                      boxShadow: '0 8px 24px rgba(255,255,255,0.3)',
                    }}
                  >
                    免费注册
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="large"
                    onClick={() => router.push('/user/login')}
                    style={{ 
                      height: '56px', 
                      fontSize: '18px', 
                      padding: '0 40px',
                      borderRadius: '28px',
                      fontWeight: 500,
                      background: 'rgba(255,255,255,0.15)',
                      color: 'white',
                      border: '2px solid rgba(255,255,255,0.3)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    已有账号？登录
                  </Button>
                </motion.div>
              </>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  type="primary" 
                  size="large"
                  onClick={() => router.push('/ai/chat')}
                  style={{ 
                    height: '56px', 
                    fontSize: '18px', 
                    padding: '0 40px',
                    background: 'white',
                    color: '#0EA5E9',
                    border: 'none',
                    borderRadius: '28px',
                    fontWeight: 600,
                    boxShadow: '0 8px 24px rgba(255,255,255,0.3)',
                  }}
                >
                  开始使用
                </Button>
              </motion.div>
            )}
          </Space>
        </motion.div>
      </div>
    </GlobalLayout>
  )
}
