import { exec } from 'node:child_process'

import { createInterface } from 'node:readline'

class PortManager {
  private readonly isWin: boolean
  private readonly cmd: string

  constructor() {
    this.isWin = process.platform === 'win32'
    this.cmd = this.isWin ? 'netstat -ano' : 'ps aux'
  }

  private logErr(msg: string, err?: any) {
    const errMsg = `${msg}: ${err ? err.message : ''}`
    console.error(errMsg)
  }

  public findPID(port: number): Promise<number | undefined> {
    return new Promise((resolve, reject) => {
      exec(this.cmd, (err, stdout, stderr) => {
        if (err) {
          this.logErr('执行命令时出错', err)
          reject(err)
          return
        }
        const lines = stdout.trim().split('\n')
        let pid: number | null
        lines.forEach((line) => {
          const fields = line.trim().split(/\s+/)
          const addr = fields[1]
          const procId = fields[this.isWin ? 4 : 1]

          if (addr && addr.split(':')[1] === port.toString()) {
            pid = +procId
          }
        })

        resolve(pid)
      })
    })
  }

  public killProcess(pid: number): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        process.kill(pid)
        resolve()
      }
      catch (error) {
        reject(error)
      }
    })
  }

  public async KillPort(port: number): Promise<void> {
    try {
      const pid = await this.findPID(port)
      if (!pid) {
        console.info(`未找到占用端口 ${port} 的进程.`)
        return
      }
      await this.confirmKill(pid)
    }
    catch (error) {
      console.error('处理端口时出错', error)
    }
  }

  public async KillPID(pid: number): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (!pid) {
          this.logErr('未提供进程 ID.')
          reject(new Error('未提供进程 ID.'))
          return
        }
        this.confirmKill(pid).then(resolve).catch(reject)
      }
      catch (error) {
        console.error('处理进程 ID 时出错', error)
      }
    })
  }

  private confirmKill(pid: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
      })

      rl.question(`确认终止 PID 为 ${pid} 的进程吗?(回车默认确认)(y/n): `, (ans: string) => {
        const trimAns = ans.trim().toLowerCase()
        if (trimAns === 'n') {
          console.info('未终止进程.')
          rl.close()
          resolve()
        }
        else {
          rl.close()
          this.killProcess(pid).then(resolve).catch(reject)
        }
      })

      rl.on('close', () => {
        this.killProcess(pid).then(resolve).catch(reject)
      })
    })
  }
}

// 示例使用
export const portManager = new PortManager()
// portManager.KillPort(3000); // 替换为你想要检查和终止的端口号
// portManager.KillPID('1234'); // 替换为你想要终止的进程 ID
