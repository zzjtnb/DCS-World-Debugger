const { sequelize } = require('./index');
// const options = { force: true, logging: console.log } //清空表
const options = { alter: true, logging: console.log }//不会清空表
sequelize.sync(options).then((res, err) => {
  console.log("所有模型均已成功同步.");
  process.exit();
});
sequelize.sync(options)