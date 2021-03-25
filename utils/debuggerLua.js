
const { tcpClient } = require('../server/tcpClient');
require('../server/udpServer'); require('../server/event/index');
let socketClint
const event = require('../middleware/event');
event.on('net_dostring', (msg) => {
  socketClint.emit('net_dostring', msg);
});
event.on('api_loadstring', (msg) => {
  socketClint.emit('api_loadstring', msg);
});
process.on('warning', function (err) {
  if ('MaxListenersExceededWarning' == err.name) {
    console.log(err);
    // process.exit(1); // its up to you what then in my case script was hang
  }
});
function debuggerLua(io) {
  //监听connect事件
  io.on('connection', (socket) => {
    // this callback will be executed for all the socket connections.
    // console.log(socket.handshake.url);
    socketClint = socket
    socket.on('debuggerLua', (data) => {
      tcpClient(data);
    });
  });
}

module.exports = { debuggerLua }