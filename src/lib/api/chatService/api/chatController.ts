// @ts-ignore
/* eslint-disable */
import request from "@/lib/utils/request";

/** AI文本对话 支持3种文本模型：GLM-Z1-Flash(推理)、GLM-4.5-Flash(标准)、GLM-4-Flash(普通)。可选功能：RAG增强、工具调用(数据库查询)、联网搜索。采用SSE流式返回结果。 POST /ai/chat */
export async function chat(
  body: API.AIQuestionRequest,
  options?: { [key: string]: any }
) {
  return request<API.SseEmitter>("/ai/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** AI视觉对话 支持图像理解和分析。提供2种视觉模型：GLM-4V-Flash(快速识别)、GLM-4.1V-Thinking-Flash(深度思考)。支持1-10张图片，可使用URL或Base64格式。采用SSE流式返回结果。注意：视觉模型不支持RAG、工具调用和联网搜索功能。 POST /ai/chat/vision */
export async function visionChat(
  body: API.AIVisionQuestionRequest,
  options?: { [key: string]: any }
) {
  return request<API.SseEmitter>("/ai/chat/vision", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
