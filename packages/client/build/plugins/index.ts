import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import type { PluginOption } from 'vite'
import { unocssPlugin } from './modules/unocss'
import { autoImportPlugins } from './modules/autoImport'
import { VueDevToolsPlugin } from './modules/VueDevTools'

import { compressionPlugin } from './modules/compression'
import { visualizerPlugin } from './modules/visualizer'
import { legacyPlugin } from './modules/legacy'
import { optimizePlugins } from './modules/optimizer'
import { moveSourcemap } from './modules/moveSourcemap'

export function usePlugins(viteEnv: ViteEnv, isBuild: boolean): PluginOption[] {
  const { VITE_BUILD_GZIP, VITE_VISUALIZER, VITE_LEGACY, VITE_SOURCEMAP, VITE_SOURCEMAP_DIR } = viteEnv
  const plugins: PluginOption = [vue(), vueJsx()]
  // 生产环境和开发环境加载的插件
  plugins.push(
    unocssPlugin(),
    ...autoImportPlugins(),
  )
  // 开发环境加载的插件
  if (!isBuild) {
    plugins.push(VueDevToolsPlugin())
  }
  // 生产环境加载的插件
  if (isBuild) {
    plugins.push(...optimizePlugins(viteEnv))
    if (VITE_BUILD_GZIP) {
      plugins.push(compressionPlugin())
    }
    if (VITE_VISUALIZER) {
      plugins.push(visualizerPlugin())
    }
    if (VITE_LEGACY) {
      plugins.push(legacyPlugin())
    }
    if (VITE_SOURCEMAP) {
      plugins.push(moveSourcemap({ dirName: VITE_SOURCEMAP_DIR }))
    }
  }

  return plugins
}
