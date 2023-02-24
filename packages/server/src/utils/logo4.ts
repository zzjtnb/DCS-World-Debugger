import path from 'path'
import util from 'util'
import log4js from 'log4js'
import dayjs from 'dayjs'
import chalk from 'chalk'
import stackTrace from 'stacktrace-js'
import log4jsConfig from '../config/log4js'

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
}
class ContextTrace {
  context: any
  path: any
  lineNumber: any
  columnNumber: any
  constructor(context: any, path: any, lineNumber: any, columnNumber: any) {
    this.context = context
    this.path = path
    this.lineNumber = lineNumber
    this.columnNumber = columnNumber
  }
}

log4js.addLayout('App', (logConfig) => {
  return (logEvent) => {
    let moduleName = ''
    let position = ''
    const messageList: any[] = []
    logEvent.data.forEach((value) => {
      if (value instanceof ContextTrace) {
        moduleName = value.context
        if (value.lineNumber && value.columnNumber)
          position = `${value.lineNumber}, ${value.columnNumber}`

        return
      }
      if (typeof value !== 'string')
        value = util.inspect(value, false, 3, true)

      messageList.push(value)
    })
    const messageOutput = messageList.join(' ')
    const positionOutput = position ? ` [${position}]` : ''
    const typeOutput = `[${logConfig.type}]  ${logEvent.pid.toString()}   - `
    const dateOutput = `${dayjs(logEvent.startTime).format('YYYY-MM-DD HH:mm:ss')}`
    const moduleOutput = moduleName ? `[${moduleName}] ` : '[LoggerService] '
    let levelOutput = `[${logEvent.level}] ${messageList[0]}`

    switch (logEvent.level.toString()) {
      case LoggerLevel.DEBUG:
        levelOutput = chalk.green(levelOutput)
        break
      case LoggerLevel.INFO:
        levelOutput = chalk.cyan(levelOutput)
        break
      case LoggerLevel.WARN:
        levelOutput = chalk.yellow(levelOutput)
        break
      case LoggerLevel.ERROR:
        levelOutput = chalk.red(levelOutput)
        break
      case LoggerLevel.FATAL:
        levelOutput = chalk.hex('#DD4C35')(levelOutput)
        break
      default:
        levelOutput = chalk.grey(levelOutput)
        break
    }
    return `${chalk.green(typeOutput)}${dateOutput}       ${chalk.yellow(moduleOutput)}${levelOutput}${positionOutput}\n${chalk.green(messageList[1])}\n`
  }
})
log4js.configure(log4jsConfig)
const logger = log4js.getLogger()
logger.level = LoggerLevel.TRACE
class Logger {
  static trace(...args: any[]) {
    logger.trace(Logger.getstackTrace(), ...args)
  }

  static debug(...args: any[]) {
    logger.debug(Logger.getstackTrace(), ...args)
  }

  static log(args: any) {
    const basename = Logger.getBasename()
    const time = dayjs().format('YYYY-MM-DD HH:mm:ss')
    console.log(`${chalk.green(`[${time}] [INFO] ${basename}`)} - ${args}`)
  }

  static info(...args: any[]) {
    logger.info(Logger.getstackTrace(), ...args)
  }

  static warn(...args: any[]) {
    logger.warn(Logger.getstackTrace(), ...args)
  }

  static warning(...args: any[]) {
    logger.warn(Logger.getstackTrace(), ...args)
  }

  static error(...args: any[]) {
    const loggerCustom = log4js.getLogger('error')
    loggerCustom.error(Logger.getstackTrace(), ...args)
  }

  static fatal(...args: any[]) {
    logger.fatal(Logger.getstackTrace(), ...args)
  }

  static access(...args: any[]) {
    const loggerCustom = log4js.getLogger('access')
    loggerCustom.info(Logger.getstackTrace(), ...args)
  }

  static response(...args: any[]) {
    const loggerCustom = log4js.getLogger('response')
    loggerCustom.info(Logger.getstackTrace(), ...args)
  }

  static access_error(...args: any[]) {
    const loggerCustom = log4js.getLogger('access_error')
    loggerCustom.error(Logger.getstackTrace(), ...args)
  }

  static response_error(...args: any[]) {
    const loggerCustom = log4js.getLogger('response_error')
    loggerCustom.error(Logger.getstackTrace(), ...args)
  }

  static getstackTrace(deep = 2) {
    const stackList = stackTrace.getSync()
    const stackInfo = stackList[deep]
    const lineNumber = stackInfo.lineNumber
    const columnNumber = stackInfo.columnNumber
    const fileName = stackInfo.fileName
    const basename = path.basename(fileName || '')
    return `${basename}(line: ${lineNumber}, column: ${columnNumber}): \n`
  }

  static getBasename(deep = 2) {
    const stackList = stackTrace.getSync()
    const stackInfo = stackList[deep]
    const fileName = stackInfo.fileName
    const basename = path.basename(fileName || '')
    return basename
  }
}
export {
  Logger,
}
