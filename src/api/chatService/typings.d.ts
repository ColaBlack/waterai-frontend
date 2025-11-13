declare namespace API {
  type AIQuestionRequest = {
    /** 用户提问内容 */
    userPrompt: string;
    /** 会话ID，用于多轮对话 */
    chatId: string;
    /** 聊天室ID，用于标识聊天室 */
    chatRoomId?: string;
    /** 文本模型名称 */
    modelName?: "glm-z1-flash" | "glm-4.5-flash" | "glm-4-flash";
    /** 是否启用联网搜索 */
    useWebSearch?: boolean;
    /** 是否使用监测数据 */
    useToolCalling?: boolean;
    /** 是否启用RAG功能（向量数据库检索增强） */
    useRAG?: boolean;
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

  type ChatMemoryVO = {
    id?: number;
    content?: string;
    type?: string;
    timestamp?: string;
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

  type getChatRoomMessagesParams = {
    /** 聊天室ID */
    chatroomId: string;
    /** 用户ID */
    userId: number;
  };

  type getChatRoomParams = {
    /** 聊天室ID */
    chatroomId: string;
    /** 用户ID */
    userId: number;
  };

  type listChatRoomsParams = {
    /** 用户ID */
    userId: number;
  };

  type SseEmitter = {
    timeout?: number;
  };
}
