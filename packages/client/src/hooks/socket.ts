import { io } from 'socket.io-client'
import { received } from './lua'
const socket = io('ws://localhost:4000', {
  autoConnect: false,
  withCredentials: false,
})

socket.on('connect', () => {
  // console.log(`connect ${socket.id}`)
})

socket.on('connect_error', (_err) => {
  // console.log(`connect_error due to ${_err.message}`)
  socket.close()
})

socket.on('disconnect', (reason) => {
  // console.log(`disconnect due to ${reason}`)
})

socket.on('debugResult', (data) => {
  console.log(data)
  received.value = data
})

// 发送消息
export function sendMessage(event, data) {
  if (!socket.connected) {
    // 开始连接socket
    socket.open()
  }
  socket.emit(event, data)
}
