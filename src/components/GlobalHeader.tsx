'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Layout, Menu, Button, Avatar, Dropdown, Space, App } from 'antd'
import type { MenuProps } from 'antd'
import { UserOutlined, LogoutOutlined, CommentOutlined, TeamOutlined, HomeOutlined, SettingOutlined, CameraOutlined, MessageOutlined, BarChartOutlined, FileTextOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useUserStore } from '@/lib/store/userStore'
import { checkAccess } from '@/lib/utils/checkAccess'
import ROLE_ENUM from '@/lib/constants/roleEnums'
import { userLogout } from '@/lib/api/userService/api/userController'

const { Header } = Layout

/**
 * 全局头部组件
 * 包含导航菜单、用户信息显示和登录状态管理
 * 根据用户权限动态显示不同的菜单项
 */
export default function GlobalHeader() {
  const { message } = App.useApp()
  const router = useRouter()
  const pathname = usePathname()
  const { loginUser, fetchLoginUser, logout, isLoggedIn } = useUserStore()
  // 水合状态，确保客户端渲染与服务端一致
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // 标记组件已水合，确保客户端渲染
    setIsHydrated(true)
    // 获取当前登录用户信息
    fetchLoginUser()
  }, [fetchLoginUser])

  /**
   * 处理用户登出操作
   * 清除本地token并跳转到登录页面
   */
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

  // 用户下拉菜单配置
  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <SettingOutlined />,
        label: '个人中心',
        onClick: () => router.push('/user/profile'),
      },
      {
        type: 'divider' as const, // 分割线
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
        onClick: handleLogout,
      },
    ],
  }

  // 构建导航菜单项 - 只在客户端水合后才进行权限检查
  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link href="/">主页</Link>,
    },
  ]

  // 只在客户端水合后才添加需要权限检查的菜单项
  if (isHydrated) {
    // 如果用户具有普通用户权限，显示 AI 相关功能
    if (checkAccess(loginUser, ROLE_ENUM.USER)) {
      menuItems.push({
        key: '/ai/chat',
        icon: <CommentOutlined />,
        label: <Link href="/ai/chat">AI问答</Link>,
      })
      menuItems.push({
        key: '/ai/vision',
        icon: <CameraOutlined />,
        label: <Link href="/ai/vision">视觉AI</Link>,
      })
    }

    // 如果用户具有管理员权限，显示管理功能菜单
    if (checkAccess(loginUser, ROLE_ENUM.ADMIN)) {
      menuItems.push({
        key: '/admin/statistics',
        icon: <BarChartOutlined />,
        label: <Link href="/admin/statistics">系统统计</Link>,
      })
      menuItems.push({
        key: '/admin/knowledge',
        icon: <FileTextOutlined />,
        label: <Link href="/admin/knowledge">知识库</Link>,
      })
      menuItems.push({
        key: '/admin/user',
        icon: <TeamOutlined />,
        label: <Link href="/admin/user">用户管理</Link>,
      })
      menuItems.push({
        key: '/admin/chat',
        icon: <MessageOutlined />,
        label: <Link href="/admin/chat">聊天管理</Link>,
      })
    }
  }

  /**
   * 根据当前路径获取选中的菜单项
   * @returns 当前活跃菜单项的key
   */
  const getSelectedKey = () => {
    // 根据当前路径匹配菜单项
    if (pathname === '/') {
      return '/'
    } else if (pathname.startsWith('/ai/chat')) {
      return '/ai/chat'
    } else if (pathname.startsWith('/ai/vision')) {
      return '/ai/vision'
    } else if (pathname.startsWith('/admin/statistics')) {
      return '/admin/statistics'
    } else if (pathname.startsWith('/admin/knowledge')) {
      return '/admin/knowledge'
    } else if (pathname.startsWith('/admin/chat')) {
      return '/admin/chat'
    } else if (pathname.startsWith('/admin/user')) {
      return '/admin/user'
    }
    // 如果没有匹配的路径，返回空字符串（不高亮任何菜单项）
    return ''
  }

  return (
    // 全局头部导航栏
    <Header style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      background: '#fff',
      borderBottom: '1px solid #f0f0f0',
      padding: '0 24px',
      height: '64px',
    }}>
      {/* 左侧：平台标题和导航菜单 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {/* 平台名称，使用渐变文字效果 */}
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
        {/* 水平导航菜单 */}
        <Menu
          mode="horizontal"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          style={{ border: 'none', minWidth: 0 }}
        />
      </div>
      
      {/* 右侧：用户信息或登录按钮 */}
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
          // 已登录用户显示用户信息和下拉菜单
          <Dropdown menu={userMenu} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} src={loginUser.userAvatar} />
              <span>{loginUser.userName}</span>
            </Space>
          </Dropdown>
        ) : (
          // 未登录用户显示登录注册按钮
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

