export default {
  menu: {
    'home': '首页',
    'debug': '调试',
    'mission': '任务',
    'test': '测试',
    'link': '相关链接',
    'zh-CN': '简体中文',
    'en-US': 'English',
    'dark': '暗黑',
    'light': '亮色',
  },
  home: {
    title: 'DCS World Lua调试工具',
    info: `Script/Hooks目录下的脚本在服务器启动时加载,并将用于所有任务.\n
    执行 DCS.isServer() 或 DCS.isMultiplayer() 检查在mission(任务)中不起作用.\n
    另外,trigger.action.outText() 在Hooks中不起作用,仅在任务中起作用.\n`,
  },
  debug: {
    send: '发送',
    clear: '清空',
    copy: '复制',
    status: '执行状态',
    state: '当前运行环境',
    auto: '自动添加',
  },
  toolbar: {
    language: '语言',
    theme: '主题',
    disabled: '禁用编辑',
    indentWithTab: 'Tab 缩进',
    tabSize: 'Tab 宽度',
    autofocus: '自动获取焦点',
    height: '高度',
  },
  placeholder: {
    search: '搜索',
    code: '请输入脚本代码',
  },
  mission: {
    upload: '点击或者拖动文件到该区域来上传',
    support: '支持以.zip或者.miz结尾的任务文件',
    desc: '用于获取miz文件当中的lua',
    name: '当前任务名称',
    download: '下载Lua',
  },
}
