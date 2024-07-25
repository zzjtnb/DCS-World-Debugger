declare global {
  // interface obj {
  //   [key: string]: any
  // }
  type obj = Record<string, any>
  // interface Number {
  //   truncate: (decimalPlaces: number) => number
  // }
}
declare interface Window {
  loadingBar: import('naive-ui').LoadingBarProviderInst
  dialog: import('naive-ui').DialogProviderInst
  message: import('naive-ui').MessageProviderInst
  notification: import('naive-ui').NotificationProviderInst
}
