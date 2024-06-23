import type { AddressInfo, Server, Socket } from 'node:net'
import { createServer } from 'node:net'
import util from 'node:util'

import EventEmitter from 'node:events'

import type { ServerOptions } from 'types/socket'
import { portManager } from '../../utils/portManager'

class SocketServer extends EventEmitter {
  private server: Server
  private port: number
  private host: string
  private isLog: boolean
  private clients: Set<Socket>
  private receivedData: string

  constructor({ port, host = '0.0.0.0', isLog = false }: ServerOptions) {
    super()
    this.port = port
    this.host = host
    this.isLog = isLog
    this.server = createServer({
      allowHalfOpen: false,
      pauseOnConnect: false,
    }, (socket) => {
      this.handleConnection(socket)
    })
    this.clients = new Set()
    this.receivedData = ''
  }

  private log(message: string, ...args: any): void {
    if (!this.isLog)
      return
    console.log(`[Socket Server] ${message}`, ...args)
  }

  private closeSocket(socket: Socket): void {
    socket.destroy()
    this.clients.delete(socket)
  }

  private handleReceivedData(chunk: string): void {
    this.receivedData += chunk
    const quitString = 'quit\r\n'
    if (this.receivedData.endsWith(quitString)) {
      const result = this.receivedData.replace(quitString, '')
      try {
        const data = JSON.parse(result)
        this.emit('handle', data)
      }
      catch (error) {
        this.emit('handle', result)
      }
      this.receivedData = ''
    }
  }

  private handleConnection(socket: Socket): void {
    if (this.clients.size + 1 >= this.server.maxConnections) {
      const oldestSocket = this.clients.values().next().value
      this.log(`连接数已达到最大限制，关闭最早的连接 ${oldestSocket.remoteAddress}:${oldestSocket.remotePort}`)
      this.closeSocket(oldestSocket)
    }

    this.log(`客户端 ${socket.remoteAddress}:${socket.remotePort} 已连接.`)
    this.server.getConnections((_error, count) => {
      this.log(`最大连接数量${this.server.maxConnections},当前连接数量${count}`)
    })
    this.clients.add(socket)
    // 设置数据的编码格式为 'utf8'
    socket.setEncoding('utf8')
    socket.setTimeout(0)
    /**
     * 解决 TCP 粘包问题
     * 将此选项设置为true 会禁用 Nagle 的连接算法
     */
    socket.setNoDelay(true)
    /**
     * 当服务器和客户端建立连接后,当一方主机突然断电,重启,系统崩溃等意外情况时,
     * 将来不及向另一方发送FIN包,这样另一方将永远处于连接状态.
     * 可以使用setKeepAlive方法来解决这一个问题
     * socket.setKeepAlive([enaable],[initialDelay]);
     * enable 是否启用嗅探,为true时会不但向对方发送探测包,没有响应则认为对方已经关闭连接,自己则关闭连接
     * initialDelay 多久发送一次探测包,单位是毫秒
     */
    socket.setKeepAlive(true)

    socket.on('data', (chunk: Buffer | string) => {
      this.handleReceivedData(chunk.toString())
    })

    socket.on('error', () => {
      // this.log(`Socket 错误: ${err.message}`)
      this.closeSocket(socket)
    })
    // 连接超时后,并不会断开,需手动调用 end() 或 destroy() 来断开连接
    socket.on('timeout', () => {
      // this.log('Socket 超时.')
      socket.end()
    })
    socket.on('end', () => {
      // this.log('客户端断开连接.')
      this.closeSocket(socket)
    })
  }

  public start(): Promise<AddressInfo> {
    return new Promise((resolve, reject) => {
      // 在服务器上设置最大监听器数量,以避免内存泄漏警告.默认NaN
      // this.server.setMaxListeners(5)
      this.server.maxConnections = 5
      // 当连接数达到server.maxConnections阈值时,服务器将丢弃新连接并'drop'改为发出事件
      this.server.on('drop', (data) => {
        this.log(`数据丢失: ${util.inspect(data)}`)
      })
      this.server.listen(this.port, this.host, () => {
        const address = this.server.address() as AddressInfo
        this.log(`服务器监听在 ${address.address}:${address.port}`)
        resolve(address)
      })
      this.server.on('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') {
          this.log(`${this.port}端口正被使用`)
          portManager.findPID(this.port).then((pid) => {
            if (!pid)
              return this.log('未找到占用端口的进程')
            portManager.KillPID(pid)
          })
        }
        else {
          this.log(`服务器错误: ${err.message}`)
          reject(err)
        }
      })
    })
  }

  public stop(): void {
    this.server.close((err) => {
      if (err)
        this.log(`停止服务器时出错: ${err.message}`)
      else
        this.log('服务器已停止.')
    })

    for (const client of this.clients)
      client.destroy()
  }
}

export default SocketServer
