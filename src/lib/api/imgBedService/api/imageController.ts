// @ts-ignore
/* eslint-disable */
import request from "@/lib/utils/request";

/** 删除文件 根据文件URL删除文件 DELETE /image/delete */
export async function deleteFile(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteFileParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/image/delete", {
    method: "DELETE",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 通用文件上传 上传文件到指定文件夹 POST /image/upload */
export async function uploadFile(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.uploadFileParams,
  body: {},
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString>("/image/upload", {
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

/** 上传用户头像 上传用户头像，支持JPG、PNG、GIF、WEBP格式 POST /image/upload/avatar */
export async function uploadAvatar(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.uploadAvatarParams,
  body: {},
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString>("/image/upload/avatar", {
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

/** 上传聊天图片 上传聊天图片，支持JPG、PNG、GIF、WEBP格式 POST /image/upload/chat-image */
export async function uploadChatImage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.uploadChatImageParams,
  body: {},
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString>("/image/upload/chat-image", {
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
