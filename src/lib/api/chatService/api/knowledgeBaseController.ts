// @ts-ignore
/* eslint-disable */
import request from "@/lib/utils/request";

/** 删除知识库文档 删除指定的知识库文档 DELETE /knowledge/${param0} */
export async function deleteDocument(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteDocumentParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseBoolean>(`/knowledge/${param0}`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取知识库文档列表 获取所有知识库文档列表，管理员可查看所有，普通用户只能查看自己上传的 GET /knowledge/list */
export async function listDocuments(options?: { [key: string]: any }) {
  return request<API.BaseResponseListKnowledgeBaseVO>("/knowledge/list", {
    method: "GET",
    ...(options || {}),
  });
}

/** 上传知识库文档 上传文档到RAG知识库，支持md、pdf、txt、doc、docx格式 POST /knowledge/upload */
export async function uploadDocument(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.uploadDocumentParams,
  body: {},
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong>("/knowledge/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      ...params,
    },
    data: body,
    ...(options || {}),
  });
}
