export const luaValue = ref('return net.get_player_list()')

export const received: anyObj = ref()
export const showLoading = ref(false)
export const autoFill = ref(true)
export function sendLua(flag: Boolean, model?: string) {
  const luaData: { [key: string]: any } = {
    type: flag ? 'dostring_in' : 'loadstring',
    content: luaValue.value,
  }
  if (flag) luaData.env = model
  sendMessage('debuggerLua', luaData)
  showLoading.value = true
  received.value = {}
}
export const alertType = computed(() => {
  if (received.value?.status === undefined) return 'default'
  showLoading.value = false
  return received.value.status ? 'success' : 'error'
})
export const resultJSON = computed(() => {
  if (!received.value?.result) return
  let code = received.value.result
  if (['boolean', 'number'].includes(typeof code))
    return code.toString()

  if (typeof code === 'object') {
    try {
      code = JSON.stringify(code, null, 4)
    }
    catch (error) {
      code = received.value.result
    }
  }
  if (typeof code === 'string') {
    try {
      code = JSON.stringify(JSON.parse(code), null, 4)
    }
    catch (error) {
      code = received.value.result
    }
  }
  return code
})

// describe
export const netLua = reactive({
  server: {
    code: `local JSON = require('JSON')
local keys = {}
for k, v in pairs(_G) do
  table.insert(keys, k)
end
return JSON:encode(keys)`,
    describe: `--多人游戏模式才能使用(仅服务器)
--既可以运行mission->evn.*()环境的脚本
--也可以运行server->net.*()|DCS.*()的函数
-- (holds the current mission when multiplayer? server only)
--return DCS.getRealTime()
--env.info('测试LUA')
local JSON = require('JSON')
local res = {}
res.name = {}
res.id = {}
for i, tb in pairs(world.getAirbases()) do
  res.id[i] = Object.getName(tb)
  res.name[i] = tb:getName()
end
return JSON:encode(res)`,
    link: {
      title: 'List of scripting engine functions',
      url: 'https://wiki.hoggitworld.com/index.php?title=Category:Scripting',
    },
  },
  mission: {
    code: 'a_do_script("trigger.action.outText(\'加载成功(mission)\', 10 , false)")',
    describe: `--当前运行的任务(holds current mission)
--无法使用DCS.*()
--可以使用env.*()|net.*()
--code1
a_do_script("trigger.action.outText('加载成功(mission)', 10 , false)")
--code2
return '哈哈'
`,
    link: {
      title: 'Mission Scripting Foundation Documentation',
      url: 'https://wiki.hoggitworld.com/view/Mission_Scripting_Foundation_Documentation',
    },
  },
  net: {
    code: 'net.log(\'测试LUA\')',
    describe: `-- The net singleton are a number of functions from the network API
-- that work in the mission scripting environment
-- 这个功能有限
net.load_mission(lfs.writeDir() .. 'Missions\\' .. 'MyTotallyAwesomeMission.miz'
`,
    link: {
      title: 'DCS singleton net',
      url: 'https://wiki.hoggitworld.com/view/DCS_singleton_net',
    },
  },
  export: {
    code: `local JSON = loadfile('Scripts/JSON.lua')()
local keys = {}
for k, v in pairs(_G) do
  table.insert(keys, k)
end
print(keys)
return JSON:encode(keys)
`,
    describe: `-- 运行保存的游戏目录下/Scripts/Export.lua和相关的导出API
-- runs $WRITE_DIR/Scripts/Export.lua and the relevant export API
local t = LoGetModelTime()
local name = LoGetPilotName()
return string.format('t = %.2f, name = %s, t, name)
`,
    link: {
      title: 'DCS Export Script',
      url: 'https://wiki.hoggitworld.com/view/DCS_Export_Script',
    },
  },
  config: {
    code: `local JSON = loadfile('Scripts/JSON.lua')()
local keys = {}
for k, v in pairs(_G) do
  table.insert(keys, k)
end
return JSON:encode(keys)
`,
    describe: `-- 游戏安装目录下/Config/main.cfg的执行状态
-- 以及用于配置设置的保存的游戏目录下/Config/autoexec.cfg.
-- the state in which $INSTALL_DIR/Config/main.cfg is executed,
-- as well as $WRITE_DIR/Config/autoexec.cfg. used for configuration settings
local JSON = loadfile('Scripts/JSON.lua')()
local keys = {}
for k, v in pairs(_G) do
  keys[#keys + 1] = k
end
return JSON:encode(keys)
`,
    link: {
      title: 'Running a Server',
      url: 'https://wiki.hoggitworld.com/view/Running_a_Server',
    },
  },

})
