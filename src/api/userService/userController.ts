// @ts-ignore
/* eslint-disable */
import request from "@/lib/utils/request";

/** 创建用户（管理员） 管理员创建新用户账号，默认密码为ColaBlack123456 POST /user/add */
export async function addUser(
  body: API.UserAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong>("/user/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除用户（管理员） 根据用户ID删除指定用户 POST /user/delete */
export async function deleteUser(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/user/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取当前登录用户 获取当前已登录用户的详细信息 GET /user/get/login */
export async function getLoginUser(options?: { [key: string]: any }) {
  return request<API.BaseResponseLoginUserVO>("/user/get/login", {
    method: "GET",
    ...(options || {}),
  });
}

/** 分页查询用户列表（管理员） 管理员分页查询用户列表，支持条件筛选 POST /user/list/page */
export async function listUserByPage(
  body: API.UserQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageUser>("/user/list/page", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 用户登录 验证用户账号密码，登录成功后返回用户信息并设置登录状态 POST /user/login */
export async function userLogin(
  body: API.UserLoginRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLoginUserVO>("/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 用户注销 清除当前用户的登录状态，退出登录 POST /user/logout */
export async function userLogout(options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>("/user/logout", {
    method: "POST",
    ...(options || {}),
  });
}

/** 用户注册 处理用户注册请求，验证账号密码格式并创建新用户账号 POST /user/register */
export async function userRegister(
  body: API.UserRegisterRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong>("/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新用户（管理员） 管理员更新指定用户的信息 POST /user/update */
export async function updateUser(
  body: API.UserUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/user/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 修改密码 允许当前登录用户修改自己的密码，需要验证旧密码 POST /user/update/password */
export async function updateMyPassword(
  body: API.UserUpdatePasswordRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/user/update/password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新用户个人资料 允许当前登录用户更新自己的个人信息（昵称、头像、简介） POST /user/update/profile */
export async function updateMyProfile(
  body: API.UserUpdateMyRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/user/update/profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
