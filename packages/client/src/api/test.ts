import request from '@/plugins/axios/service'

export const getIP = (data?: any) => request.get('/ip', data)
export function getColors() {
  return request.request('GET', '/data/one/colors.json', {
    baseURL: '/',
  })
}
export function getPinyin() {
  return request.request('GET', '/data/one/pinyin.json', {
    baseURL: '/',
  })
}
export function getColor() {
  return request.request('GET', '/data/json/color.json', {
    baseURL: '/',
  })
}
