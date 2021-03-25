const fs = require('fs');
const path = require('path');
/**
 * 文件夹不存在则创建,防止不创建
 * @param {*} dir_path 需要创建目录的路径
 * @returns 成功true,失败false
 */
function makedir(dir_path) {
  // 为了方式创建文件夹已经存在.需要使用fs.existsSync 同步判断下文件夹是否存在.
  try {
    if (!fs.existsSync(dir_path)) {
      // 之后调用mkdirSync 同步创建文件夹
      fs.mkdirSync(dir_path);
    }
    return true
  } catch (error) {
    return false
  }
}
/**
 * @access stream流写入文件
 * @param {*} filePath -文件路径
 * @param {*} content -内容
 * @returns status:成功true;message:消息
 */
function streamData(filePath, result) {
  return new Promise((resolve, reject) => {
    // 创建一个可以写入的流，写入到文件 filePath 中
    let writerStream = fs.createWriteStream(filePath);
    // 使用 utf8 编码写入数据
    writerStream.write(result, 'UTF8');
    // 标记文件末尾
    writerStream.end();
    // 处理流事件 --> finish 事件
    writerStream.on('finish', () => { //finish - 所有数据已被写入到底层系统时触发。
      resolve({ status: true, message: '写入完成' })
    })
    writerStream.on('error', (err) => {
      reject({ status: false, message: err.stack })
    })
  });
}

module.exports = {
  makedir, streamData,
};
