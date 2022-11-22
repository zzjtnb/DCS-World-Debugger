// https:// socket.io/zh-CN/docs/v4/

import { Server } from 'socket.io'
function initSocket(port: number) {
  const io = new Server(port)
  io.on('connection', (socket) => {
    console.log(socket)
  })
}
export { initSocket }
