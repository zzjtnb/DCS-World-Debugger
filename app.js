const express = require('express');
const app = express()
const path = require('path');
app.set('views', path.join(__dirname, 'views'));//设定网页存放的目录.__dirname:返回当前文件所在的绝对路径
app.set('view engine', 'ejs');//指定模板文件的后缀名为ejs
//静态资源中间件-设定静态文件目录.
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
//路由
/* GET home page. */
app.get('/', function (req, res, next) {
  res.render('index', { title: '首页' });
});

app.get('/dotring', (req, res) => {

  res.render('lua/dotring', { title: 'dotring' });
});

app.get('/loadstring', (req, res) => {
  res.render('lua/loadstring', { title: 'loadstring' });
});
//处理路径不存在
app.use((req, res) => {
  res.render('index', { title: '首页' });
})
const tcpClient = require('./server/tcpClient'); require('./server/udpServer');
const server = require('http').createServer(app);
const host = "localhost";
const port = 3000;
const { appLog, serverStatus } = require('./middleware/log4');
server.listen(port, () => {
  appLog.info(`WEB Server running at http://${host}:${port}`);
})
const event = require('./middleware/event')
const io = require('socket.io')(server);
let socketClint
//监听connect事件
io.on('connection', (socket) => {
  socketClint = socket
  socket.on('debuggerLua', data => {
    tcpClient(data);
  });
});
event.on('serverStatus', (msg) => {
  serverStatus.info(msg.data.msg);
});
event.on('dostring_in', (msg) => {
  socketClint.emit('dostring_in', msg);
});
event.on('loadstring', (msg) => {
  socketClint.emit('loadstring', msg.data);
});
