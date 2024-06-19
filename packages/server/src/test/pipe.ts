import Pipe from '../lib/tcp/Pipe'
import SocketServer from '../lib/tcp/server'
import SocketClient from '../lib/tcp/client'

const pipe = new Pipe()

const message = 'Hello'
// 在Node.js中,Buffer.from()默认使用utf8编码.
const buffer = Buffer.from(message)
const encode = pipe.encode(message)
const decode = pipe.decode(encode)
const length = pipe.getPackageLength(encode)
// console.log('原始数据:', buffer)
// console.log('编码数据:', encode)
// console.log('解码数据:', decode)
// console.log('包长度:', length)

const HOST = 'localhost'

const server = new SocketServer({
  port: 9500,
  host: HOST,
  isLog: true,
})
server.start().then(() => {
  const client = new SocketClient({
    host: HOST,
    port: 9500,
    isLog: true,
  })
  client.connect().then(() => {
    client.send(`hello 1`)
    client.send(`hello 2`)
    client.send(`hello 3`)
    client.send(`hello 4`)
    client.send(`hello 5`)
  })
})
