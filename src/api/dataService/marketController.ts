// @ts-ignore
/* eslint-disable */
import request from "@/lib/utils/request";

/** 根据ID查询市场 根据市场ID查询详细信息 GET /market/${param0} */
export async function getMarketById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMarketByIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseMarketVO>(`/market/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 分页查询市场列表 根据条件分页查询水产品批发市场列表 POST /market/list/page */
export async function listMarketByPage(
  body: API.MarketRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageMarketVO>("/market/list/page", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
