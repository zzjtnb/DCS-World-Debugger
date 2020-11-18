/**
 * 构建TCP客户端
 */
const path = require('path');
const CFG = require(path.join(__dirname, '../config/db'))
const net = require("net");
const client = net.Socket();

function tcpClient(luaStr) {
  client.connect(CFG.DCS.TCP, CFG.DCS.IP, () => {
    if (typeof (luaStr) == 'string') {
      client.write(luaStr.toString() + '\n');
    } else {
      client.write(JSON.stringify(luaStr) + '\n');
    }
  })
  client.on("error", (error) => {
    console.log("连接DCS World失败->" + error);
  })
}

module.exports = tcpClient