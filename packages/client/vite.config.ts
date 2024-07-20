import { URL, fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import { wrapperEnv } from './build/utils'
import { useBuild } from './build/build'
import { useServer } from './build/server'
import { usePlugins } from './build/plugins'

// https://vitejs.dev/config/
// https:// cn.vitejs.dev/config/#conditional-config
export default defineConfig(({ command, mode }) => {
  // command 指令 server | build
  // mode 模式 默认 development | production
  // 模式
  const isBuild = command === 'build'
  // 获取当前文件夹
  const root = process.cwd()
  // 读取 VITE_ 开头的环境变量
  const env = loadEnv(mode, root)
  // 环境变量值转换
  const viteEnv = wrapperEnv(env)

  return {
    base: env.VITE_BASE_PATH || '/',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    // 服务端渲染
    server: useServer(viteEnv),
    plugins: usePlugins(viteEnv, isBuild),
    // 配置esbuild
    esbuild: {
      // esbuild生产环境移除console和debugger
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
    build: useBuild(viteEnv),
  }
})
