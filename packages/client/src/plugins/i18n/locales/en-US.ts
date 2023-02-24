export default {
  menu: {
    'home': 'Home',
    'debug': 'Debug',
    'mission': 'Mission',
    'test': 'Test',
    'zh-CN': 'Chinese',
    'en-US': 'English',
    'dark': 'Dark',
    'light': 'Light',
  },
  home: {
    title: 'DCS World Lua Debugger',
    info: `
    Script/Hooks folder in the server will be loaded and used for all tasks.<br>
    Execute DCS.isServer() or DCS.isMultiplayer() check in mission (task) will not take effect.<br>
    Also, trigger.action.outText() in Hooks will not take effect, only in mission (task) take effect.<br>`,
  },
  debug: {
    send: 'Send',
    clear: 'Clear',
    copy: 'Copy',
    status: 'Execution Status',
    state: 'Current Environment',
    auto: 'Auto Add',
  },
}
