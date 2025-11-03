import request from '@/lib/utils/request'

/** AI文本对话 支持3种文本模型：GLM-Z1-Flash(推理)、GLM-4.5-Flash(标准)、GLM-4-Flash(普通)。可选功能：RAG增强、工具调用(数据库查询)、联网搜索。采用SSE流式返回结果。 POST /ai/chat */
export async function chat(body: API.AIQuestionRequest, options?: { [key: string]: any }) {
  return request<API.SseEmitter>('/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取聊天室详情 根据聊天室ID获取聊天室的详细信息 GET /ai/chatroom/${param0} */
export async function getChatRoom(
  params: API.getChatRoomParams,
  options?: { [key: string]: any }
) {
  const { chatroomId: param0, ...queryParams } = params
  return request<API.BaseResponseChatRoomVO>(`/ai/chatroom/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取聊天室对话记录 根据聊天室ID获取该聊天室的所有对话记录 GET /ai/chatroom/${param0}/messages */
export async function getChatRoomMessages(
  params: API.getChatRoomMessagesParams,
  options?: { [key: string]: any }
) {
  const { chatroomId: param0, ...queryParams } = params
  return request<API.BaseResponseListChatMemoryVO>(`/ai/chatroom/${param0}/messages`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 创建聊天室 根据用户输入创建新的聊天室，返回聊天室ID和标题 POST /ai/chatroom/create */
export async function createChatRoom(
  body: API.ChatRoomAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseChatRoomVO>('/ai/chatroom/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取聊天室列表 获取当前登录用户的所有聊天室列表 GET /ai/chatroom/list */
export async function listChatRooms(options?: { [key: string]: any }) {
  return request<API.BaseResponseListChatRoomVO>('/ai/chatroom/list', {
    method: 'GET',
    ...(options || {}),
  })
}

/** AI视觉对话 支持图像理解和分析。提供2种视觉模型：GLM-4V-Flash(快速识别)、GLM-4.1V-Thinking-Flash(深度思考)。支持1-10张图片，可使用URL或Base64格式。采用SSE流式返回结果。注意：视觉模型不支持RAG、工具调用和联网搜索功能。 POST /ai/vision-chat */
export async function visionChat(
  body: API.AIVisionQuestionRequest,
  options?: { [key: string]: any }
) {
  return request<API.SseEmitter>('/ai/vision-chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

