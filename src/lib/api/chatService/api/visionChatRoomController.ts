// @ts-ignore
/* eslint-disable */
import request from "@/lib/utils/request";

/** 获取聊天室信息 根据聊天室ID获取聊天室信息 GET /ai/vision-chat-room/${param0} */
export async function getChatRoom(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getChatRoomParams,
  options?: { [key: string]: any }
) {
  const { chatroomId: param0, ...queryParams } = params;
  return request<API.BaseResponseVisionChatRoomVO>(
    `/ai/vision-chat-room/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 删除视觉聊天室 用户删除自己的视觉聊天室 DELETE /ai/vision-chat-room/${param0} */
export async function deleteChatRoom(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteChatRoomParams,
  options?: { [key: string]: any }
) {
  const { chatroomId: param0, ...queryParams } = params;
  return request<API.BaseResponseBoolean>(`/ai/vision-chat-room/${param0}`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 删除视觉聊天室（管理员） 管理员删除任意视觉聊天室，不验证所有权 DELETE /ai/vision-chat-room/admin/${param0} */
export async function adminDeleteChatRoom(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.adminDeleteChatRoomParams,
  options?: { [key: string]: any }
) {
  const { chatroomId: param0, ...queryParams } = params;
  return request<API.BaseResponseBoolean>(
    `/ai/vision-chat-room/admin/${param0}`,
    {
      method: "DELETE",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 获取所有视觉聊天室（管理员） 管理员获取所有用户的视觉聊天室列表 GET /ai/vision-chat-room/admin/list */
export async function getAllChatRooms(options?: { [key: string]: any }) {
  return request<API.BaseResponseListVisionChatRoomVO>(
    "/ai/vision-chat-room/admin/list",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** 创建视觉聊天室 创建新的视觉聊天室 POST /ai/vision-chat-room/create */
export async function createChatRoom(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.createChatRoomParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseVisionChatRoomVO>(
    "/ai/vision-chat-room/create",
    {
      method: "POST",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 获取用户的视觉聊天室列表 获取当前用户的所有视觉聊天室 GET /ai/vision-chat-room/list */
export async function listChatRooms(options?: { [key: string]: any }) {
  return request<API.BaseResponseListVisionChatRoomVO>(
    "/ai/vision-chat-room/list",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** 更新聊天室标题 更新指定聊天室的标题 POST /ai/vision-chat-room/update-title */
export async function updateChatRoomTitle(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateChatRoomTitleParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/ai/vision-chat-room/update-title", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
