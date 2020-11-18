import { Socket } from 'node:net'
import EventEmitter from 'node:events'
import type { ClientOptions } from 'socket'

class SocketClient extends EventEmitter {
  private receivedData: string
  private host: string
  private port: number
  private isLog: boolean
  private client: Socket
  private isConnected: boolean

  constructor({ host, port, isLog = false }: ClientOptions) {
    super()
    this.receivedData = ''
    this.host = host
    this.port = port
    this.isLog = isLog
    this.client = new Socket()
    this.isConnected = false
  }

  private log(message: string, ...args: any): void {
    if (this.isLog) {
      console.log(`[Socket Client] ${message}`, ...args)
    }
  }

  private handleReceivedData(chunk: string): void {
    this.receivedData += chunk
    const quitString = 'quit\r\n'
    if (this.receivedData.endsWith(quitString)) {
      const result = this.receivedData.replace(quitString, '')
      try {
        const data = JSON.parse(result)
        this.emit('handle', data)

        if (data.type === 'message') {
          console.log('DCS World', data.data)
        }
      }
      catch (error) {
        this.emit('handle', result)
      }
      this.receivedData = ''
    }
  }

  public connect(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.client.connect(this.port, this.host)
      this.client.on('data', (chunk) => {
        this.handleReceivedData(chunk.toString())
      })
      this.client.once('connect', () => {
        // this.log('连接服务器成功')
        this.client.setEncoding('utf8')
        this.client.setTimeout(0)
        this.client.setNoDelay(true)
        this.client.setKeepAlive(true)
        this.isConnected = true
        resolve()
      })
      // 当错误发生时触发.'close' 事件也会紧接着该事件被触发.
      this.client.once('error', (err) => {
        reject(err)
      })
      // 如果套接字因不活动而超时则触发.这只是为了通知套接字已经空闲.用户必须手动关闭连接.
      this.client.once('timeout', () => {
        this.client.destroy()
      })
      // 当 socket 的另一端发送一个 FIN 包的时候触发,从而结束 socket 的可读端.
      this.client.once('end', () => {
        this.client.destroy()
      })
      // 当server关闭的时候触发. 注意,如果有连接存在, 直到所有的连接结束才会触发这个事件
      this.client.once('close', () => {
        this.isConnected = false
      })
    })
  }

  public send(data: string | object, tryCount = 3, delay = 1000): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const message = typeof data === 'string' ? data : JSON.stringify(data)
      const messageWithEnd = `${message}quit\r\n`
      let lastError: Error
      const sendAttempt = (attempt: number, currentDelay: number) => {
        if (this.isConnected) {
          this.client.write(messageWithEnd, (error) => {
            if (error)
              reject(error)
            else
              resolve()
          })
        }
        else {
          if (attempt < tryCount) {
            this.log(`尚未连接,正在重试: ${attempt + 1}/${tryCount}...`)
            this.connect()
              .then(() => setTimeout(() => sendAttempt(attempt + 1, currentDelay * 2), currentDelay)) // 延迟重试,退避策略
              .catch((err) => {
                lastError = err // 保存最后一次连接失败的错误
                setTimeout(() => sendAttempt(attempt + 1, currentDelay * 2), currentDelay) // 延迟重试,退避策略
              })
          }
          else {
            // 在最后一次尝试时返回最后一次连接失败的错误,如果没有则返回默认错误
            reject(lastError)
          }
        }
      }

      sendAttempt(0, delay)
    })
  }
}

export default SocketClient
