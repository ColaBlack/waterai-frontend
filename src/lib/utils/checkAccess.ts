import ROLE_ENUM, { type RoleType } from '@/lib/constants/roleEnums'

/**
 * 检查用户是否有权限访问
 * @param loginUser 当前登录用户
 * @param needAccess 需要的权限
 */
export function checkAccess(
  loginUser: API.LoginUserVO | null,
  needAccess: RoleType = ROLE_ENUM.PUBLIC
): boolean {
  // 获取当前用户权限
  const loginUserRole = (loginUser?.userRole || ROLE_ENUM.PUBLIC) as RoleType

  // 如果不需要权限，则通过
  if (needAccess === ROLE_ENUM.PUBLIC) {
    return true
  }

  // 如果需要用户权限
  if (needAccess === ROLE_ENUM.USER) {
    // 如果未登录，则拒绝
    if (loginUserRole === ROLE_ENUM.PUBLIC) {
      return false
    }
    // 如果被封禁，则拒绝
    if (loginUserRole === ROLE_ENUM.BAN) {
      return false
    }
    return true
  }

  // 如果需要管理员权限
  if (needAccess === ROLE_ENUM.ADMIN) {
    // 只有管理员才能访问
    return loginUserRole === ROLE_ENUM.ADMIN
  }

  return true
}

