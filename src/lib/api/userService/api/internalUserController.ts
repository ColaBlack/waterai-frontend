// @ts-ignore
/* eslint-disable */
import request from "@/lib/utils/request";

/** 根据请求头X-User-Id返回用户信息 用于微服务间校验用户是否存在及获取基本信息 GET /internal/user/validate */
export async function validate(options?: { [key: string]: any }) {
  return request<API.BaseResponseLoginUserVO>("/internal/user/validate", {
    method: "GET",
    ...(options || {}),
  });
}
