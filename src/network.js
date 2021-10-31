var net = require('net');
const dayjs = require('dayjs');
let oldMessage = {};
let serverRes = '';
/** @internal */
exports.initNetwork = (ownPort, distantPort, networkOnError, networkOnMessage) =>
  new Promise((resolve, reject) => {
    const networkSend = (message) =>
      new Promise((resolveSend, rejectSend) => {
        oldMessage = JSON.parse(message);
        //创建TCP客户端
        const client = net.createConnection({ host: '127.0.0.1', port: distantPort });
        client.write(message, (err) => {
          if (err) {
            rejectSend(`发送消息失败 --> ${error}`);
          }
          resolveSend();
        });
        client.on('error', (error) => {
          networkOnMessage({
            id: oldMessage.id,
            type: oldMessage.type,
            executionTime: { os: dayjs().format('YYYY-MM-DD HH:mm:ss') },
            payload: { status: false, result: `连接DCS World失败 --> ${error}`, luacode: oldMessage.payload.content },
          });
        });
      });
    //创建TCP服务端
    const server = net.createServer((socket) => {
      /* 发送数据 */
      // socket.write(message, function () {
      //   var writeSize = socket.bytesWritten;
      //   console.log(message + 'has send');
      //   console.log('the size of message is' + writeSize + '\n');
      // });
      /* 监听data事件 */
      socket.setEncoding('utf8');
      socket.on('data', function (data) {
        serverRes += data;
        if (serverRes.toString().endsWith('exit\r\n')) {
          serverRes = serverRes.toString().replace('exit\r\n', '');
          try {
            const result = JSON.parse(serverRes);
            networkOnMessage(result);
            serverRes = '';
          } catch (error) {
            networkOnMessage({
              id: oldMessage.id,
              type: oldMessage.type,
              executionTime: { os: dayjs().format('YYYY-MM-DD HH:mm:ss') },
              payload: {
                status: false,
                result: `接收到错误的结果 --> ${error}`,
                luacode: oldMessage.payload.content,
              },
            });
          }
        }
      });
    });
    server.on('error', (err) => {
      console.error(`ERROR - Server:\n${err.stack}`);
      networkOnError(err);
    });
    server.on('listening', () => {
      resolve([server, networkSend]);
    });
    server.listen(ownPort, 'localhost');
  });

process.on('uncaughtException', (err, origin) => {});
