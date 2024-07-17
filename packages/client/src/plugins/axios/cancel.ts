import type { AxiosRequestConfig } from 'axios'

export class AxiosCancel {
  pendingMap: Map<string, AbortController>
  constructor() {
    this.pendingMap = new Map<string, AbortController>()
  }

  generateKey(config: AxiosRequestConfig): string {
    const { method, url } = config
    return [url || '', method || ''].join('&')
  }

  addPending(config: AxiosRequestConfig) {
    this.removePending(config)
    const key: string = this.generateKey(config)
    if (!this.pendingMap.has(key)) {
      const controller = new AbortController()
      config.signal = controller.signal
      this.pendingMap.set(key, controller)
    }
    else {
      config.signal = (this.pendingMap.get(key) as AbortController).signal
    }
  }

  removePending(config: AxiosRequestConfig) {
    const key: string = this.generateKey(config)
    if (this.pendingMap.has(key)) {
      (this.pendingMap.get(key) as AbortController).abort()
      this.pendingMap.delete(key)
    }
  }

  removeAllPending() {
    this.pendingMap.forEach((cancel: AbortController) => {
      cancel.abort()
    })
    this.reset()
  }

  reset() {
    this.pendingMap = new Map<string, AbortController>()
  }
}
