const log4js = require("log4js");
// log4js的输出级别6个: trace, debug, info, warn, error, fatal

const config = {
  "appenders": {
    //设置控制台输出 （默认日志级别是关闭的（即不会输出日志））
    "consoleout": { "type": "console" },
    "access": {
      "type": "dateFile", //输出到格式化的文件（log/access/access-yyyy-MM-dd.log）
      "filename": "logs/http/access.log",
      "pattern": "-yyyy-MM-dd", //生成文件的规则
      "category": "http"
    },

    "appFile": { "type": "dateFile", "filename": "logs/app/app.log", "pattern": "-yyyy-MM-dd", },
    "serverFile": { "type": "dateFile", "filename": "logs/server/debug.log", "pattern": "-yyyy-MM-dd", },
  },
  //不同等级的日志追加到不同的输出位置：appenders: ['consoleout', 'access']  categories 作为getLogger方法的键名对应
  //appenders:采用的appender,取上面appenders项,level:设置级别
  "categories": {
    "default": { "appenders": ["consoleout"], "level": "INFO" },
    "app": { "appenders": ["appFile", "consoleout"], "level": "INFO" },
    "server": { "appenders": ["serverFile"], "level": "INFO" },
  }
}
log4js.configure(config);
const logger = log4js.getLogger('dbInfo');
//重新写了info方法
exports.info = function (message) {
  logger.info(message)
}
exports.consoleout = log4js.getLogger("consoleout")
exports.serverStatus = log4js.getLogger("server");
exports.appLog = log4js.getLogger("app.js");
exports.serverLog = log4js.getLogger("udp.js");
