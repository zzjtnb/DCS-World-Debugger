import { io } from 'socket.io-client'

const luaStore = useLuaStore()

const socket = io('ws://localhost:4000', {
  autoConnect: false,
  withCredentials: false,
})

socket.on('connect_error', (_err) => {
  console.log(`connect_error due to ${_err.message}`)
  socket.close()
})

socket.on('disconnect', (reason) => {
  console.log(`disconnect due to ${reason}`)
})
// 发送消息
export function sendMessage(type: lua.runType) {
  if (!luaStore.code.trim()) {
    luaStore.received = {
      type: 'message',
      status: false,
      data: '代码不能为空',
    }
    return
  }
  const request: lua.request = {
    type: 'debug',
    payload: {
      type: type || 'loadstring',
      content: luaStore.code.trim().replace(/--.*|\n/g, ' '),
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
}
socket.on('debug', (data) => {
  luaStore.loading = false
  luaStore.received = data
})
