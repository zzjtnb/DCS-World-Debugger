/**
 * 自定义格式化规则
 */
module.exports = {
  //此处可以配置文件夹和文件类型的范围
  '*.{js,ts,cjs,vue,html,md}': [
    // 使用eslint进行自动修复
    'eslint --fix',
    //用于将自动修复后改变的文件添加到暂存区
    // 'git add --a',
    'git add .',
  ],
  '*.{css|scss|vue|html}': [
    //使用stylelint格式化css样式
    'stylelint --fix',
    //用于将自动修复后改变的文件添加到暂存区
    // 'git add --a',
    'git add .',
  ],
};
