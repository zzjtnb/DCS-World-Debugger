import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
// import qs from 'qs'

import { AxiosCancel } from './cancel'
import { useEnv } from '@/hooks/useEnv'

const axiosCancel = new AxiosCancel()

const { VITE_BASE_URL } = useEnv()

const service: AxiosInstance = axios.create({
  baseURL: VITE_BASE_URL || '/',
  timeout: 1000 * 20,
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    axiosCancel.addPending(config)
    // config.data = qs.stringify(config.data)
    return config
  },
  (error) => {
    error.data = {}
    return Promise.resolve(error)
  },
)
// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    axiosCancel.removePending(response.config)
    return Promise.resolve(response.data)
  },
  (error) => {
    axiosCancel.removePending(error.config)
    return Promise.reject(error)
  },
)

const request = {
  get<T = any>(url: string, data?: any): Promise<T> {
    return request.request('GET', url, { params: data })
  },
  post<T = any>(url: string, data?: any): Promise<T> {
    return request.request('POST', url, { data })
  },
  put<T = any>(url: string, data?: any): Promise<T> {
    return request.request('PUT', url, { data })
  },
  delete<T = any>(url: string, data?: any): Promise<T> {
    return request.request('DELETE', url, { params: data })
  },
  request<T = any>(method = 'GET', url: string, data?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      service({ method, url, ...data })
        .then((res) => {
          resolve(res as unknown as Promise<T>)
        })
        .catch((e: Error | AxiosError) => {
          reject(e)
        })
    })
  },
}

export default request
