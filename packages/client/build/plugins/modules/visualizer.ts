import type { PluginOption } from 'vite'
// rollup打包分析插件
import { visualizer } from 'rollup-plugin-visualizer'

const filename = 'stats.html'
export function visualizerPlugin(): PluginOption {
  return visualizer({
    filename,
    open: true, // 如果存在本地服务端口,将在打包后自动展示
    gzipSize: true,
    brotliSize: true,
    // emitFile: false,
  })
}
