const Automate = require('sequelize-automate');
// Database options, is the same with sequelize constructor options.
const dbOptions = require('./sql');

// Automate options
const options = {
  type: 'js', // 指定 models代码风格
  camelCase: false, // Models文件中代码是否使用驼峰发命名
  fileNameCamelCase: false, // Model文件名是否使用驼峰法命名，默认文件名会使用表名，如 `user_post.js`；如果为 true，则文件名为 `userPost.js`
  dir: 'models/common', // 指定输出 models 文件的目录
  typesDir: 'models/common', // 指定输出 TypeScript 类型定义的文件目录，只有 TypeScript / Midway 等会有类型定义
  emptyDir: true, // 生成 models 之前是否清空 `dir` 以及 `typesDir`
  tables: null, // 指定生成哪些表的 models，如 ['user', 'user_post']；如果为 null，则忽略改属性
  skipTables: null, // 指定跳过哪些表的 models，如 ['user']；如果为 null，则忽略改属性
  tsNoCheck: false, // 是否添加 `@ts-nocheck` 注释到 models 文件中
  match: null // RegExp to match table name
}

const automate = new Automate(dbOptions, options);
(async function main() {
  // // get table definitions
  // const definitions = await automate.getDefinitions();//获取所有模型定义。sequelize-automate将使用这些定义生成不同的代码。
  // console.log(definitions);
  // or generate codes
  const code = await automate.run();//生成模型代码
  // console.log(code);
})()