import { createServer } from 'node:http'
import { env } from 'node:process'
import path from 'node:path'
import express from 'express'
import cors from 'cors'
import socketIO from './lib'

const app = express()
app.use(cors())
app.use(express.json())
// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.send('Hello World!')
})
// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).json({ code: 404, message: '路径不存在' })
  next()
})

// error handle
app.use((err, req, res, next) => {
  if (req.xhr) {
    return res.json({
      state: false,
      message: err.message,
    })
  }
  next(err)
})

async function createHttpServer() {
  const httpServer = createServer(app)
  socketIO.initIO(httpServer)
  await socketIO.initServer()

  const HTTP_PORT = env.HTTP_PORT || 4000
  httpServer.listen(HTTP_PORT, () => {
    const msg = `App runing on http://localhost:${HTTP_PORT}\n`
    console.log(msg)
  })
}
createHttpServer()
// 处理未处理的 Promise reject
process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的拒绝:', reason)
  // 记录日志、发送告警等
})

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error)
  // 记录日志、发送告警等
  // 通常，您希望在捕获到未捕获的异常后优雅地关闭服务器
  // process.exit(1);
})
