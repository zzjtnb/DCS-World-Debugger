namespace lua {
  export type runType = 'dostring_in' | 'loadstring'
  export interface net {
    state: 'gui' | 'server' | 'mission' | 'net' | 'export' | 'config'
  }

  export interface state {
    state: lua.net['state']
    loading: boolean
    codemirror: {
      show: boolean
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
    received: {
      type: 'debug' | 'message'
      status: boolean
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
