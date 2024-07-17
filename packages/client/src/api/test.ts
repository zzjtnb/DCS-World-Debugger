import request from '@/plugins/axios/service'

export const testPost = (data?: any) => request.post('https://example.com', data)
