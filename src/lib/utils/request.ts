/**
 * HTTP 请求工具
 * 基于 axios 封装，提供统一的请求配置和拦截器
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios'

/** API 基础路径 */
export const BASE_URL = 'http://localhost:8115/api'

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
  // 不再需要 withCredentials，JWT通过Authorization header传递
})

/**
 * 请求拦截器
 * 在发送请求前添加JWT token到Authorization header
 */
request.interceptors.request.use(
  function (config) {
    // 检查是否在客户端环境（避免SSR错误）
    if (typeof window !== 'undefined') {
      // 从localStorage获取JWT token
      const token = localStorage.getItem('token')
      if (process.env.NODE_ENV === 'development') {
        console.log('[Axios] Token from localStorage:', token ? `${token.substring(0, 20)}...` : 'null')
        console.log('[Axios] Request URL:', config.url)
      }
      
      // 如果有token，添加到Authorization header
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
        if (process.env.NODE_ENV === 'development') {
          console.log('[Axios] Added Authorization header:', `Bearer ${token.substring(0, 20)}...`)
        }
      } else if (process.env.NODE_ENV === 'development') {
        console.warn('[Axios] No token found in localStorage')
      }
      
      // X-User-Id由网关从JWT token中提取并添加，前端不需要手动添加
    } else if (process.env.NODE_ENV === 'development') {
      console.warn('[Axios] Running in server environment, no token added')
    }
    
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 * 统一处理响应结果，包括JWT认证错误处理
 */
request.interceptors.response.use(
  function (response: AxiosResponse) {
    const { data } = response
    
    // 检查是否未登录（JWT认证失败）
    if (data.code === UNAUTHORIZED_CODE) {
      // 检查是否在客户端环境（避免SSR错误）
      if (typeof window !== 'undefined') {
        // 清除本地token
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('userName')
        
        // 不是获取用户信息接口，并且不是登录页面，则跳转到登录页面
        if (
          !response.request.responseURL.includes('user/get/login') &&
          !window.location.pathname.includes('/user/login')
        ) {
          window.location.href = `/user/login?redirect=${encodeURIComponent(window.location.href)}`
        }
      }
    }
    return response
  },
  function (error) {
    // 处理401 Unauthorized错误（JWT token无效或过期）
    if (error.response?.status === 401) {
      // 检查是否在客户端环境（避免SSR错误）
      if (typeof window !== 'undefined') {
        // 清除本地token
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('userName')
        
        // 跳转到登录页面
        if (!window.location.pathname.includes('/user/login')) {
          window.location.href = `/user/login?redirect=${encodeURIComponent(window.location.href)}`
        }
      }
    }
    
    return Promise.reject(error)
  }
)

export default request

