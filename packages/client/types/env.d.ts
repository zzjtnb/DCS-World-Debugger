/// <reference types="vite/client" />

// declare module '*.vue' {
//   import type { DefineComponent } from 'vue'

//   const component: DefineComponent<{}, {}, any>
//   export default component
// }
declare module '~icons/*' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, unknown, unknown>
  export default component
}

// * Vite
declare type Recordable<T = any> = Record<string, T>

declare interface IModuleType {
  default: Array<RouteRecordRaw> | RouteRecordRaw
}

declare interface ImportMetaEnv {
  readonly VITE_PORT: number
  readonly VITE_IS_PROXY: boolean
  readonly VITE_APP_TITLE: string
  readonly VITE_BASE_URL: string
  readonly VITE_API_URL: string

  readonly VITE_CHECK: boolean
  readonly VITE_BUILD_GZIP: boolean
  readonly VITE_LEGACY: boolean
  // 更多环境变量...
  // VITE_OPEN: boolean
  // VITE_GLOB_APP_TITLE: string
  // VITE_DROP_CONSOLE: boolean
  // VITE_PROXY_URL: string
  // VITE_BUILD_GZIP: boolean
  // VITE_REPORT: boolean
}
declare interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare interface ViteEnv extends ImportMetaEnv {}
