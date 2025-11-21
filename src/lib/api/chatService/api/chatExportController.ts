// @ts-ignore
/* eslint-disable */
import request from "@/lib/utils/request";

/** 导出文本对话 将文本对话导出为指定格式（Markdown/HTML/TXT/JSON/PDF） GET /api/chat/export/text/${param0} */
export async function exportTextChat(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.exportTextChatParams,
  options?: { [key: string]: any }
) {
  const { chatId, ...queryParams } = params;
  return request<any>(`/api/chat/export/text/${chatId}`, {
    method: "GET",
    params: {
      ...queryParams,
    },
    responseType: 'blob',
    ...(options || {}),
  });
}

/** 导出视觉对话 将视觉对话导出为指定格式（Markdown/HTML/TXT/JSON/PDF） GET /api/chat/export/vision/${param0} */
export async function exportVisionChat(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.exportVisionChatParams,
  options?: { [key: string]: any }
) {
  const { chatId, ...queryParams } = params;
  return request<any>(`/api/chat/export/vision/${chatId}`, {
    method: "GET",
    params: {
      ...queryParams,
    },
    responseType: 'blob',
    ...(options || {}),
  });
}
