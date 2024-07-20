import type { PluginOption } from 'vite'
import VueDevTools from 'vite-plugin-vue-devtools'

export const VueDevToolsPlugin = (): PluginOption => VueDevTools()

// https://github.com/antfu/vite-plugin-inspect
// Visit http://localhost:3000/__inspect/ to see the inspector
// import Inspect from 'vite-plugin-inspect'
// Inspect(),
