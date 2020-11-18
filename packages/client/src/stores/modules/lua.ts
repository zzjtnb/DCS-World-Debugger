import { isObject } from '@vueuse/core'

export const useLuaStore = defineStore({
  id: 'lua',
  state: (): lua.state => ({
    state: 'gui',
    code: '',
    view: null,
    loading: false,
    received: {
      type: 'message',
      status: true,
      message: '',
      data: '',
    },

  }),
  actions: {
    resetCode() {
      this.code = ''
    },
    resetReceived() {
      this.received = {
        type: 'message',
        status: true,
        message: '',
        data: '',
      }
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
