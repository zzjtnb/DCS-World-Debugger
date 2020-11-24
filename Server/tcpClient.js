/**
 * 构建TCP客户端
 */
const path = require('path');
const CFG = require(path.join(__dirname, '../config/db'))
const net = require("net");
const client = net.Socket();
const event = require('../middleware/event');
function tcpClient(luaStr) {
  client.connect(CFG.DCS.TCP, CFG.DCS.IP, () => {
    let luaText = JSON.stringify(luaStr) + '\n'
    client.write(luaText);
  })

  client.on("error", (error) => {
    console.log("连接DCS World失败->" + error);
    let data = { status: false, "type": luaStr.state, data: error }
    if (luaStr.state != 'loadstring') luaStr.state = 'dostring_in'
    event.emit(luaStr.state, data);
  })
}

module.exports = tcpClient