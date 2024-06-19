import SocketClient from '../lib/tcp/client'
// 配置选项
const options = {
  host: 'localhost',
  port: 9001,
  isLog: true, // 打开日志
}

// 实例化客户端
const client = new SocketClient(options)

// 连接到服务器
client.connect().then(() => {
  const max = 32767

  // const str = '0'.repeat(32767)

  // client.send(str)
  const stringArray = Array.from({ length: 7000 }, (_, i) => (i + 1).toString()).join(',')
  // console.log(stringArray)
  // 发送数据
  client.send(stringArray).then((res) => {

    // fs.writeFileSync('./result.json', res)
  })

  // client.send(`{"type":"debug","payload":{"type":"dostring_in","content":"${text}","state":"gui"}}`)
  // client.send('Hello, server! 1')
  // client.send('Hello, server! 2')
  // client.send('Hello, server! 3')
  // 断开连接
  // client.disconnect()
})
