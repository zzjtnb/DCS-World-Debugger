import net from 'node:net'

// net 模块的 socket 和 server 对象,
// socket 具有 end 方法和同名事件, server则具有 close 方法和同名事件.
// 而两者都同时具有一个名为unref的方法.end.close.unref这三个名字本身,或者是它们所代表的方法都或多或少存在相似之处.

const port = 2000
function createServer() {
  const server = net.createServer()
  server.on('connection', (socket) => {
    console.log('连接已建立' + '\n')
    server.getConnections((err, count) => {
      if (err) console.warn(err)
      else console.log(`当前有${count}个连接`)
    })
    socket.on('data', (data) => {
      console.log(data.toString())
    })
    socket.on('error', (err) => {
      console.warn(`server: ${err}`)
      socket.destroy()
    })
    socket.on('end', () => {
    // net.Server对象 close方法
    // close,字面上理解就是关闭的意思.作为server对象的方法,那么应该就是用来关闭当前server的方法.
    // 事实上也确实如我们从字面上直接分析得出的结论一样,close方法的确是用来关闭server对象的.不过,并不是直接关闭.
    // close方法执行后.服务器将不会接受任何新增的连接,但仍会保证现有的连接.而服务器将会在所有连接都终止之后被关闭.
    // 使用close方法可以显式拒绝所有的客户端的连接请求,当所有已连接的客户端关闭后服务器会自动关闭,并触发服务器的close事件
      server.close()
    })
  })
  server.on('close', () => {
    console.log('server: closed')
  })
  // server.on('listening', () => {
  //   console.log('开始监听')
  // })
  server.listen(port, () => {
  // // 获取监听地址端口参数信息
  // const address = server.address()
  // console.log(address)
    console.log(`NODE server successfuly loaded on port ${port}`)
  })
}
function createClent() {
  const client = new net.Socket()
  client.connect(port, '127.0.0.1', () => {
    console.log('已连接到服务器端')
    client.write('你好')
    client.end('再见')
  })

  client.on('data', (data) => {
    console.log(`client: 接收到数据:${data.toString()}`)
  })

  client.on('error', (err) => {
    console.warn(`client: $${err}`)
    client.destroy()
  })

  client.on('end', () => {
    console.log('client: ended')
  })

  client.on('close', () => {
    console.log('client: closed')
  })
}
// 在服务器端的代码中,服务器的 socket 对象一旦监听到 end 事件就会执行 server.close()
// 而客户端代码中的 client.end() 方法则会触发服务器的 end 事件

// telnet 127.0.0.1 2000

/**
 * net.Socket对象
 * allowHalfOpen参数
 * 讲end方法和end事件之前,不得不提net.Server这个对象在构造时的一个重要参数allowHalfOpen.
 * 这个参数默认值为false.当它为true时,接收到对方发送的FIN包后,不会发送一个ACK包回去.
 * 如果要完成TCP的四次挥手,则需要手动调用socket对象的end方法.
 * 同时如果这个值为真,那么对方对于本方来说可写不可读
 *
 * end方法和end事件
 * end方法是用来给对方发送FIN包的,而end事件则是接收到来自对方的FIN包之后才触发的.
 *
 * close事件
 * socket对象虽然没有close方法,但是有close事件.这个事件是在socket对象要被彻底关闭时被触发.
 * 也就是在end事件触发之后触发.
 */

