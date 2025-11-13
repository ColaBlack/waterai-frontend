/**
 * HTTP 请求工具
 * 基于 axios 封装，提供统一的请求配置和拦截器
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios'

/** API 基础路径 */
export const BASE_URL = '/api'

/** SSE 基础路径，直接使用 API 基础路径（通过 rewrite 代理到后端） */
export const SSE_BASE_URL = process.env.NEXT_PUBLIC_SSE_BASE_URL || BASE_URL

/** 未登录状态码 */
const UNAUTHORIZED_CODE = 40100

/** 请求超时时间（毫秒） */
const REQUEST_TIMEOUT = 60000

/**
 * 创建 axios 实例
 */
const request: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT,
  withCredentials: true, // 允许携带 Cookie
})

/**
 * 请求拦截器
 * 在发送请求前对配置进行处理
 */
request.interceptors.request.use(
  function (config) {
    // 可以在这里添加 token、修改请求头等
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 * 统一处理响应结果，包括错误处理和登录状态检查
 */
request.interceptors.response.use(
  function (response: AxiosResponse) {
    const { data } = response
    
    // 检查是否未登录
    if (data.code === UNAUTHORIZED_CODE) {
      // 不是获取用户信息接口，并且不是登录页面，则跳转到登录页面并保存当前页面的路径
      if (
        !response.request.responseURL.includes('user/get/login') &&
        !window.location.pathname.includes('/user/login')
      ) {
        window.location.href = `/user/login?redirect=${encodeURIComponent(window.location.href)}`
      }
    }
    return response
  },
  function (error) {
    // 可以在这里统一处理错误，如显示错误提示
    return Promise.reject(error)
  }
)

export default request

