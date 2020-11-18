import path from 'node:path'
import { styleText } from 'node:util'
import type { LogType } from 'types/log'

const color = ['black', 'blackBright', 'blue', 'blueBright', 'cyan', 'cyanBright', 'gray', 'green', 'greenBright', 'grey', 'magenta', 'magentaBright', 'red', 'redBright', 'white', 'whiteBright', 'yellow', 'yellowBright']

console.log(
  styleText(['underline', 'italic'], 'My italic underlined message'),
)
console.log(
  styleText(['red', 'green'], 'text'), // green
)

class log {
  constructor() {

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

  static log(type: LogType, color: ForegroundColors, args) {
    const basename = this.getBasename()
    console.log(`${chalk.green(`[${type}] ${basename}`)} - ${this.getStackTrace()} ${args}`)
  }

  static trace(...args) {
    this.log('trace', ...args)
  }

  static debug(...args) {
    this.log('debug', ...args)
  }

  static info(...args) {
    this.log('info', ...args)
  }

  static warn(...args) {
    this.log('warn', ...args)
  }

  static error(...args) {
    this.log('error', ...args)
  }
}

export default log
