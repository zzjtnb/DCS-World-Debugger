import type { PluginOption } from 'vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export function optimizePlugins(viteEnv: ViteEnv): PluginOption[] {
  return [
    ViteImageOptimizer(),
  ]
}
