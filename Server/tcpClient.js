/**
 * 构建TCP客户端
 */
const path = require('path');
const CFG = require(path.join(__dirname, '../config/db'))
const net = require("net");
const client = net.Socket();
const event = require('../middleware/event');
const sd = require('silly-datetime');
const timer = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
let luaStr = null;
function tcpClient(str) {
  luaStr = str
  client.connect(CFG.DCS.TCP, CFG.DCS.IP, () => {
    let luaText = JSON.stringify(luaStr) + '\n'
    client.write(luaText);
    // console.log(`[${timer}] [INFO] tcpClient.js --> 发送成功\n`, JSON.stringify(luaStr));
  })
}
/* 监听服务器传来的data数据 */
client.on("data", function (data) {
  const msg = JSON.parse(data.toString());
  event.emit(msg.type, msg);
})
client.on("error", (error) => {
  let data = { status: false, "type": luaStr.state, data: error }
  if (luaStr.state != 'loadstring') luaStr.state = 'dostring_in'
  event.emit(luaStr.state, data);
  console.log(`[${timer}] 连接DCS World失败 --> ` + error);
})
module.exports = tcpClient