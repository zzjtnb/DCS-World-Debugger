export default {
  menu: {
    'home': '首页',
    'debug': '调试',
    'mission': '任务',
    'test': '测试',
    'zh-CN': '简体中文',
    'en-US': 'English',
    'dark': '暗黑',
    'light': '亮色',
  },
  home: {
    title: 'DCS World Lua调试工具',
    info: `Script/Hooks目录下的脚本在服务器启动时加载,并将用于所有任务.<br>
    执行 DCS.isServer() 或 DCS.isMultiplayer() 检查在mission(任务)中不起作用.<br>
    另外,trigger.action.outText() 在Hooks中不起作用,仅在任务中起作用.<br>`,
  },
  debug: {
    send: '发送',
    clear: '清空',
    copy: '复制',
    status: '执行状态',
    state: '当前运行环境',
    auto: '自动添加',
  },
}
