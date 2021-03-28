//引入net模块
const net = require("net");
const path = require('path');
const { TCPCONFIG } = require('../config/common')
const { makedir, streamData } = require('../utils/fs');
const event = require('../middleware/event');
const { serverStatus } = require('../middleware/logger');
//创建TCP服务端
const server = net.createServer(onClientConnection)
//Start listening with the server on given port and host.
server.listen(TCPCONFIG.SPORT, TCPCONFIG.IP, function () {
  serverStatus.info(`Receive DCS Data Server started on at ${TCPCONFIG.IP}:${TCPCONFIG.SPORT}`);
});
//设置TCP服务端错误时的回调函数
server.on("error", (err) => {
  if (err.code === 'EADDRINUSE') console.log('tcpServer.js-->该地址端口被占用,请修正');
})

//Declare connection listener function
function onClientConnection(client) {
  client.setTimeout(5 * 1000);
  //client.setTimeout(0);取消超时时间的设置
  // 设置最大连接数量为3
  server.maxConnections = 3;
  // server.getConnections((err, count) => log("当前客户端连接数量:" + count));
  // 这里的client参数就是一个sockiet对象
  //Log when a client connnects.
  // log(`${client.remoteAddress}:${client.remotePort} connected`)

  //Listen for data from the connected client.
  client.setEncoding('utf8');
  let data = ''
  client.on('data', (chunk) => {
    const readSize = client.bytesRead;
    // log("已接收到的字节数据长度:" + readSize)
    // console.log("chunk:" + chunk.length);
    data += chunk;
    data = data.replace(/\r\n/, '');
    if (data.endsWith('exit')) {
      client.destroy();
      const result = JSON.parse(data.replace('exit', ''))
      if (!result) return
      switch (result.type) {
        case 'serverData':
          debug_mod(result)
          event.emit(result.event, result)
          break;
        case 'serverStatus':
          event.emit(result.type, result)
          break;
        default:
          break;
      }
    }
    //Send back the data to the client.
    // client.write(`You Said ${data}`);
    // const msg = buffer.toString();
    // // write 方法写入数据，发回给客户端
    // client.write(Buffer.from('你好 ' + msg));
  });
  client.on('end', () => {
    // console.log('客户端已经关闭连接');
    // 完全关闭连接
    client.destroy();
  })
  //Handle client connection termination.
  client.on('close', (hasError) => {
    // console.log(hasError ? '异常关闭' : '正常关闭');
    // log(`${client.remoteAddress}:${client.remotePort} Terminated the connection`)
  });
  //Handle Client connection error.
  client.on('error', (error) => {
    // console.error(`${client.remoteAddress}:${client.remotePort} Connection Error ${error}`);
  });

};
function log(data) { console.log("TCP_Server-->" + data) }
debug_mod = (result) => {
  if (!result.event || !result.executionTime.os) return
  makedir(path.join(process.cwd(), 'logs/json'))
  const debug_dir = path.join(process.cwd(), `logs/json/${result.event}`)
  const mksucess = makedir(debug_dir)
  if (mksucess) {
    const name = result.executionTime.os.replace(/:|-/g, '_')
    streamData(`${path.join(debug_dir, name)}.json`, JSON.stringify(result) + '\n')
  }
}