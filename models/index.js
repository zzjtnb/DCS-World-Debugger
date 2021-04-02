const db = {};
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const dbConfig = require('../config/db/sql')
const modelsPath = path.join(__dirname, 'common')
const { Sequelize, DataTypes, Op } = require('sequelize');
const { db_err_sql, log4js } = require('../middleware/logger.js')
const logger = log4js.getLogger('models/index.js');

/**
 * 连接到数据库的示例对象
 */
const sequelize = new Sequelize(dbConfig);
testConnect = async () => {
  try {
    await sequelize.authenticate();
    // console.log('Connection has been established successfully.');
  } catch (error) {
    db_err_sql.error(error)
    logger.error("数据库连接失败")
    // console.error('Unable to connect to the database:', error);
  }
}
testConnect()
fs.readdirSync(modelsPath)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(modelsPath, file))(sequelize, DataTypes)
    db[model.name] = model;
  });
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Op = Op
module.exports = db;