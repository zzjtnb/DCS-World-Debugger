/**
 * 自定义格式化规则
 */
module.exports = {
  '*.{js,ts,cjs,mjs,vue,html,md,json,jsonc,yaml}': ['eslint --fix'],
  '*.{css,scss,vue,html,xml,svelte,astro,php}': ['stylelint --fix'],
}
