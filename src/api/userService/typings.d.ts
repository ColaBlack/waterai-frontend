declare namespace API {
  type BaseResponseBoolean = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseLoginUserVO = {
    code?: number;
    data?: LoginUserVO;
    message?: string;
  };

  type BaseResponseLong = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponsePageUser = {
    code?: number;
    data?: PageUser;
    message?: string;
  };

  type DeleteRequest = {
    /** 要删除的记录ID */
    id: number;
  };

  type LoginUserVO = {
    /** 用户ID */
    id?: number;
    /** 用户昵称 */
    userName?: string;
    /** 用户头像URL */
    userAvatar?: string;
    /** 用户简介 */
    userProfile?: string;
    /** 用户角色 */
    userRole?: "user" | "admin" | "ban";
    /** 用户账号 */
    userAccount?: string;
    /** JWT认证token */
    token?: string;
    /** 账号创建时间 */
    createTime?: string;
    /** 账号更新时间 */
    updateTime?: string;
  };

  type OrderItem = {
    column?: string;
    asc?: boolean;
  };

  type PageUser = {
    records?: User[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PageUser;
    searchCount?: PageUser;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type User = {
    id?: number;
    userAccount?: string;
    userPassword?: string;
    userName?: string;
    userAvatar?: string;
    userProfile?: string;
    userRole?: string;
    createTime?: string;
    updateTime?: string;
    isDelete?: number;
  };

  type UserAddRequest = {
    /** 用户昵称 */
    userName?: string;
    /** 用户账户 */
    userAccount: string;
    /** 用户头像URL */
    userAvatar?: string;
    /** 用户密码 */
    userPassword: string;
    /** 用户简介 */
    userProfile?: string;
    /** 用户角色 */
    userRole?: "user" | "admin";
  };

  type UserLoginRequest = {
    /** 用户账户 */
    userAccount: string;
    /** 用户密码 */
    userPassword: string;
  };

  type UserQueryRequest = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    /** 用户ID */
    id?: number;
    /** 用户昵称（模糊匹配） */
    userName?: string;
    /** 用户账户（模糊匹配） */
    userAccount?: string;
    /** 用户简介（模糊匹配） */
    userProfile?: string;
    /** 用户角色 */
    userRole?: "user" | "admin" | "ban";
  };

  type UserRegisterRequest = {
    /** 用户账户 */
    userAccount: string;
    /** 用户密码 */
    userPassword: string;
    /** 确认密码 */
    checkPassword: string;
  };

  type UserUpdateMyRequest = {
    userName?: string;
    userAvatar?: string;
    userProfile?: string;
  };

  type UserUpdatePasswordRequest = {
    /** 旧密码 */
    oldPassword?: string;
    /** 新密码 */
    newPassword?: string;
  };

  type UserUpdateRequest = {
    /** 用户ID */
    id: number;
    /** 用户昵称 */
    userName?: string;
    /** 用户头像URL */
    userAvatar?: string;
    /** 用户简介 */
    userProfile?: string;
    /** 用户角色 */
    userRole?: "user" | "admin" | "ban";
  };
}
