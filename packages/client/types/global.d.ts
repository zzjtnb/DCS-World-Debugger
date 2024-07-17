declare global {
  // vue
  declare type PropType<T> = VuePropType<T>
  declare type VueNode = VNodeChild | JSX.Element

  export type Writable<T> = {
    -readonly [P in keyof T]: T[P];
  }
  declare type Nullable<T> = T | null
  declare type NonNullable<T> = T extends null | undefined ? never : T
  declare type Recordable<T = any> = Record<string, T>
  declare interface ReadonlyRecordable<T = any> {
    readonly [key: string]: T
  }
  declare type TimeoutHandle = ReturnType<typeof setTimeout>
  declare type IntervalHandle = ReturnType<typeof setInterval>

  declare interface ChangeEvent extends Event {
    target: HTMLInputElement
  }

  interface ImportMetaEnv extends ViteEnv {
    __: unknown
  }
  interface anyObj { [key: string]: any }

  declare function parseInt(s: string | number, radix?: number): number

  declare function parseFloat(string: string | number): number

}
interface IModuleType {
  default: Array<RouteRecordRaw> | RouteRecordRaw
}
interface Window {
  loadingBar: import('naive-ui').LoadingBarProviderInst
  dialog: import('naive-ui').DialogProviderInst
  message: import('naive-ui').MessageProviderInst
  notification: import('naive-ui').NotificationProviderInst
}
