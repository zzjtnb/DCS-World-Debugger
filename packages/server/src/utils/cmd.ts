import { exec } from 'child_process'
const cmd = process.platform === 'win32' ? 'netstat -ano' : 'ps aux'

export const killPort = (port: number) => {
  if (!port) return
  exec(cmd, (err, stdout, stderr) => {
    if (err) return console.log(err)
    stdout.split('\n').forEach((line) => {
      const p = line.trim().split(/\s+/)
      const address = p[1]
      if (address !== undefined) {
        if (address.split(':')[1] === port.toString()) {
          exec(`taskkill /F /pid ${p[4]}`, (err, stdout, stderr) => {
            if (err) return console.log('释放指定端口失败!', err)
            console.log('占用指定端口的程序被成功杀掉!')
          })
        }
      }
    })
  })
}
// killPort(3000)
