const path = require('path');
const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const event = require('../middleware/event');
const CONFIG = require(path.join(__dirname, '../config/common'))
/**
 * udp服务
 */
server.bind(CONFIG.DCS.UDP, CONFIG.DCS.IP);
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log('地址正被使用，重试中...');
  }
});
server.on('listening', () => {
  const serverInfo = server.address();
  // serverLog.info(`DCS UDP服务器已创建并监听-> ${serverInfo.address}:${serverInfo.port} 等待连接`);
});
server.on('message', (data) => {
  const msg = JSON.parse(data.toString());
  event.emit(msg.type, msg);
});
module.exports = server