const path = require('path');
const log4js = require("log4js");

const config = {
  appenders: {
    //设置控制台输出 （默认日志级别是关闭的（即不会输出日志））
    consoleout: { type: 'console' },
    sqlFile: {
      type: "dateFile",
      filename: path.join(__dirname, '../logs/db/success/sql.log'),
      pattern: "-yyyy-MM-dd.log"
    },
    sqlErrFile: {
      type: "dateFile",
      filename: path.join(__dirname, '../logs/db/error/info.log'),
      pattern: "-yyyy-MM-dd.log"
    },
    appFile: {
      type: "dateFile",
      filename: path.join(__dirname, '../logs/app/info.log'),
      pattern: "-yyyy-MM-dd.log"
    },
    accessError: {
      type: "dateFile",
      filename: path.join(__dirname, '../logs/http/error.log'),
      pattern: "-yyyy-MM-dd.log"
    },
    access: {
      type: "dateFile",
      category: "http",
      filename: path.join(__dirname, '../logs/http/access.log'),
      pattern: "-yyyy-MM-dd.log"
    },
    serverFile: {
      type: 'file',
      filename: path.join(__dirname, '../logs/server/info.log'),
      pattern: "-yyyy-MM-dd.log"
    },
    debugFile: {
      type: 'file',
      filename: path.join(__dirname, '../logs/debug/debug.log'),
      pattern: "-yyyy-MM-dd.log"
    }
  },
  categories: {
    default: { appenders: ['consoleout'], level: 'DEBUG' },
    db_sql: { "appenders": ["sqlFile"], "level": "INFO" },
    db_err_sql: { "appenders": ["sqlErrFile"], "level": "ERROR" },
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
const httpErrorLogger = log4js.getLogger("httpError")
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
module.exports = { logger, httpLogger, httpErrorLogger, appLog, sqlLog, db_err_sql, auto, serverStatus, debugLog };