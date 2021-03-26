/**
 * 构建TCP客户端
 */
const net = require("net");
const client = net.Socket();
const dayjs = require('dayjs');
const event = require('../middleware/event');
const { TCPCONFIG } = require('../config/common')
let old_lua_string = null;
let result = null;
const timer = dayjs().format('YYYY-MM-DD HH:mm:ss');
function tcpClient(str) {
  old_lua_string = str
  client.connect(TCPCONFIG.CPORT, TCPCONFIG.IP, () => {
    let luaText = JSON.stringify(old_lua_string) + '\r\n'
    client.write(luaText);
    // console.log(`[${timer}] [INFO] tcpClient.js --> 发送成功\n`, JSON.stringify(old_lua_string));
  })
}
client.on("data", (chunk) => {
  // result += chunk.toString();
  // Or Buffer.concat if you prefer.
  result = Buffer.concat([chunk]).toString();
})
client.on('end', () => {
  const msg = JSON.parse(result)
  event.emit(msg.type, msg)
  result = null
})
// 为客户端添加close事件处理函数
// client.on('close', function () {
//   console.log('TCP客户端Connection closed');
// });
client.on("error", (error) => {
  console.log(`[${timer}] 连接DCS World失败 --> ` + error);
  let data = { status: false, "type": old_lua_string.type, data: error, times: timer }
  event.emit(old_lua_string.type, data)
})

module.exports = {
  tcpClient
}