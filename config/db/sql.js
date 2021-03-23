const { sqlLog } = require('../../middleware/logger')
const common = {
  dialect: "mysql", //指定要连接哪种类型的数据库
  charset: "utf8mb4",//字符集
  collate: "utf8mb4_general_ci",//排序规则
  timezone: '+08:00',   // 时区,sequelize有很多自动时间的方法，都是和时区相关的，记得设置成东8区（+08:00）
  // 连接池
  pool: {
    max: 90,
    min: 0,
    idle: 1000, //最长空置时间（毫秒），超时后释放连接
    acquire: 3000 //连接池尝试连接最长时间（毫秒），超过抛出异常
  },
  // 数据表相关的全局配置(为模型定义默认选项)
  define: {
    // 禁止修改表名
    // 默认情况下，sequelize 会自动将所有传递的模型名称转换为复数形式
    freezeTableName: true,
    // 是否自动进行下划线转换（这里是因为DB默认的命名规则是下划线方式，而我们使用的大多数是驼峰方式）
    underscored: true,
    // 是否为表添加 createdAt 和 updatedAt 字段
    // createdAt 记录表的创建时间
    // updatedAt 记录字段更新时间
    timestamps: false,
    // createdAt: 'created_at',
    // updatedAt: 'updated_at',
    // 是否为表添加 deletedAt 字段
    // 默认情况下, destroy() 方法会删除数据，
    // 设置 paranoid 为 true 时，将会更新 deletedAt 字段，并不会真实删除数据。
    paranoid: false
  },
  //如果选择log.logger.info,会有Cannot read property 'isLevelEnabled' of null的异常。
  logging: sqlLog,
}
let dbOptions = {}
const env = process.env.NODE_ENV;

if (env === 'developent') {
  const dev = {
    host: 'localhost',//数据库主机
    port: 3306,//数据库端口号
    username: 'root',//用户名
    password: 'root',//密码
    database: 'dcs world', //打开哪个数据库
  }
  dbOptions = Object.assign(dev, common)
}
if (env === 'production') {
  const prod = {
    host: 'localhost',//数据库主机
    port: 3306,//数据库端口号
    username: 'root',//用户名
    password: 'root',//密码
    database: 'dcs world', //打开哪个数据库
  }
  dbOptions = Object.assign(prod, common)
}
module.exports = dbOptions