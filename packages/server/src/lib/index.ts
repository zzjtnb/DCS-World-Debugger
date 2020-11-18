import { env } from 'node:process'

import type { Socket } from 'socket.io'
import { Server } from 'socket.io'

import type { ClientOptions, ServerOptions } from 'types/socket'
import type { DefaultEventsMap } from 'node_modules/socket.io/dist/typed-events'
import SocketClient from './tcp/client'
import SocketServer from './tcp/server'

let initialized = false // 添加一个标志来跟踪初始化状态
export function socketInit() {
  if (initialized)
    return // 检查是否已经初始化
  initialized = true // 将标志设置为 true
  const io = new Server(Number(env.HTTP_PORT), {
    cors: {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  })

  const HOST = env.HOST || 'localhost'
  // 定义服务器的配置选项
  const serverOptions: ServerOptions = {
    host: HOST,
    port: Number(env.SERVER_PORT) || 9000,
    isLog: Boolean(env.IS_LOG) || false,
  }
  const server = new SocketServer(serverOptions)
  server.start()
  server.on('handle', (result: any) => {
    handleServerHandle(result)
  })

  //  定义客户端的配置选项
  const clientOptions: ClientOptions = {
    host: HOST,
    port: Number(env.REMOTE_PORT) || 9001,
    isLog: Boolean(env.IS_LOG) || false,
  }
  const client = new SocketClient(clientOptions)

  // 在添加新监听器之前确保移除之前的监听器
  io.removeAllListeners('connection')
  io.on('connection', (socket) => {
    socket.on('debug', (request) => {
      client.send(request).catch((error) => {
        handleDebugError(socket, error)
      })
    })
  })

  // 处理 server.on('handle') 的函数
  function handleServerHandle(result: { type: string, data: any }) {
    if (result.type === 'message') {
      console.log('DCS World', result.data)
    }
    io.emit('debug', result)
  }
}
// 发送 debug 消息的函数
function handleDebugError(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, error: any) {
  socket.emit('debug', {
    status: false,
    data: error,
    message: '连接DCS World 服务器失败,请检查DCS World 服务器是否启动',
  })
}

// 处理未处理的 Promise reject
process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的拒绝:', reason)
  // 记录日志、发送告警等
})

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error)
  // 记录日志、发送告警等
  // 通常，您希望在捕获到未捕获的异常后优雅地关闭服务器
  // process.exit(1);
})
