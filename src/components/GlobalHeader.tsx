'use client'

import React, { useEffect } from 'react'
import { Layout, Menu, Dropdown, Avatar, Space, Button } from 'antd'
import { UserOutlined, LogoutOutlined, SettingOutlined, HomeOutlined, CommentOutlined, TeamOutlined } from '@ant-design/icons'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useUserStore } from '@/lib/store/userStore'
import { userLogout } from '@/lib/api/userController'
import { message } from 'antd'
import ROLE_ENUM from '@/lib/constants/roleEnums'
import { checkAccess } from '@/lib/utils/checkAccess'

const { Header } = Layout

export default function GlobalHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const { loginUser, fetchLoginUser, clearLoginUser } = useUserStore()

  useEffect(() => {
    fetchLoginUser()
  }, [fetchLoginUser])

  const handleLogout = async () => {
    try {
      const res = await userLogout()
      if (res.data.code === 200) {
        message.success('退出登录成功')
        clearLoginUser()
        router.push('/user/login')
      } else {
        message.error('退出登录失败：' + res.data.message)
      }
    } catch (error) {
      message.error('退出登录失败')
    }
  }

  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <SettingOutlined />,
        label: '个人中心',
        onClick: () => router.push('/user/profile'),
      },
      {
        type: 'divider' as const,
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
        onClick: handleLogout,
      },
    ],
  }

  // 构建菜单项
  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link href="/">主页</Link>,
    },
  ]

  // 如果有用户权限，显示 AI 问答
  if (checkAccess(loginUser, ROLE_ENUM.USER)) {
    menuItems.push({
      key: '/ai/chat',
      icon: <CommentOutlined />,
      label: <Link href="/ai/chat">AI问答</Link>,
    })
  }

  // 如果是管理员，显示用户管理
  if (checkAccess(loginUser, ROLE_ENUM.ADMIN)) {
    menuItems.push({
      key: '/admin/user',
      icon: <TeamOutlined />,
      label: <Link href="/admin/user">用户管理</Link>,
    })
  }

  // 获取当前选中的菜单项
  const getSelectedKey = () => {
    if (pathname === '/') return '/'
    if (pathname.startsWith('/ai/chat')) return '/ai/chat'
    if (pathname.startsWith('/admin/user')) return '/admin/user'
    return '/'
  }

  return (
    <Header style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      background: '#fff',
      borderBottom: '1px solid #f0f0f0',
      padding: '0 24px',
      height: '64px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          whiteSpace: 'nowrap',
        }}>
          水产品安全监测平台
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          style={{ border: 'none', minWidth: 0 }}
        />
      </div>
      
      <div>
        {loginUser.userRole !== ROLE_ENUM.PUBLIC ? (
          <Dropdown menu={userMenu} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} src={loginUser.userAvatar} />
              <span>{loginUser.userName}</span>
            </Space>
          </Dropdown>
        ) : (
          <Space>
            <Button type="text" onClick={() => router.push('/user/login')}>
              登录
            </Button>
            <Button type="primary" onClick={() => router.push('/user/register')}>
              注册
            </Button>
          </Space>
        )}
      </div>
    </Header>
  )
}

