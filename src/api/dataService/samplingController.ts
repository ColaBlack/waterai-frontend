// @ts-ignore
/* eslint-disable */
import request from "@/lib/utils/request";

/** 根据ID查询2022年采样记录 根据ID查询2022年度食品抽样检测记录详情 GET /sampling/2022/${param0} */
export async function get2022ById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.get2022ByIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseFoodSamplingRecords2022VO>(
    `/sampling/2022/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 分页查询2022年采样记录 根据条件分页查询2022年度食品抽样检测记录 POST /sampling/2022/list/page */
export async function list2022ByPage(
  body: API.FoodSamplingRecords2022Request,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageFoodSamplingRecords2022VO>(
    "/sampling/2022/list/page",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** 根据ID查询2023年采样记录 根据ID查询2023年度食品抽样检测记录详情 GET /sampling/2023/${param0} */
export async function get2023ById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.get2023ByIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseFoodSamplingRecords2023VO>(
    `/sampling/2023/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 分页查询2023年采样记录 根据条件分页查询2023年度食品抽样检测记录 POST /sampling/2023/list/page */
export async function list2023ByPage(
  body: API.FoodSamplingRecords2023Request,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageFoodSamplingRecords2023VO>(
    "/sampling/2023/list/page",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** 根据ID查询2024年采样记录 根据ID查询2024年度食品抽样检测记录详情 GET /sampling/2024/${param0} */
export async function get2024ById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.get2024ByIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseFoodSamplingRecords2024VO>(
    `/sampling/2024/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 分页查询2024年采样记录 根据条件分页查询2024年度食品抽样检测记录 POST /sampling/2024/list/page */
export async function list2024ByPage(
  body: API.FoodSamplingRecords2024Request,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageFoodSamplingRecords2024VO>(
    "/sampling/2024/list/page",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}
