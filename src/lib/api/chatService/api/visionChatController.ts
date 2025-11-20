// @ts-ignore
/* eslint-disable */
import request from "@/lib/utils/request";

/** 视觉模型问答 支持图片输入的AI对话 POST /vision-chat/ask */
export async function askVisionQuestion(
  body: API.AIVisionQuestionRequest,
  options?: { [key: string]: any }
) {
  return request<API.SseEmitter>("/vision-chat/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取聊天记录 根据聊天ID获取视觉聊天记录 GET /vision-chat/records/${param0} */
export async function getChatRecords(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getChatRecordsParams,
  options?: { [key: string]: any }
) {
  const { chatId: param0, ...queryParams } = params;
  return request<API.BaseResponseListVisionChatRecordVO>(
    `/vision-chat/records/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 删除聊天记录 删除指定聊天ID的记录 DELETE /vision-chat/records/${param0} */
export async function deleteChatRecords(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteChatRecordsParams,
  options?: { [key: string]: any }
) {
  const { chatId: param0, ...queryParams } = params;
  return request<API.BaseResponseBoolean>(`/vision-chat/records/${param0}`, {
    method: "DELETE",
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** 获取用户聊天记录 分页获取用户的视觉聊天记录 GET /vision-chat/records/user/${param0} */
export async function getUserChatRecords(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserChatRecordsParams,
  options?: { [key: string]: any }
) {
  const { userId: param0, ...queryParams } = params;
  return request<API.BaseResponsePageVisionChatRecordVO>(
    `/vision-chat/records/user/${param0}`,
    {
      method: "GET",
      params: {
        // current has a default value: 1
        current: "1",
        // pageSize has a default value: 10
        pageSize: "10",
        ...queryParams,
      },
      ...(options || {}),
    }
  );
}
