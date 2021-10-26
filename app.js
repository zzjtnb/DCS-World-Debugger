const {
  initNode,
  getGroups,
  EVENTS,
  COALITIONS,
  addEventHandler,
  api_loadstring,
  net_dostring,
} = require('./src/index');
const { Logger } = require('./utils/logo4');
require('module-alias/register');
const socketio = require('socket.io');
const express = require('express');
const app = express();

const path = require('path');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/favicon.ico', express.static('/images/favicon.ico'))

const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error();
  err.message = req.path + '-->路径不存在';
  err.status = 404;
  next(err);
});
/**
 * error handler
 * 生产环境下的错误处理, 不会向用户显示堆栈信息
 * 开发环境下的错误处理会输出堆栈信息
 */

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Create the http server
const server = require('http').createServer(app);

server.listen(3000, 'localhost', () => {
  // console.log(`WEB Server running at http://localhost:3000`);
  Logger.log('WEB Server running at http://localhost:3000');
  // Logger.info('dd');
});

initNode().then(async () => {
  // Log information on all the groups in the blue coalition
  // console.log(await getGroups(COALITIONS.BLUE));
  // Log position of new added marks
  addEventHandler(EVENTS.EventMarkAdded, (event) => {
    console.log('A mark was added at position', event.pos);
  });
  addEventHandler(EVENTS.EventBirth, (event) => {
    // console.log('出生', event);
  });
  addEventHandler(EVENTS.EventShot, (event) => {
    // console.log('EventShot', event);
  });
});
// Create the Socket IO server on
// the top of http server
const io = socketio(server);
function socketInit(server, showSentLuaCode) {
  // 监听connect事件;
  io.on('connection', (socket) => {
    // this callback will be executed for all the socket connections.
    // console.log(socket.handshake.url);
    socket.removeAllListeners(); //一定要先移除原来的事件，否则会有重复的监听器
    // console.log(socket.id, '有连接');
    socket.on('debuggerLua', async (data) => {
      if (showSentLuaCode) {
        console.log(data);
      }
      let res = null;
      switch (data.type) {
        case 'api_loadstring':
          res = await api_loadstring(data);
          break;
        case 'net_dostring':
          res = await net_dostring(data);
          break;
        default:
          break;
      }
      socket.emit(data.type, res);
    });
  });
}
socketInit(server);
