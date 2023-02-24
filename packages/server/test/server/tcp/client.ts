import net from 'net'
// 创建新的 net.Socket，并立即使用 socket.connect() 发起连接，然后返回启动连接的 net.Socket。
// 建立连接后，将在返回的套接字上触发 'connect' 事件。 最后一个参数 connectListener（如果提供）将作为 'connect' 事件的监听器添加一次。
const client = net.createConnection({
  port: 8124, // 端口
  host: 'localhost', // 服务地址，默认localhost
}, () => {
  console.log('连接成功')
})
/** *******************net.Socket 属性*************************/
// // 接受的字节数
// client.bytesRead = 1024
// // 发送的字节数
// client.bytesWritten = 2048
// // 返回本地IP地址的字符串表示
// client.localAddress
// // 返回本地端口
// client.localPort
// // 远程 IP 地址的字符串表示形式
// client.remoteAddress
// // 远程 IP 系列的字符串表示形式。 'IPv4' 或 'IPv6'。
// client.remoteFamily
// // 远程端口的数字表示
// client.remotePort
/** *******************net.Socket 事件*************************/
// 连接server成功后触发
client.on('connect', () => {

})
// 接收到数据时触发
client.on('data', (data) => {
  console.log(data.toString())
})
// 当套接字的另一端表示传输结束时触发，从而结束套接字的可读端。
client.on('end', () => {})
// 当写缓冲区变空时触发。 可用于限制上传。
client.on('drain', () => {})
// 当套接字准备好使用时触发。
client.on('ready', () => {})
// 如果套接字因不活动而超时则触发。
client.on('timeout', () => {
  // 这只是通知套接字已空闲。 用户必须手动关闭连接。
  client.destroy() // 关闭连接
})
// 发生错误时触发。 'close' 事件将在此事件之后直接调用。
client.on('error', (err) => {
  console.log(err)
})

/** *******************net.Socket 方法********************************/
// // 销毁流并关闭连接。
// client.destroy()
// // 在给定的套接字上发起连接。
// client.connect()
// // 获取连接地址信息
// client.address()
// // 关闭socket，可传入数据，在关闭之前再write一次数据
// client.end(data, () => {
//   console.log('连接已关闭')
// })
// // 暂停读取数据
// client.pause()
// // 继续读取数据
// client.resume()
// // 为data事件中的datastream统一设置编码
// client.setEncoding('utf8')
// // 设置套接字超时事件
// client.setTimeout(3000)
// // 在套接字上发送数据。 第二个参数指定字符串情况下的编码。 它默认为 UTF8 编码。
// client.write(data, (err) => {
//   if (err) return
//   console.log('数据发送成功')
// })

