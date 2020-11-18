export {}
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      HOST: string
      SERVER_PORT: number
      IS_LOG: boolean
    }
  }
}
