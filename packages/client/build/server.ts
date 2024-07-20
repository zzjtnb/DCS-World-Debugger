import type { ServerOptions } from 'vite'

export function useServer(viteEnv: ViteEnv): ServerOptions {
  const options: ServerOptions = {
    host: '0.0.0.0', // 监听所有公共ip
    port: viteEnv.VITE_PORT, // 端口号
    cors: true, // 允许跨域
    hmr: true, // 配置 HMR 连接
    // https: false, // 是否开启 https
    proxy: {},
  }
  if (viteEnv.VITE_IS_PROXY) {
    options.proxy = {
      [viteEnv.VITE_BASE_URL]: {
        target: viteEnv.VITE_API_URL,
        changeOrigin: true,
        rewrite: (path: string) => path.replace(new RegExp(`^${viteEnv.VITE_BASE_URL}`), ''),
      },
    }
  }
  return options
}
