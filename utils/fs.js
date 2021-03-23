let fs = require('fs');
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