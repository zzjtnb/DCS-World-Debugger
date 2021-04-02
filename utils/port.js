/**
 * @access 检测port是否被占用
 * @param {Number} port
 * @param {Function} callback
 * @return   bl:端口被占用返回false;_pt:传入的端口号
 */
function probe(port, callback) {
  const net = require("net");
  const server = net.createServer().listen(port)
  let calledOnce = false
  const timeoutRef = setTimeout(function () {
    calledOnce = true
    callback(false, port)
  }, 2000)
  timeoutRef.unref()
  server.on('listening', function () {
    clearTimeout(timeoutRef)
    if (server)
      server.close()
    if (!calledOnce) {
      calledOnce = true
      callback(true, port)
    }
  })
  server.on('error', function (err) {
    clearTimeout(timeoutRef)
    let result = true
    if (err.code === 'EADDRINUSE')
      result = false
    if (!calledOnce) {
      calledOnce = true
      callback(result, port)
    }
  })
}
module.exports = { probe }