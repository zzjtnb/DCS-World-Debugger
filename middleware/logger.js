const path = require('path');
const log4js = require("log4js");

const config = {
  appenders: {
    //设置控制台输出 （默认日志级别是关闭的（即不会输出日志））
    consoleout: { type: 'console' },
    sqlFile: {
      type: "dateFile",
      filename: path.join(__dirname, '../logs/db/success/sql.log'),
      pattern: "-yyyy-MM-dd.log",
      maxLogSize: 1048576, //单文件最大限制(单位: bytes)
    },
    sqlErrorFile: {
      type: "dateFile",
      filename: path.join(__dirname, '../logs/db/error/err.log'),
      pattern: "-yyyy-MM-dd.log",
      maxLogSize: 1048576, //单文件最大限制(单位: bytes)
    },
    appFile: {
      type: "dateFile",
      filename: path.join(__dirname, '../logs/app/info.log'),
      pattern: "-yyyy-MM-dd.log",
      maxLogSize: 1048576,//文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
    },
    accessError: {
      type: "dateFile",
      filename: path.join(__dirname, '../logs/http/error.log'),
      pattern: "-yyyy-MM-dd.log",
      maxLogSize: 1048576,
    },
    access: {
      type: "dateFile",
      category: "http",
      filename: path.join(__dirname, '../logs/http/access.log'),
      pattern: "-yyyy-MM-dd.log",
      maxLogSize: 1048576,
    },
    serverFile: {
      type: 'file',
      filename: path.join(__dirname, '../logs/server/info.log'),
      pattern: "-yyyy-MM-dd.log",
      maxLogSize: 1048576,
    },
    debugFile: {
      type: 'file',
      filename: path.join(__dirname, '../logs/debug/debug.log'),
      pattern: "-yyyy-MM-dd.log", maxLogSize: 10,
    }
  },
  categories: {
    default: { appenders: ['consoleout'], level: 'DEBUG' },
    db_sql: { "appenders": ["sqlFile"], "level": "INFO" },
    db_err_sql: { "appenders": ["sqlErrorFile"], "level": "debug" },
    http: { "appenders": ["access"], "level": "INFO" },
    httpError: { "appenders": ["accessError"], "level": "ERROR" },
    app: { "appenders": ["appFile", "consoleout"], "level": "INFO" },
    server: { "appenders": ["serverFile", "consoleout"], "level": "INFO" },
    debug: { "appenders": ["debugFile"], "level": "DEBUG" },
  },
  "pm2": true
};
log4js.addLayout('json', (config) => {
  return (logEvent) => { return JSON.stringify(logEvent) + config.separator; }
});
log4js.configure(config);
const logger = log4js.getLogger();
const httpLogger = log4js.connectLogger(log4js.getLogger("http"), { level: 'INFO' })//记录所有访问级别的日志
const httpError = log4js.getLogger("httpError")
const appLog = log4js.getLogger("app.js");
const db_sql = log4js.getLogger('db_sql');
const db_err_sql = log4js.getLogger('db_err_sql');
const auto = log4js.getLogger('auto');
const serverStatus = log4js.getLogger("server");
const debugLog = log4js.getLogger("debug");
//重新写了info方法
function sqlLog(sql) {
  db_sql.info(sql)
}
module.exports = { log4js, logger, httpLogger, httpError, appLog, sqlLog, db_err_sql, auto, serverStatus, debugLog };