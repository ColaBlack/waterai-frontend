// @ts-ignore
/* eslint-disable */
import request from "@/lib/utils/request";

/** 根据ID查询实体 根据实体ID查询详细信息 GET /entity/${param0} */
export async function getEntityById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getEntityByIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseEntityListVO>(`/entity/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 分页查询实体列表 根据条件分页查询养殖主体列表 POST /entity/list/page */
export async function listEntityByPage(
  body: API.EntityListRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageEntityListVO>("/entity/list/page", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
