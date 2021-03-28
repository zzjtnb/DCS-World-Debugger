const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const { httpLogger, httpError } = require('./middleware/logger');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const http = require("http");
const socketio = require("socket.io");
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/favicon.ico', express.static('/images/favicon.ico'))
app.use(httpLogger)

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
  // var err = new Error();
  // err.message = req.path + '-->路径不存在'
  // err.status = 404;
  // next(err);
});
/**
 * error handler
 * 生产环境下的错误处理, 不会向用户显示堆栈信息
 * 开发环境下的错误处理会输出堆栈信息
 */
app.use((err, req, res, next) => {
  httpError.error("Something went wrong:", err.message, err);
  // set locals, only providing error in development//设置本地变量，仅在开发中提供错误
  res.locals.message = err.message || '服务器内部错误';
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // 设置响应状态
  res.status(err.status || 500);
  res.json({ message: res.locals.message, error: res.locals.error })
});


// Create the http server
const server = require('http').createServer(app);
// Create the Socket IO server on
// the top of http server
const io = socketio(server);
const { debuggerLua } = require('./utils/debuggerLua');
debuggerLua(io)

// module.exports = app;
module.exports = { app: app, server: server };
