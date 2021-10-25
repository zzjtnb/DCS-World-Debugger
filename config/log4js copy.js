const path = require('path');
const log4js = require('log4js');
const chalk = require('chalk');
const StackTrace = require('stacktrace-js');
const dayjs = require('dayjs');
const baseLogPath = path.resolve(__dirname, '../logs'); // 日志要写入哪个目录

const config = {
  appenders: {
    out: {
      type: 'stdout',
      layout: {
        type: 'App',
        // type: 'pattern',
        // pattern: '%[[Server] [%p] %d{yyyy/MM/dd hh.mm.ss} %m %]',
      },
    },
    // 记录所有访问
    access: {
      type: 'dateFile', // 会写入文件,并按照日期分类
      filename: `${baseLogPath}/http/access/access.log`, // 日志文件名,会命名为:access.20200320.log
      alwaysIncludePattern: true,
      pattern: 'yyyyMMdd', // 日志文件按日期(天)切割
      daysToKeep: 60,
      numBackups: 3,
      category: 'http',
      keepFileExt: true, // 是否保留文件后缀
    },
    // 记录错误访问
    access_error: {
      type: 'dateFile',
      filename: `${baseLogPath}/error/access/error.log`,
      alwaysIncludePattern: true,
      pattern: 'yyyyMMdd',
      daysToKeep: 60,
      numBackups: 3,
      category: 'http',
      keepFileExt: true,
    },
    //记录响应信息
    response: {
      type: 'dateFile',
      filename: `${baseLogPath}/http/response/response.log`,
      alwaysIncludePattern: true,
      pattern: 'yyyyMMdd',
      daysToKeep: 60,
      numBackups: 3,
      category: 'http',
      keepFileExt: true,
    },
    //记录响应错误信息
    response_error: {
      type: 'dateFile',
      filename: `${baseLogPath}/error/response/response.log`,
      alwaysIncludePattern: true,
      pattern: 'yyyyMMdd',
      daysToKeep: 60,
      numBackups: 3,
      category: 'http',
      keepFileExt: true,
    },
    app: {
      type: 'dateFile',
      filename: `${baseLogPath}/app/app.log`,
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern: '["%d"] [%p] %c("pid":"%z") - %m ',
      },
      pattern: 'yyyyMMdd',
      daysToKeep: 60,
      maxLogSize: 10485760,
      numBackups: 3,
      keepFileExt: true,
    },
    sqlFile: {
      type: 'dateFile',
      filename: `${baseLogPath}/sql/sql.log`,
      alwaysIncludePattern: true,
      pattern: 'yyyyMMdd',
      daysToKeep: 60,
      numBackups: 3,
      keepFileExt: true, // 是否保留文件后缀
    },
    errorFile: {
      type: 'dateFile',
      filename: `${baseLogPath}/error/system/error.log`,
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern: '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}',
      },
      pattern: 'yyyyMMdd',
      daysToKeep: 60,
      maxLogSize: 10485760,
      numBackups: 3,
      keepFileExt: true,
    },
    errors: {
      type: 'logLevelFilter',
      level: 'ERROR',
      appender: 'errorFile',
    },
  },
  categories: {
    default: { appenders: ['out'], level: 'trace' },
    access: { appenders: ['access'], level: 'DEBUG' },
    response: { appenders: ['response'], level: 'DEBUG' },
    access_error: { appenders: ['access_error'], level: 'error' },
    response_error: { appenders: ['response_error'], level: 'error' },
    error: { appenders: ['errorFile'], level: 'error' },
    app: { appenders: ['app', 'out'], level: 'info' },
    sql: { appenders: ['sqlFile'], level: 'DEBUG' },
  },
  pm2: true, // 使用 pm2 来管理项目时,打开
  pm2InstanceVar: 'INSTANCE_ID', // 会根据 pm2 分配的 id 进行区分,以免各进程在写日志时造成冲突
};
// 日志级别
const LoggerLevel = {
  ALL: 'ALL',
  MARK: 'MARK',
  TRACE: 'TRACE',
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  FATAL: 'FATAL',
  OFF: 'OFF',
};
// 内容跟踪类
class ContextTrace {
  constructor(context, path, lineNumber, columnNumber) {
    this.context = context;
    this.path = path;
    this.lineNumber = lineNumber;
    this.columnNumber = columnNumber;
  }
}
log4js.addLayout('App', (logConfig) => {
  return (logEvent) => {
    let moduleName = '';
    let position = '';
    // 日志组装
    const messageList = [];
    logEvent.data.forEach((value) => {
      if (value instanceof ContextTrace) {
        moduleName = value.context;
        // 显示触发日志的坐标（行，列）
        if (value.lineNumber && value.columnNumber) {
          position = `${value.lineNumber}, ${value.columnNumber}`;
        }
        return;
      }

      if (typeof value !== 'string') {
        value = Util.inspect(value, false, 3, true);
      }

      messageList.push(value);
    });
    // 日志组成部分
    const messageOutput = messageList.join(' ');
    const positionOutput = position ? ` [${position}]` : '';
    const typeOutput = `[${logConfig.type}]  ${logEvent.pid.toString()}   - `;
    const dateOutput = `${dayjs(logEvent.startTime).format('YYYY-MM-DD HH:mm:ss')}`;

    const moduleOutput = moduleName ? `[${moduleName}] ` : '[LoggerService] ';
    let levelOutput = `[${logEvent.level}] ${messageList[0]}`;

    // 根据日志级别，用不同颜色区分
    switch (logEvent.level.toString()) {
      case LoggerLevel.DEBUG:
        levelOutput = chalk.green(levelOutput);
        break;
      case LoggerLevel.INFO:
        levelOutput = chalk.cyan(levelOutput);
        break;
      case LoggerLevel.WARN:
        levelOutput = chalk.yellow(levelOutput);
        break;
      case LoggerLevel.ERROR:
        levelOutput = chalk.red(levelOutput);
        break;
      case LoggerLevel.FATAL:
        levelOutput = chalk.hex('#DD4C35')(levelOutput);
        break;
      default:
        levelOutput = chalk.grey(levelOutput);
        break;
    }

    return `${chalk.green(typeOutput)}${dateOutput} ${chalk.yellow(
      moduleOutput,
    )}${levelOutput}${positionOutput}${chalk.green(messageList[1])}`;
  };
});
// 注入配置
log4js.configure(config);

// 实例化
const logger = log4js.getLogger();
logger.level = LoggerLevel.TRACE;
const Logger = {
  trace(...args) {
    logger.trace(Logger.getStackTrace(), ...args);
  },

  debug(...args) {
    logger.debug(Logger.getStackTrace(), ...args);
  },

  log(args) {
    logger.info(args);
  },

  info(...args) {
    logger.info(Logger.getStackTrace(), ...args);
  },

  warn(...args) {
    logger.warn(Logger.getStackTrace(), ...args);
  },

  warning(...args) {
    console.log(...args);
    logger.warn(Logger.getStackTrace(), ...args);
  },

  error(...args) {
    const loggerCustom = Log4js.getLogger('error');
    loggerCustom.error(Logger.getStackTrace(), ...args);
  },

  fatal(...args) {
    logger.fatal(Logger.getStackTrace(), ...args);
  },
  access(...args) {
    const loggerCustom = Log4js.getLogger('access');
    loggerCustom.info(Logger.getStackTrace(), ...args);
  },
  response(...args) {
    const loggerCustom = Log4js.getLogger('response');
    loggerCustom.info(Logger.getStackTrace(), ...args);
  },
  access_error(...args) {
    const loggerCustom = Log4js.getLogger('access_error');
    loggerCustom.error(Logger.getStackTrace(), ...args);
  },
  response_error(...args) {
    const loggerCustom = Log4js.getLogger('response_error');
    loggerCustom.error(Logger.getStackTrace(), ...args);
  },
  app(...args) {
    const loggerCustom = Log4js.getLogger('app');
    loggerCustom.info(Logger.getStackTrace(), ...args);
  },
  sql(...args) {
    const loggerCustom = Log4js.getLogger('sql');
    loggerCustom.info(Logger.getStackTrace(), args[0]);
  },

  // 日志追踪，可以追溯到哪个文件、第几行第几列
  getStackTrace(deep = 2) {
    const stackList = StackTrace.getSync();
    const stackInfo = stackList[deep];

    const lineNumber = stackInfo.lineNumber;
    const columnNumber = stackInfo.columnNumber;
    const fileName = stackInfo.fileName;
    const basename = path.basename(fileName);
    return `${basename}(line: ${lineNumber}, column: ${columnNumber}): \n`;
  },
};

exports.Logger = Logger;
