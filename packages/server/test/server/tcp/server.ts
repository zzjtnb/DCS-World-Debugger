import net from 'net'

function initServer(port: number) {
  const server = net.createServer((socket) => {
    console.log('client connect')
    /** *********************net.Socket事件*******************************/
    // 接收到数据时触发。
    socket.on('data', (data) => {
      console.log(data.toString())
    })
    // 当成功建立套接字连接时触发。
    socket.on('connect', () => {
      console.log('套接字建立成功')
    })
    // 当写缓冲区变空时触发。
    socket.on('drain', () => {})
    // 当套接字的另一端表示传输结束时触发，从而结束套接字的可读端。
    socket.on('end', () => {
      console.log('数据接受完毕')
    })
    // 发生错误时触发，close事件将在此事件之后直接调用
    socket.on('error', (err) => {
      console.log(err)
    })
    // 一旦套接字完全关闭就触发
    socket.on('close', (hasError) => {
    // 参数 hadError 是布尔值，表示套接字是否由于传输错误而关闭。ture则表示由于传输错误而导致关闭
    })
  })
  /** *************************net.Server 属性*****************************/
  // 最大连接数字，设置此属性以在服务器的连接计数变高时拒绝连接。
  server.maxConnections = 6

  /** *************************net.Server事件******************************/
  // 建立新连接时触发
  server.on('connection', (socket) => {
    console.log('建立新连接时触发')
  })
  // 发生错误时触发
  server.on('error', (err) => {
    console.log(err)
  })
  // 服务器关闭时触发
  server.on('close', () => {
    console.log('服务器关闭')
  })

  /** **************************net.Server方法*******************************/
  // 异步获取服务器上的并发连接数
  server.getConnections((err, count) => {
    if (err) return
    console.log(count, 'connections')
  })

  // 绑定监听端口
  server.listen(port, () => {
    // // 获取监听地址端口参数信息
    // const address = server.address()
    // console.log(address)
    console.log(`NODE server successfuly loaded on port ${port}`)
  })
  // // 停止服务器接受新连接并保持现有连接。
  // server.close((err) => {
  // // 该函数是异步的，当所有连接都结束并且服务器触发 'close' 事件时，则服务器最终关闭。
  // // 如果服务器在关闭时未打开，它将以 Error 作为唯一参数被调用。
  //   console.log(err, '服务器关闭')
  // })
}
export default initServer
