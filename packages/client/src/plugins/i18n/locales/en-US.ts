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
    Script/Hooks folder in the server will be loaded and used for all tasks.\n
    Execute DCS.isServer() or DCS.isMultiplayer() check in mission (task) will not take effect.\n
    Also, trigger.action.outText() in Hooks will not take effect, only in mission (task) take effect.`,
  },
  debug: {
    send: 'Send',
    clear: 'Clear',
    copy: 'Copy',
    status: 'Execution Status',
    state: 'Current Environment',
    auto: 'Auto Add',
  },
  toolbar: {
    language: 'Language',
    theme: 'Theme',
    disabled: 'Disable Edit',
    indentWithTab: 'Tab Indent',
    tabSize: 'Tab Size',
    autofocus: 'Auto Focus',
    height: 'Height',
  },
  placeholder: {
    search: 'Search',
    code: 'Enter script code',
  },
  mission: {
    upload: 'Click or drag file to this area to upload',
    support: 'Support .zip or .miz file',
    desc: 'Used to get lua from miz file',
    name: 'Current mission name',
    download: 'Download Lua',
  },
}
