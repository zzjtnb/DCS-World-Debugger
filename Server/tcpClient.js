/**
 * 构建TCP客户端
 */
let fs = require('fs');
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
let result = '';

/* 监听服务器传来的data数据 */
client.on("data", function (chunk) {
  // result += chunk.toString();
  // Or Buffer.concat if you prefer.
  result += Buffer.concat([chunk]).toString();
})
client.on('end', () => {
  // 创建一个可以写入的流，写入到文件 dcs.json 中
  let writerStream = fs.createWriteStream('./dcs.json');
  // 使用 utf8 编码写入数据
  writerStream.write(result, 'UTF8');
  // 标记文件末尾
  writerStream.end();
  // 处理流事件 --> finish 事件
  writerStream.on('finish', () => { //finish - 所有数据已被写入到底层系统时触发。
    console.log('写入完成');
  })
  writerStream.on('error', (err) => {
    console.log(err.stack);
  })
  const msg = JSON.parse(result)
  event.emit(msg.type, msg);
  console.log("程序执行完毕");
})
client.on("error", (error) => {
  let data = { status: false, "type": luaStr.env, data: error }
  if (luaStr.env != 'api_loadstring') luaStr.env = 'net_dostring'
  event.emit(luaStr.env, data);
  console.log(`[${timer}] 连接DCS World失败 --> ` + error);
})
module.exports = tcpClient