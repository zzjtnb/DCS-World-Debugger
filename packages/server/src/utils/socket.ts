import { Server } from 'socket.io'
import { executeDebug } from '../lib'
const io = new Server({
  cors: {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  },
})
io.listen(4000)

function socketInit(showSentLuaCode = false) {
  // 监听connect事件;
  io.on('connection', (socket) => {
    // this callback will be executed for all the socket connections.
    // console.log(socket.handshake.url);
    socket.removeAllListeners() // 一定要先移除原来的事件，否则会有重复的监听器
    // console.log(socket.id, '有连接');
    socket.on('debuggerLua', async (data) => {
      data.content = data.content.replace(/--.*|\n/g, ' ')
      if (showSentLuaCode)
        console.log('debug请求数据:', data)
      const res = await executeDebug(data)
      // console.log(data, res)
      socket.emit('debugResult', res)
    })
  })
}

export { socketInit }
