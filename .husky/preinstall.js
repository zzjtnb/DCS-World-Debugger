// "preinstall": "node .husky/preinstall.js"
// "preinstall": "npx only-allow pnpm"
if (!/pnpm/.test(process.env.npm_execpath || '')) {
  console.log(`\x1B[36;1m 此存储库需要使用\x1B[32;1m pnpm \x1B[0m\x1B[36;1m作为包管理器` + `才能使脚本正常工作.\n 如果您没有pnpm,请通过"\x1B[31;1mnpm i -g pnpm\x1B[0m\x1B[36;1m"安装它.\n 有关更多详细信息,请访问 https://pnpm.js.org\x1B[0m`)
  process.exit(1)
}
