// @ts-ignore
/* eslint-disable */
import request from "@/lib/utils/request";

/** 获取系统统计信息 仅管理员可访问 GET /statistics */
export async function getStatistics(options?: { [key: string]: any }) {
  return request<API.BaseResponseStatisticsVO>("/statistics", {
    method: "GET",
    ...(options || {}),
  });
}
