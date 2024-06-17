import { isObject } from '@vueuse/core'

export const useLuaStore = defineStore({
  id: 'lua',
  state: (): lua.state => ({
    state: 'gui',
    loading: false,
    show: {
      received: true,
      codemirror: true,
    },
    codemirror: {
      code: '',
      view: null,
      disabled: false,
      indentWithTab: true,
      tabSize: 2,
      autofocus: true,
      language: 'lua',
      theme: 'oneDark',
      style: {
        fontFamily: 'font-mono',
        fontSize: '16px',
        height: 'auto',
      },
    },
    received: {
      type: 'message',
      status: true,
      data: '',
    },

  }),
  actions: {
    resetCode() {
      this.codemirror.code = ''
    },
    resetReceived() {
      this.received = {
        type: 'message',
        status: undefined,
        data: '',
      }
      this.loading = false
    },
  },
  getters: {
    alertType: (state) => {
      const status = state.received.status
      if (status === undefined)
        return 'default'
      return status ? 'success' : 'error'
    },
    getReceived: ({ received }): string => {
      if (received.type === 'message')
        return ''
      let code = received.data
      if (!code)
        return ''
      if (isObject(code)) {
        code = JSON.stringify(code, null, 2)
      }
      else {
        try {
          code = JSON.stringify(JSON.parse(code), null, 2)
        }
        catch (error) {}
      }
      return code
    },
  },
})
