import { io } from 'socket.io-client'

const luaStore = useLuaStore()

const socket = io('ws://localhost:4000', {
  // autoConnect: false,
  transports: ['websocket'],
})
socket.on('debug', (data) => {
  luaStore.loading = false
  luaStore.received = data
})
socket.on('connect_error', (_err) => {
  console.log(`connect_error due to ${_err.message}`)
  luaStore.loading = false
  luaStore.received = {
    type: 'message',
    status: false,
    data: '连接 NodeJs 服务器失败,请检查 NodeJs 服务器是否启动',
  }
  socket.close()
})
socket.on('disconnect', (reason) => {
  console.log(`socket 断开连接: ${reason}`)
})
// 发送消息
export function sendMessage(type: lua.runType): Promise<lua.received> {
  return new Promise((resolve, reject) => {
    if (!luaStore.codemirror.code.trim()) {
      luaStore.received = {
        type: 'message',
        status: false,
        data: '代码不能为空',
      }
      return reject(luaStore.received)
    }
    const request: lua.request = {
      type: 'debug',
      payload: {
        type: type || 'loadstring',
        content: luaStore.codemirror.code.trim().replace(/--.*|\n/g, ' '),
      },
    }
    if (type === 'dostring_in') {
      request.payload.state = luaStore.state
    }
    luaStore.loading = true
    luaStore.resetReceived()

    if (!socket.connected)
      socket.open()
    socket.emit('debug', request)
    socket.on('debug', () => {
      resolve(luaStore.received)
    })
    socket.on('connect_error', () => {
      reject(luaStore.received)
    })
  })
}
