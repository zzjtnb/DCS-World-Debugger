import request from '@/plugins/axios/service'

export const getPNG = (data?: any) => request.get('/image/png', data)
