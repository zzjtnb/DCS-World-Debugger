import type { Socket } from 'node:net'
import { createConnection, createServer } from 'node:net'
import dayjs from 'dayjs'
import { Logger } from '../utils/logo4'
const host = '127.0.0.1'
const dataTimeoutSec = 10 * 1000

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
  networkOnError: NetworkOnError,
  networkOnMessage: NetworkOnMessage,
): Promise<[Socket, NetworkSend]> =>
  new Promise((resolve, reject) => {
    const rinfo = { address: host, port: distantPort, family: 'IPv4' }
    const networkSend: NetworkSend = (msg: string): Promise<void> =>
      new Promise((resolve, reject) => {
        debugInfo = JSON.parse(msg)
        debugInfo.sent = Date.now()
        // 创建TCP客户端
        const client = createConnection({ host, port: distantPort })
        // 设置连接保持
        // client.setKeepAlive(true)
        client.setTimeout(dataTimeoutSec)
        client.on('connect', () => {
          client.write(`${msg}\r\n`, (err: any) => {
            if (err) {
              debugInfo.payload.status = false
              debugInfo.payload.msg = `TCP Client: 发送消息失败 --> ${err}`
              networkOnMessage(debugInfo, rinfo)
              // reject(new Error(result.payload.result))
            }
            resolve()
          })
        })
        client.on('data', (buffer) => {
          const receive = buffer.toString()
          if (receive.endsWith('qiut\r\n'))
            client.destroy()
        })
        client.on('timeout', () => {
          // console.log('TCP Client: 客户端连接超时')
          client.destroy()
        })
        // client.on('close', () => {
        //   console.log('TCP Client: 客户端关闭')
        // })
        // 例如监听一个未开启的端口就会报 ECONNREFUSED 错误
        client.on('error', (err: any) => {
          if (err.code === 'ECONNREFUSED') {
            debugInfo.payload.status = false
            debugInfo.payload.msg = `TCP Client: 连接DCS World失败 --> ${err}`
            networkOnMessage(debugInfo, rinfo)
            // reject(result.payload.result)
          }
        })
      })
    // 创建TCP服务端
    const server = createServer()
    /** ************************** net.Server方法 *******************************/
    server.listen(ownPort, '0.0.0.0', () => {
      // 获取监听地址端口参数信息
      // const address = server.address()
      resolve([server as unknown as Socket, networkSend])
    })
    /** ************************* net.Server 属性 *****************************/
    // 最大连接数字,设置此属性以在服务器的连接计数变高时拒绝连接。
    server.maxConnections = 3
    server.setMaxListeners(10)
    /** ************************* net.Server事件 ******************************/
    // 建立新连接时触发
    server.on('connection', (socket: Socket) => {
      // server.getConnections((error, count) => {
      //   if (error) return
      //   Logger.log(`TCP Server: 当前服务器的连接数:${count}`)
      // })
      let receive = ''
      /* socket 属性 */
      socket.setEncoding('utf8')
      socket.setTimeout(dataTimeoutSec)
      // socket.setKeepAlive(true)
      /* socket 事件 */
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
            debugInfo.payload.result = `TCP Server: 接收到错误的结果 --> ${error}`
          }
          networkOnMessage(debugInfo, rinfo)
          receive = ''
          // 也可以向流中写入数据
          const flag = socket.write('quit\r\n')
        }
      })
      // 连接超时后,并不会断开,需手动调用 end() 或 destroy() 来断开连接
      socket.on('timeout', () => {
        // console.log('TCP Server: 客户端连接超时')
        socket.destroy()
      })
    })
    // 发生错误时触发
    server.on('error', (err) => {
      console.error(`ERROR - Server:\n${err.stack}`)
      networkOnError(err)
    })
  })
process.on('uncaughtException', (err) => {
  console.log(err.stack)
  console.log('NOT exit...')
})
