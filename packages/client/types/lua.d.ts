namespace lua {
  export type runType = 'dostring_in' | 'loadstring'
  export interface net {
    state: 'gui' | 'server' | 'mission' | 'net' | 'export' | 'config' | 'lua'
  }
  export interface received {
    type: 'debug' | 'message'
    status: boolean | undefined
    // data: Record<string, any> | string
    data: string
  }
  export interface state {
    state: lua.net['state']
    loading: boolean
    show: {
      received: boolean
      codemirror: boolean
    }
    codemirror: {
      code: string
      view: EditorView
      disabled: boolean
      indentWithTab: boolean
      tabSize: number
      autofocus: boolean
      language: string
      theme: string
      style: {
        fontFamily: string
        fontSize: string
        height: string
      }
    }
    received: lua.received
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
