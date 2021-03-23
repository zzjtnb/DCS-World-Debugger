/**
 * 获取本机IPv4 ip地址
 * @return {string}  返回本机IPv4 ip地址
 */
function getIPAdress() {
  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}

// var ip = getIPAdress();
// console.log("\n--------IP地址：" + ip + "------\n");

/**
 * 获取客服端ip地址
 * @param {*} req  一个包含引发事件的HTTP请求的信息的对象。
 * @return {string}  返回发起请求的客户端IP地址
 */
function getClientIp(req) {
  var ipAddress;
  var forwardedIpsStr = req.header('x-forwarded-for');
  if (forwardedIpsStr) {
    var forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    ipAddress = req.connection.remoteAddress;
  }
  return ipAddress;
}
module.exports = {
  getIPAdress, getClientIp
};
