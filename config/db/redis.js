const env = process.env.NODE_ENV  // 环境变量
// 配置
let REDIS_CONF

// 为开发环境添加配置
if (env === 'development') {
  REDIS_CONF = {
    host: '127.0.0.1',
    port: 6379
  }
}

// 根据需要，为生产环境添加配置
if (env === 'production') {
  REDIS_CONF = {
    host: '127.0.0.1',
    port: 6379
  }
}

module.exports = {
  REDIS_CONF
}