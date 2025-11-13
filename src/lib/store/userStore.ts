import { create } from 'zustand'
import { getLoginUser } from '@/api/userService/userController'
import ROLE_ENUM from '@/lib/constants/roleEnums'

interface UserState {
  loginUser: API.LoginUserVO
  setLoginUser: (user: API.LoginUserVO) => void
  fetchLoginUser: () => Promise<void>
  clearLoginUser: () => void
  logout: () => void
  isLoggedIn: () => boolean
}

export const useUserStore = create<UserState>((set, get) => ({
  loginUser: { userName: '未登录', userRole: undefined },
  
  setLoginUser: (user: API.LoginUserVO) => {
    set({ loginUser: user })
  },
  
  fetchLoginUser: async () => {
    // 检查是否在客户端环境（避免SSR错误）
    if (typeof window === 'undefined') {
      set({ loginUser: { userName: '未登录', userRole: undefined } })
      return
    }
    
    // 首先检查本地是否有token
    const token = localStorage.getItem('token')
    if (!token) {
      set({ loginUser: { userName: '未登录', userRole: undefined } })
      return
    }
    
    try {
      const res = await getLoginUser()
      if (res.data.code === 200 && res.data.data) {
        set({ loginUser: res.data.data })
      } else {
        // 如果获取用户信息失败，清除本地token
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
          localStorage.removeItem('userId')
          localStorage.removeItem('userName')
        }
        set({ loginUser: { userName: '未登录', userRole: undefined } })
      }
    } catch (error) {
      // 如果请求失败（比如token过期），清除本地token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('userName')
      }
      set({ loginUser: { userName: '未登录', userRole: undefined } })
    }
  },
  
  clearLoginUser: () => {
    set({ loginUser: { userName: '未登录', userRole: undefined } })
  },
  
  logout: () => {
    // 检查是否在客户端环境（避免SSR错误）
    if (typeof window !== 'undefined') {
      // 清除本地存储的token和用户信息
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('userName')
    }
    
    // 清除状态
    set({ loginUser: { userName: '未登录', userRole: undefined } })
  },
  
  isLoggedIn: () => {
    // 检查是否在客户端环境（避免SSR错误）
    if (typeof window === 'undefined') {
      return false
    }
    const token = localStorage.getItem('token')
    return !!token
  },
}))

