import request from '@/plugins/axios/service'

export const getIP = (data?: any) => request.get('/ip', data)
export function getColors() {
  return request.request('GET', '/data/colors.json', {
    baseURL: '/',
  })
}
export function getPinyin() {
  return request.request('GET', '/data/pinyin.json', {
    baseURL: '/',
  })
}
