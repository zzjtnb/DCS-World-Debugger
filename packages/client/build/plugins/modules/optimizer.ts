import type { PluginOption } from 'vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export function optimizePlugins(viteEnv: ViteEnv): PluginOption[] {
  return [
    ViteImageOptimizer(),
    // {
    //   // svg 优化
    //   svg: {
    //     plugins: [
    //       {
    //         name: 'removeViewBox',
    //       },
    //       {
    //         name: 'removeEmptyAttrs',
    //       },
    //     ],
    //   },
    // }
  ]
}
