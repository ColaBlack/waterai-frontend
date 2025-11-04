import axios, { AxiosInstance, AxiosResponse } from 'axios'

export const BASE_URL = '/api'
export const SSE_BASE_URL = process.env.NEXT_PUBLIC_SSE_BASE_URL || '/api/sse'

const request: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  withCredentials: true,
})

// 请求拦截器
request.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  function (response: AxiosResponse) {
    const { data } = response
    
    // 未登录
    if (data.code === 40100) {
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
    return Promise.reject(error)
  }
)

export default request

