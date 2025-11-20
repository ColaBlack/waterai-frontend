declare namespace API {
  type adminDeleteChatRoom1Params = {
    /** 聊天室ID */
    chatroomId: string;
  };

  type adminDeleteChatRoomParams = {
    /** 聊天室ID */
    chatroomId: string;
  };

  type AIQuestionRequest = {
    /** 用户提问内容 */
    userPrompt: string;
    /** 会话ID，用于多轮对话 */
    chatId: string;
    /** 聊天室ID，用于标识聊天室 */
    chatRoomId?: string;
    /** 文本模型名称 */
    modelName?: "glm-z1-flash" | "glm-4.5-flash" | "glm-4-flash";
  };

  type AIVisionQuestionRequest = {
    /** 用户提问内容 */
    userPrompt: string;
    /** 会话ID，用于多轮对话 */
    chatId: string;
    /** 图像URL列表，支持1-10张图片。可以是HTTP/HTTPS URL或Base64编码（data:image/jpeg;base64,...） */
    imageUrls: string[];
    /** 视觉模型类型 */
    visionModelType?: "vision" | "vision_reasoning";
  };

  type BaseResponseBoolean = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseChatRoomVO = {
    code?: number;
    data?: ChatRoomVO;
    message?: string;
  };

  type BaseResponseListChatMemoryVO = {
    code?: number;
    data?: ChatMemoryVO[];
    message?: string;
  };

  type BaseResponseListChatRoomVO = {
    code?: number;
    data?: ChatRoomVO[];
    message?: string;
  };

  type BaseResponseListKnowledgeBaseVO = {
    code?: number;
    data?: KnowledgeBaseVO[];
    message?: string;
  };

  type BaseResponseListVisionChatRecordVO = {
    code?: number;
    data?: VisionChatRecordVO[];
    message?: string;
  };

  type BaseResponseListVisionChatRoomVO = {
    code?: number;
    data?: VisionChatRoomVO[];
    message?: string;
  };

  type BaseResponseLong = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponsePageVisionChatRecordVO = {
    code?: number;
    data?: PageVisionChatRecordVO;
    message?: string;
  };

  type BaseResponseStatisticsVO = {
    code?: number;
    data?: StatisticsVO;
    message?: string;
  };

  type BaseResponseVisionChatRoomVO = {
    code?: number;
    data?: VisionChatRoomVO;
    message?: string;
  };

  type ChatMemoryVO = {
    id?: number;
    content?: string;
    type?: string;
    messageType?: string;
    timestamp?: string;
    createTime?: string;
  };

  type ChatRoomAddRequest = {
    /** 用户初始提问内容，将作为聊天室标题的前10个字符 */
    userPrompt: string;
    /** 用户ID（可选，不传则使用当前登录用户） */
    userId?: number;
  };

  type ChatRoomVO = {
    /** 聊天室ID */
    chatroom?: string;
    /** 聊天室标题 */
    title?: string;
    /** 聊天室创建时间 */
    createTime?: string;
  };

  type createChatRoomParams = {
    /** 聊天室标题 */
    title?: string;
  };

  type deleteChatRecordsParams = {
    /** 聊天ID */
    chatId: string;
    /** 用户ID */
    userId?: number;
  };

  type deleteChatRoom1Params = {
    /** 聊天室ID */
    chatroomId: string;
  };

  type deleteChatRoomParams = {
    /** 聊天室ID */
    chatroomId: string;
  };

  type deleteDocumentParams = {
    /** 文档ID */
    id: number;
  };

  type getChatRecordsParams = {
    /** 聊天ID */
    chatId: string;
  };

  type getChatRoom1Params = {
    /** 聊天室ID */
    chatroomId: string;
  };

  type getChatRoomMessagesParams = {
    /** 聊天室ID */
    chatroomId: string;
  };

  type getChatRoomParams = {
    /** 聊天室ID */
    chatroomId: string;
  };

  type getUserChatRecordsParams = {
    /** 用户ID */
    userId: number;
    /** 当前页 */
    current?: number;
    /** 页大小 */
    pageSize?: number;
  };

  type KnowledgeBaseVO = {
    /** 知识库文档ID */
    id?: number;
    /** 文件名 */
    fileName?: string;
    /** 文件大小（字节） */
    fileSize?: number;
    /** 文件类型 */
    fileType?: string;
    /** 上传用户ID */
    uploadUserId?: number;
    /** 状态：0-待处理，1-已处理，2-处理失败 */
    status?: number;
    /** 向量化后的文档片段数量 */
    vectorCount?: number;
    /** 文档描述 */
    description?: string;
    /** 创建时间 */
    createTime?: string;
    /** 更新时间 */
    updateTime?: string;
  };

  type OrderItem = {
    column?: string;
    asc?: boolean;
  };

  type PageVisionChatRecordVO = {
    records?: VisionChatRecordVO[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PageVisionChatRecordVO;
    searchCount?: PageVisionChatRecordVO;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type SseEmitter = {
    timeout?: number;
  };

  type StatisticsVO = {
    /** 总用户数 */
    totalUsers?: number;
    /** 今日新增用户数 */
    todayNewUsers?: number;
    /** 总对话数 */
    totalChats?: number;
    /** 今日对话数 */
    todayChats?: number;
    /** 总知识库文档数 */
    totalKnowledgeDocs?: number;
    /** 已处理文档数 */
    processedDocs?: number;
    /** 待处理文档数 */
    pendingDocs?: number;
    /** 总向量数 */
    totalVectors?: number;
    /** 文本对话室数量 */
    textChatRooms?: number;
    /** 视觉对话室数量 */
    visionChatRooms?: number;
  };

  type updateChatRoomTitleParams = {
    /** 聊天室ID */
    chatroomId: string;
    /** 新标题 */
    title: string;
  };

  type uploadDocumentParams = {
    /** 文档描述 */
    description?: string;
  };

  type VisionChatRecordVO = {
    id?: number;
    chatId?: string;
    userId?: number;
    messageType?: string;
    content?: string;
    imageUrls?: string[];
    modelName?: string;
    visionReasoningModel?: boolean;
    createTime?: string;
  };

  type VisionChatRoomVO = {
    userId?: number;
    chatroom?: string;
    title?: string;
    createTime?: string;
    updateTime?: string;
  };
}
