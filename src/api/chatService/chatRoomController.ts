// @ts-ignore
/* eslint-disable */
import request from "@/lib/utils/request";

/** 获取聊天室详情 根据聊天室ID获取聊天室的详细信息 GET /chat-room/${param0} */
export async function getChatRoom(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getChatRoomParams,
  options?: { [key: string]: any }
) {
  const { chatroomId: param0, ...queryParams } = params;
  return request<API.BaseResponseChatRoomVO>(`/chat-room/${param0}`, {
    method: "GET",
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** 获取聊天室对话记录 根据聊天室ID获取该聊天室的所有对话记录 GET /chat-room/${param0}/messages */
export async function getChatRoomMessages(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getChatRoomMessagesParams,
  options?: { [key: string]: any }
) {
  const { chatroomId: param0, ...queryParams } = params;
  return request<API.BaseResponseListChatMemoryVO>(
    `/chat-room/${param0}/messages`,
    {
      method: "GET",
      params: {
        ...queryParams,
      },
      ...(options || {}),
    }
  );
}

/** 创建聊天室 根据用户输入创建新的聊天室，返回聊天室ID和标题 POST /chat-room/create */
export async function createChatRoom(
  body: API.ChatRoomAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseChatRoomVO>("/chat-room/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取聊天室列表 获取当前登录用户的所有聊天室列表 GET /chat-room/list */
export async function listChatRooms(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listChatRoomsParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListChatRoomVO>("/chat-room/list", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
