import { create } from 'zustand'
import { getLoginUser } from '@/lib/api/userController'
import ROLE_ENUM from '@/lib/constants/roleEnums'

interface UserState {
  loginUser: API.LoginUserVO
  setLoginUser: (user: API.LoginUserVO) => void
  fetchLoginUser: () => Promise<void>
  clearLoginUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  loginUser: { userName: '未登录', userRole: ROLE_ENUM.PUBLIC },
  
  setLoginUser: (user: API.LoginUserVO) => {
    set({ loginUser: user })
  },
  
  fetchLoginUser: async () => {
    try {
      const res = await getLoginUser()
      if (res.data.code === 200 && res.data.data) {
        set({ loginUser: res.data.data })
      } else {
        set({ loginUser: { userName: '未登录', userRole: ROLE_ENUM.PUBLIC } })
      }
    } catch (error) {
      set({ loginUser: { userName: '未登录', userRole: ROLE_ENUM.PUBLIC } })
    }
  },
  
  clearLoginUser: () => {
    set({ loginUser: { userName: '未登录', userRole: ROLE_ENUM.PUBLIC } })
  },
}))

