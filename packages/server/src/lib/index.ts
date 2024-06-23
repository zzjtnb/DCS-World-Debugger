import { env } from 'node:process'
import { Server } from 'socket.io'

import type { ClientOptions, ServerOptions } from 'types/socket'
import SocketClient from './tcp/client'
import SocketServer from './tcp/server'

class SocketIO {
  public io: Server
  HOST: string
  server: SocketServer
  client: SocketClient

  constructor() {
    this.HOST = env.HOST || 'localhost'
    this.initClient()
  }

  initIO(httpServer) {
    this.io = new Server(httpServer, {
      cors: { origin: '*' },
    })
    this.io.on('connection', (socket) => {
      socket.on('debug', (request) => {
        this.client.send(request).catch(() => {
          socket.emit('debug', {
            type: 'message',
            status: false,
            data: '连接DCS World 服务器失败,请检查DCS World 服务器是否启动',
          })
        })
      })
    })
  }

  initServer() {
    return new Promise((resolve, reject) => {
      // 定义服务器的配置选项
      const serverOptions: ServerOptions = {
        host: this.HOST,
        port: Number(env.SERVER_PORT) || 9000,
        isLog: Boolean(env.LOG) || false,
      }
      this.server = new SocketServer(serverOptions)
      this.server.on('handle', (result: { type: string, data: any }) => {
        // if (result.type === 'message')
        //   console.log('DCS World', result.data)
        this.io.emit('debug', result)
      })
      this.server.start().then((address) => {
        resolve(address)
      }).catch((error) => {
        reject(error)
      })
    })
  }

  initClient() {
    //  定义客户端的配置选项
    const clientOptions: ClientOptions = {
      host: this.HOST,
      port: Number(env.REMOTE_PORT) || 9001,
      isLog: Boolean(env.LOG) || false,
    }
    this.client = new SocketClient(clientOptions)
  }
}
const socketIO = new SocketIO()
export default socketIO
