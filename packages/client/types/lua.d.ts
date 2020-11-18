namespace lua {
  export type runType = 'dostring_in' | 'loadstring'
  export interface net {
    state: 'gui' | 'server' | 'mission' | 'net' | 'export' | 'config'
  }

  export interface state {
    state: lua.net['state']
    code: string
    view: EditorView
    loading: boolean
    received: {
      type: 'debug' | 'message'
      status: boolean
      message?: string
      data: Record<string, any> | string
    }
  }

  export interface request {
    type: 'debug'
    payload: {
      type: runType
      content: string
      state?: lua.net['state']
    }
  }
}
