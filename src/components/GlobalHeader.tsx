'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Layout, Menu, Button, Avatar, Dropdown, message, Space } from 'antd'
import type { MenuProps } from 'antd'
import { UserOutlined, LogoutOutlined, CommentOutlined, TeamOutlined, HomeOutlined, SettingOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useUserStore } from '@/lib/store/userStore'
import { checkAccess } from '@/lib/utils/checkAccess'
import ROLE_ENUM from '@/lib/constants/roleEnums'
import { userLogout } from '@/api/userService/userController'

const { Header } = Layout

export default function GlobalHeader() {
  const router = useRouter()
  const { loginUser, fetchLoginUser, logout, isLoggedIn } = useUserStore()
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // 标记组件已水合，确保客户端渲染
    setIsHydrated(true)
    fetchLoginUser()
  }, [fetchLoginUser])

  const handleLogout = async () => {
    try {
      // 可选：调用后端登出接口（清除服务端可能的状态）
      // 但不依赖其结果，因为JWT是无状态的
      await userLogout().catch(() => {
        // 忽略后端登出错误，因为JWT是无状态的
      })
      
      message.success('退出登录成功')
      logout() // 使用新的logout方法，会清除localStorage中的token
      router.push('/user/login')
    } catch (error) {
      // 即使后端登出失败，也要清除本地token
      logout()
      message.success('退出登录成功')
      router.push('/user/login')
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

  // 构建菜单项 - 只在客户端水合后才进行权限检查
  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link href="/">主页</Link>,
    },
  ]

  // 只在客户端水合后才添加需要权限检查的菜单项
  if (isHydrated) {
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
  }

  // 获取当前选中的菜单项 - 暂时简化
  const getSelectedKey = () => {
    return '/' // 暂时默认选中主页
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
        {!isHydrated ? (
          // 服务端渲染时显示加载状态，避免水合不匹配
          <Space>
            <Button type="text" loading>
              登录
            </Button>
            <Button type="primary" loading>
              注册
            </Button>
          </Space>
        ) : isLoggedIn() ? (
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

