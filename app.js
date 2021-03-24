const express = require('express');
let port = 3000;
const app = express()
const host = "localhost";
const path = require('path');
app.set('view engine', 'ejs');//指定模板文件的后缀名为ejs
app.set('views', path.join(__dirname, 'views'));//设定网页存放的目录.
app.use(express.static(path.join(__dirname, 'views')));//静态资源中间件-设定静态文件目录.
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/favicon.ico', express.static('/images/favicon.ico'))
const { probe } = require('./utils/port');
const { debuggerLua } = require('./utils/debuggerLua');
const { appLog, httpLogger, httpErrorLogger } = require('./middleware/logger');
app.use(httpLogger)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res, next) {
  res.render('index', { title: '首页' });
});
const routes = require('./routes');
app.use('/file', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error();
  err.message = req.path + '-->路径不存在'
  err.status = 404;
  next(err);
});

/**
 * error handler
 * 生产环境下的错误处理, 不会向用户显示堆栈信息
 * 开发环境下的错误处理会输出堆栈信息
 */
app.use((err, req, res, next) => {
  httpErrorLogger.error("Something went wrong:", err.message, err);
  // set locals, only providing error in development//设置本地变量，仅在开发中提供错误
  res.locals.message = err.message || '服务器内部错误';
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // 设置响应状态
  res.status(err.status || 500);
  res.json({ message: res.locals.message, error: res.locals.error })
});
const server = require('http').createServer(app);
const io = require('socket.io')(server);
debuggerLua(io)
probe(port, (bl, _pt) => {
  bl ? port : port = _pt + 1
  server.listen(port, () => {
    appLog.info(`WEB Server running at http://${host}:${port}`);
  })
})
