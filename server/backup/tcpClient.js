/**
 * 构建TCP客户端
 */
const net = require("net");
const client = net.Socket();
const path = require('path');
const dayjs = require('dayjs');
const CONFIG = require(path.join(__dirname, '../config/common'))

function tcpClient(str) {
  let old_lua_string = null;
  let result = null;
  const timer = dayjs.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
  return new Promise((resolve, reject) => {
    old_lua_string = str
    client.connect(CONFIG.DCS.TCP, CONFIG.DCS.IP, () => {
      let luaText = JSON.stringify(old_lua_string) + '\n'
      client.write(luaText);
      // console.log(`[${timer}] [INFO] tcpClient.js --> 发送成功\n`, JSON.stringify(old_lua_string));
    })
    client.on("data", (chunk) => {
      // result += chunk.toString();
      // Or Buffer.concat if you prefer.
      result = Buffer.concat([chunk]).toString();
    })
    client.on('end', () => {
      const msg = JSON.parse(result)
      resolve({ type: msg.type, data: msg })
    })
    client.on("error", (error) => {
      let data = { status: false, "type": old_lua_string.type, data: error, times: timer }
      resolve({ type: old_lua_string.type, data: data })
      console.log(`[${timer}] 连接DCS World失败 --> ` + error);
    })
  });
}

module.exports = {
  tcpClient
}