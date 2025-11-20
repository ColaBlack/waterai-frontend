// @ts-ignore
/* eslint-disable */
import request from "@/lib/utils/request";

/** 获取聊天室详情 根据聊天室ID获取聊天室的详细信息 GET /ai/chat-room/${param0} */
export async function getChatRoom1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getChatRoom1Params,
  options?: { [key: string]: any }
) {
  const { chatroomId: param0, ...queryParams } = params;
  return request<API.BaseResponseChatRoomVO>(`/ai/chat-room/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 删除聊天室 用户删除自己的聊天室 DELETE /ai/chat-room/${param0} */
export async function deleteChatRoom1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteChatRoom1Params,
  options?: { [key: string]: any }
) {
  const { chatroomId: param0, ...queryParams } = params;
  return request<API.BaseResponseBoolean>(`/ai/chat-room/${param0}`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取聊天室对话记录 根据聊天室ID获取该聊天室的所有对话记录 GET /ai/chat-room/${param0}/messages */
export async function getChatRoomMessages(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getChatRoomMessagesParams,
  options?: { [key: string]: any }
) {
  const { chatroomId: param0, ...queryParams } = params;
  return request<API.BaseResponseListChatMemoryVO>(
    `/ai/chat-room/${param0}/messages`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 删除聊天室（管理员） 管理员删除任意聊天室，不验证所有权 DELETE /ai/chat-room/admin/${param0} */
export async function adminDeleteChatRoom1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.adminDeleteChatRoom1Params,
  options?: { [key: string]: any }
) {
  const { chatroomId: param0, ...queryParams } = params;
  return request<API.BaseResponseBoolean>(`/ai/chat-room/admin/${param0}`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取所有聊天室（管理员） 管理员获取所有用户的聊天室列表 GET /ai/chat-room/admin/list */
export async function getAllChatRooms1(options?: { [key: string]: any }) {
  return request<API.BaseResponseListChatRoomVO>("/ai/chat-room/admin/list", {
    method: "GET",
    ...(options || {}),
  });
}

/** 创建聊天室 根据用户输入创建新的聊天室，返回聊天室ID和标题 POST /ai/chat-room/create */
export async function createChatRoom1(
  body: API.ChatRoomAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseChatRoomVO>("/ai/chat-room/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取聊天室列表 获取当前登录用户的所有聊天室列表 GET /ai/chat-room/list */
export async function listChatRooms1(options?: { [key: string]: any }) {
  return request<API.BaseResponseListChatRoomVO>("/ai/chat-room/list", {
    method: "GET",
    ...(options || {}),
  });
}
