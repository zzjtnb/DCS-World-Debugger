/// <reference types="vite/client" />

// declare module '*.vue' {
//   import type { DefineComponent } from 'vue'

//   const component: DefineComponent<object, unknown, unknown>
//   export default component
// }

declare module '~icons/*' {
  import type { FunctionalComponent, SVGAttributes } from 'vue'

  const component: FunctionalComponent<SVGAttributes>
  export default component
}

// * Vite
declare type Recordable<T = any> = Record<string, T>

declare interface IModuleType {
  default: Array<RouteRecordRaw> | RouteRecordRaw
}

declare interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // 是否开启代理跨域
  readonly VITE_IS_PROXY: boolean
  // 端口号
  readonly VITE_PORT: number
  // 代理前缀
  readonly VITE_BASE_URL: string
  // 代理地址
  readonly VITE_API_URL: string
  // 打包代码分离检查
  readonly VITE_CHECK: boolean
  // 代码压缩
  readonly VITE_BUILD_GZIP: boolean
  // 代码兼容性
  readonly VITE_LEGACY: boolean
  // 使用代码分析
  readonly VITE_VISUALIZER: boolean
  // 打包添加sourcemap
  readonly VITE_SOURCEMAP: boolean
  // sourcemap存放目录 相对于 dist 目录
  readonly VITE_SOURCEMAP_DIR: string
  // 更多环境变量...

}
declare interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare interface ViteEnv extends ImportMetaEnv {}
