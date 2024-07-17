import { URL, fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'

import { customBuildOptions, customPlugins } from './build/custom'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    base: env.VITE_BASE_PATH || '/',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [
      vue({}),
      vueJsx(),
      VueDevTools(),
      ...customPlugins(mode),
    ],
    // 服务端渲染
    server: {
      // 是否开启 https
      // https: false,
      hmr: true,
      // 端口号
      port: 3000,
      host: '0.0.0.0',
      // proxy: {
      //   [env.VITE_BASE_API]: {
      //     target: env.VITE_BASE_API_TARGET,
      //     changeOrigin: true,
      //     rewrite: path => path.replace(new RegExp(`^${env.VITE_BASE_API}`), ''),
      //   },
      // },
    },
    // 配置esbuild
    esbuild: {
      // esbuild生产环境移除console和debugger
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
    build: {
      ...customBuildOptions(mode).build,
    },
  }
})
