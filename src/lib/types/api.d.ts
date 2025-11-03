declare namespace API {
  type AIQuestionRequest = {
    /** 用户提问内容 */
    userPrompt: string
    /** 会话ID，用于多轮对话 */
    chatId: string
    /** 文本模型名称 */
    modelName?: 'glm-z1-flash' | 'glm-4.5-flash' | 'glm-4-flash'
    /** 是否启用联网搜索 */
    useWebSearch?: boolean
    /** 是否使用监测数据 */
    useToolCalling?: boolean
    /** 是否启用RAG功能（向量数据库检索增强） */
    useRAG?: boolean
  }

  type AIVisionQuestionRequest = {
    /** 用户提问内容 */
    userPrompt: string
    /** 会话ID，用于多轮对话 */
    chatId: string
    /** 图像URL列表，支持1-10张图片。可以是HTTP/HTTPS URL或Base64编码（data:image/jpeg;base64,...） */
    imageUrls: string[]
    /** 视觉模型类型 */
    visionModelType?: 'vision' | 'vision_reasoning'
  }

  type BaseResponseBoolean = {
    code?: number
    data?: boolean
    message?: string
  }

  type BaseResponseChatRoomVO = {
    code?: number
    data?: ChatRoomVO
    message?: string
  }

  type BaseResponseListChatMemoryVO = {
    code?: number
    data?: ChatMemoryVO[]
    message?: string
  }

  type BaseResponseListChatRoomVO = {
    code?: number
    data?: ChatRoomVO[]
    message?: string
  }

  type BaseResponseLoginUserVO = {
    code?: number
    data?: LoginUserVO
    message?: string
  }

  type BaseResponseLong = {
    code?: number
    data?: number
    message?: string
  }

  type BaseResponsePageUser = {
    code?: number
    data?: PageUser
    message?: string
  }

  type BaseResponseString = {
    code?: number
    data?: string
    message?: string
  }

  type ChatMemoryVO = {
    id?: number
    content?: string
    type?: string
    timestamp?: string
  }

  type ChatRoomAddRequest = {
    /** 用户初始提问内容，将作为聊天室标题的前10个字符 */
    userPrompt: string
    /** 用户ID（可选，不传则使用当前登录用户） */
    userId?: number
  }

  type ChatRoomVO = {
    /** 聊天室ID */
    chatroom?: string
    /** 聊天室标题 */
    title?: string
    /** 聊天室创建时间 */
    createTime?: string
  }

  type DeleteRequest = {
    /** 要删除的记录ID */
    id: number
  }

  type getChatRoomMessagesParams = {
    /** 聊天室ID */
    chatroomId: string
  }

  type getChatRoomParams = {
    /** 聊天室ID */
    chatroomId: string
  }

  type LoginUserVO = {
    /** 用户ID */
    id?: number
    /** 用户昵称 */
    userName?: string
    /** 用户头像URL */
    userAvatar?: string
    /** 用户简介 */
    userProfile?: string
    /** 用户角色 */
    userRole?: 'user' | 'admin' | 'ban'
    /** 账号创建时间 */
    createTime?: string
    /** 账号更新时间 */
    updateTime?: string
  }

  type OrderItem = {
    column?: string
    asc?: boolean
  }

  type PageUser = {
    records?: User[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageUser
    searchCount?: PageUser
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type SseEmitter = {
    timeout?: number
  }

  type User = {
    id?: number
    userAccount?: string
    userPassword?: string
    userName?: string
    userAvatar?: string
    userProfile?: string
    userRole?: string
    createTime?: string
    updateTime?: string
    isDelete?: number
  }

  type UserAddRequest = {
    /** 用户昵称 */
    userName?: string
    /** 用户账号 */
    userAccount: string
    /** 用户头像URL */
    userAvatar?: string
    /** 用户角色 */
    userRole?: 'user' | 'admin'
  }

  type UserLoginRequest = {
    /** 用户账号 */
    userAccount: string
    /** 用户密码 */
    userPassword: string
  }

  type UserQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    /** 用户ID */
    id?: number
    /** 用户昵称（模糊匹配） */
    userName?: string
    /** 用户账号（模糊匹配） */
    userAccount?: string
    /** 用户简介（模糊匹配） */
    userProfile?: string
    /** 用户角色 */
    userRole?: 'user' | 'admin' | 'ban'
  }

  type UserRegisterRequest = {
    /** 用户账号 */
    userAccount: string
    /** 用户密码 */
    userPassword: string
    /** 确认密码 */
    checkPassword: string
  }

  type UserUpdateMyRequest = {
    userName?: string
    userAvatar?: string
    userProfile?: string
  }

  type UserUpdatePasswordRequest = {
    /** 旧密码 */
    oldPassword?: string
    /** 新密码 */
    newPassword?: string
  }

  type UserUpdateRequest = {
    /** 用户ID */
    id: number
    /** 用户昵称 */
    userName?: string
    /** 用户头像URL */
    userAvatar?: string
    /** 用户简介 */
    userProfile?: string
    /** 用户角色 */
    userRole?: 'user' | 'admin' | 'ban'
  }
}

