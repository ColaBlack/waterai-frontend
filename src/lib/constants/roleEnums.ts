/**
 * 用户角色枚举
 */
export const ROLE_ENUM = {
  PUBLIC: 'public',
  USER: 'user',
  ADMIN: 'admin',
  BAN: 'ban',
} as const

export const USER_ROLE = {
  [ROLE_ENUM.PUBLIC]: '未登录',
  [ROLE_ENUM.USER]: '普通用户',
  [ROLE_ENUM.ADMIN]: '管理员',
  [ROLE_ENUM.BAN]: '封禁用户',
}

export type RoleType = (typeof ROLE_ENUM)[keyof typeof ROLE_ENUM]

export default ROLE_ENUM

