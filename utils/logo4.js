'use strict';

const path = require('path');
const log4js = require('log4js');
const util = require('util');
const dayjs = require('dayjs');
const stackTrace = require('stackTrace-js');
const chalk = require('chalk');
const log4jsConfig = require('../config/log4js');

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
class ContextTrace {
  constructor(context, path, lineNumber, columnNumber) {
    this.context = context;
    this.path = path;
    this.lineNumber = lineNumber;
    this.columnNumber = columnNumber;
  }
}
exports.ContextTrace = ContextTrace;
log4js.addLayout('App', (logConfig) => {
  return (logEvent) => {
    let moduleName = '';
    let position = '';
    const messageList = [];
    logEvent.data.forEach((value) => {
      if (value instanceof ContextTrace) {
        moduleName = value.context;
        if (value.lineNumber && value.columnNumber) {
          position = `${value.lineNumber}, ${value.columnNumber}`;
        }
        return;
      }
      if (typeof value !== 'string') {
        value = util.inspect(value, false, 3, true);
      }
      messageList.push(value);
    });
    const messageOutput = messageList.join(' ');
    const positionOutput = position ? ` [${position}]` : '';
    const typeOutput = `[${logConfig.type}]  ${logEvent.pid.toString()}   - `;
    const dateOutput = `${dayjs(logEvent.startTime).format('YYYY-MM-DD HH:mm:ss')}`;
    const moduleOutput = moduleName ? `[${moduleName}] ` : '[LoggerService] ';
    let levelOutput = `[${logEvent.level}] ${messageList[0]}`;

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
    return `${chalk.green(typeOutput)}${dateOutput}       ${chalk.yellow(
      moduleOutput,
    )}${levelOutput}${positionOutput}\n${chalk.green(messageList[1])}\n`;
  };
});
log4js.configure(log4jsConfig.default);
const logger = log4js.getLogger();
logger.level = LoggerLevel.TRACE;
class Logger {
  static trace(...args) {
    logger.trace(Logger.getstackTrace(), ...args);
  }
  static debug(...args) {
    logger.debug(Logger.getstackTrace(), ...args);
  }
  static log(args) {
    const basename = Logger.getBasename();
    const time = dayjs().format('YYYY-MM-DD HH:mm:ss');
    console.log(`${chalk.green(`[${time}] [INFO] ${basename}`)} - ${args}`);
  }
  static info(...args) {
    logger.info(Logger.getstackTrace(), ...args);
  }
  static warn(...args) {
    logger.warn(Logger.getstackTrace(), ...args);
  }
  static warning(...args) {
    logger.warn(Logger.getstackTrace(), ...args);
  }
  static error(...args) {
    const loggerCustom = log4js.getLogger('error');
    loggerCustom.error(Logger.getstackTrace(), ...args);
  }
  static fatal(...args) {
    logger.fatal(Logger.getstackTrace(), ...args);
  }
  static access(...args) {
    const loggerCustom = log4js.getLogger('access');
    loggerCustom.info(Logger.getstackTrace(), ...args);
  }
  static response(...args) {
    const loggerCustom = log4js.getLogger('response');
    loggerCustom.info(Logger.getstackTrace(), ...args);
  }
  static access_error(...args) {
    const loggerCustom = log4js.getLogger('access_error');
    loggerCustom.error(Logger.getstackTrace(), ...args);
  }
  static response_error(...args) {
    const loggerCustom = log4js.getLogger('response_error');
    loggerCustom.error(Logger.getstackTrace(), ...args);
  }

  static sql(...args) {
    const loggerCustom = log4js.getLogger('sql');
    loggerCustom.info(Logger.getstackTrace(), args[0]);
  }
  static getstackTrace(deep = 2) {
    const stackList = stackTrace.getSync();
    const stackInfo = stackList[deep];
    const lineNumber = stackInfo.lineNumber;
    const columnNumber = stackInfo.columnNumber;
    const fileName = stackInfo.fileName;
    const basename = path.basename(fileName);
    return `${basename}(line: ${lineNumber}, column: ${columnNumber}): \n`;
  }
  static getBasename(deep = 2) {
    const stackList = stackTrace.getSync();
    const stackInfo = stackList[deep];
    const lineNumber = stackInfo.lineNumber;
    const columnNumber = stackInfo.columnNumber;
    const fileName = stackInfo.fileName;
    const basename = path.basename(fileName);
    return basename;
  }
}
exports.Logger = Logger;
