const path = require('path');
const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const event = require('../middleware/event');
const CONFIG = require(path.join(__dirname, '../config/common'))
let remoteInfo = {}
/**
 * udp服务
 */
server.bind(CONFIG.DCS.UDP, CONFIG.DCS.IP);
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log('地址正被使用，重试中...');
  }
});
// server.on('listening', () => {
//   const serverInfo = server.address();
//   console.log(`DCS UDP服务器已创建并监听-> ${serverInfo.address}:${serverInfo.port} 等待连接`);
// });
server.on('close', () => {
  console.log('socket已关闭');
});
const { makedir, streamData } = require('../utils/fs');
server.on('message', (data, remote) => {
  remoteInfo = remote
  // send_udp_data(data, remote)
  const result = JSON.parse(data.toString());
  if (!result) return
  switch (result.type) {
    case 'serverData':
      console.log(result.event + '--' + result.executionTime.os);
      debug_mod(result)
      // event.emit(result.event, result)
      break;
    case 'serverStatus':
      event.emit(result.type, result)
      break;
    default:
      break;
  }
});

/**
 * 向udp客户端发送数据
 * @param {*} data
 * @param {*} remote
 * @returns
 */
function send_udp_data(data, remote) {
  // console.log(`server got: ${data} from ${remote.address}:${remote.port}`);
  // server.send('received: ' + data.toString(), remote.port, remote.address);//通知客户端我已经收到
  remoteInfo = remote || remoteInfo
  if (JSON.stringify(remoteInfo) == '{}') return console.log("DCS World 尚未连接");
  server.send(data.toString(), remoteInfo.port, remoteInfo.address, (err) => {
    if (err) return console.log(err);
    console.log("发送成功");
  });
}

debug_mod = (result) => {
  if (!result.event || !result.executionTime.os) return
  makedir(path.join(process.cwd(), 'logs/json/debug'))
  const debug_dir = path.join(process.cwd(), `logs/json/debug/${result.event}`)
  const mksucess = makedir(debug_dir)
  if (mksucess) {
    const name = result.executionTime.os.replace(/:|-/g, '_')
    streamData(`${path.join(debug_dir, name)}.json`, JSON.stringify(result) + '\n')
  }
}

module.exports = server