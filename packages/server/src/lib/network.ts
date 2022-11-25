import type { AddressInfo, Server, Socket } from 'node:net'

import { createConnection, createServer } from 'node:net'
import util from 'node:util'
import dayjs from 'dayjs'
import { Logger } from '../utils/logo4'
import { killPort } from '../utils/cmd'

const host = '127.0.0.1'

// 取消超时时间的设置
const dataTimeoutSec = 0 * 1000

let debugInfo: Message = {
  id: '',
  type: 'event',
  callbackId: undefined,
  payload: {
    type: '',
    status: false,
    content: '',
    result: '',
    date: { os: dayjs().format('YYYY-MM-DD HH:mm:ss') },
  },
  sent: 0,
}

export const initNetwork = (
  ownPort: number,
  distantPort: number,

  networkOnMessage: NetworkOnMessage,
): Promise<[Server, NetworkSend]> =>
  new Promise((resolve, reject) => {
    const isDev = process.env.isDev || false
    const networkSend: NetworkSend = (msg: string): Promise<void> =>
      new Promise(() => {
        const rinfo = { address: host, port: distantPort, family: 'IPv4' }
        debugInfo = JSON.parse(msg)
        debugInfo.sent = Date.now()
        // 创建TCP客户端
        const client = createConnection({ host, port: distantPort })
        // -------------------------------- socket 属性 --------------------------------
        // 设置连接保持
        client.setKeepAlive(true)
        client.setTimeout(dataTimeoutSec)
        // -------------------------------- socket 事件 --------------------------------
        client.on('connect', () => {
          if (isDev)console.log('TCP Client: DCS 服务端连接成功')
          client.write(`${msg}\r\n`, (err: any) => {
            // 如果没有错误 end 方法给 DCS 服务端发送FIN包
            if (!err) return client.end()
            debugInfo.payload.status = false
            debugInfo.payload.msg = `TCP Client: 发送消息失败 --> ${err}`
            networkOnMessage(debugInfo, rinfo)
          })
        })

        // client.on('data', (buffer) => {
        //   const receive = buffer.toString()
        //   console.log('TCP Client 收到消息:', receive)
        //   if (receive.endsWith('qiut\r\n'))client.destroy()
        // })

        /**
         * Lua TCP.sever 收到消息后调用 close() 方法,
         * 会触发nodejs net.createConnection 对象的 end 事件
         */
        client.on('end', () => {
          if (isDev)console.log('TCP Client: 客户端发送数据结束')
          //  client.destroy() 会触发 client 的 close事件
          client.destroy()
        })
        client.on('timeout', () => {
          if (isDev) console.log('TCP Client: 客户端连接超时')
          client.destroy()
        })
        // 例如监听一个未开启的端口就会报 ECONNREFUSED 错误
        client.on('error', (err: any) => {
          if (err.code === 'ECONNREFUSED') {
            debugInfo.payload.status = false
            debugInfo.payload.msg = `TCP Client: 连接DCS World失败 --> ${err}`
            networkOnMessage(debugInfo, rinfo)
          }
          client.destroy()
        })
        client.on('close', () => {
          if (isDev)console.log('TCP Client: 客户端关闭')
        })
      })
    const networkServer = (): Server => {
      // 创建TCP服务端
      const server = createServer()
      // -------------------------------- net.Server 属性 --------------------------------
      // 最大连接数字,设置此属性以在服务器的连接计数变高时拒绝连接,默认NaN
      // server.maxConnections = 2
      server.setMaxListeners(10)
      // -------------------------------- net.Server 方法 --------------------------------
      server.listen(ownPort, host, () => {
      // 获取监听地址端口参数信息
        const address = server.address() as AddressInfo
        Logger.log(`NODE server successfuly loaded on port ${address.port}`)
      })
      // -------------------------------- net.Server 事件 --------------------------------
      // 建立新连接时触发
      server.on('connection', (socket: Socket) => {
        let receive = ''
        const address = socket.address() as AddressInfo
        if (isDev) {
          console.log('TCP Server: DCS 客户端连接成功')
          console.log('TCP Server 客户端地址:', util.inspect(address))
        }
        server.getConnections((_error, count) => {
          if (_error) return false
          // console.log('最大连接数量%d,当前连接数量%d', server.maxConnections, count)
          if (isDev)Logger.log(`TCP Server: 当前服务器的连接数:${count}`)
        })
        // -------------------------------- socket 属性 --------------------------------
        socket.setTimeout(dataTimeoutSec)
        socket.setEncoding('utf8')
        // 当服务器和客户端建立连接后,当一方主机突然断电、重启、系统崩溃等意外情况时,
        // 将来不及向另一方发送FIN包,这样另一方将永远处于连接状态。
        // 可以使用setKeepAlive方法来解决这一个问题
        // socket.setKeepAlive([enaable],[initialDelay]);
        // enable 是否启用嗅探,为true时会不但向对方发送探测包,没有响应则认为对方已经关闭连接,自己则关闭连接
        // initialDelay 多久发送一次探测包,单位是毫秒
        socket.setKeepAlive(true)
        // 解决 TCP 粘包问题
        // 设置即时传输模式
        // 将此选项设置为true 会禁用 Nagle 的连接算法
        socket.setNoDelay(true)

        // -------------------------------- socket 事件 --------------------------------
        // socket.on('data', networkOnMessage)
        socket.on('data', (buffer) => {
        // 我们可以从流中读取数据
        // console.log('服务器接收到 :', buffer.toString())
        // console.log('累计接收的数据大小 :', socket.bytesRead)
        // console.log('累计发送的数据大小 : ', socket.bytesWritten)
          receive += buffer.toString()
          if (receive.endsWith('qiut\r\n')) {
            receive = receive.replace('qiut\r\n', '')
            try {
              debugInfo = JSON.parse(receive)
            }
            catch (error) {
              console.log(receive)
              debugInfo.payload.result = `TCP Server: 接收到错误的结果 --> ${error}`
              debugInfo.payload.connect = receive
            }
            networkOnMessage(debugInfo, address)
            receive = ''
            // 也可以向流中写入数据
            const flag = socket.write('quit\r\n')
            // console.log('TCP Server 给客户端发送信息状态', flag)
          /**
           * 调用end方法lua tcp 客户端接收到的结果就是status=timeout
           */
          // if (flag) socket.end('quit\r\n')
          }
        })
        socket.on('end', () => {
          console.log('TCP Server: 客户端已经关闭')
          socket.destroy()
        })
        // 连接超时后,并不会断开,需手动调用 end() 或 destroy() 来断开连接
        socket.on('timeout', () => {
          console.log('TCP Server: 客户端连接超时')
          socket.destroy()
        })
        socket.on('error', (_err: anyObj) => {
        // console.log('与客户端通信过程中发生了错误，错误编码为%s', _err.code)
        // 错误编码为ECONNRESET
          socket.destroy()
        })
      })
      // 当连接数达到server.maxConnections阈值时,服务器将丢弃新连接并'drop'改为发出事件
      server.on('drop', (data) => {
        console.log('TCP Server drop:', data)
      })
      // 发生错误时触发
      server.on('error', (err: anyObj) => {
      // console.error(`ERROR - Server:\n${err.stack}`)
        if (err.code === 'EADDRINUSE') {
          Logger.log(`${ownPort}端口正被使用,请重启服务`)
          killPort(ownPort)
          // 关闭服务
          server.close()
        }
      })
      return server
    }
    resolve([networkServer(), networkSend])
  })
process.on('uncaughtException', (err) => {
  console.log(err.stack)
  console.log('NOT exit...')
})
