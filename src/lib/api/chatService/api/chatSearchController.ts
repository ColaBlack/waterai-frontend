// @ts-ignore
/* eslint-disable */
import request from "@/lib/utils/request";

/** 搜索对话 根据关键词、类型、时间范围搜索用户的对话记录 POST /api/chat/search */
export async function searchChats(
  body: API.ChatSearchRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageChatSearchResult>("/api/chat/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 搜索对话中的消息 在指定对话中搜索包含关键词的消息 GET /api/chat/search/${param0}/messages */
export async function searchMessagesInChat(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.searchMessagesInChatParams,
  options?: { [key: string]: any }
) {
  const { chatId, ...queryParams } = params;
  return request<API.BaseResponseListString>(`/api/chat/search/${chatId}/messages`, {
    method: "GET",
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}
