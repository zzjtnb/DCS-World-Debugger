export const deepdump = `local function deepdump(tbl, depth)
  local result = {}
  local checklist = {}
  local max_depth = depth or math.huge
  local function _deepdump(t, current_depth, output, check)
    if current_depth > max_depth then
      output["... (达到最大深度)"] = nil
      return
    end
    check[t] = output
    for k, v in pairs(t) do
      local v_type = type(v)
      if v_type == "table" then
        if not check[v] then
          output[k] = "table"
          check[v] = true
        end
      elseif v_type == "function" or v_type == "userdata" then
        output[k] = v_type
      else
        output[k] = v
      end
    end
  end
  if type(tbl) ~= "table" then
    return { ["错误"] = "输入的不是一个表格" }
  end
  _deepdump(tbl, 1, result, checklist) -- 传递checklist
  return result
end
`

export const value2json = `local function value2json(val)
  local t = type(val)
  if t == "number" or t == "boolean" then
    return tostring(val)
  elseif t == "table" then
    local result = {}
    for k, v in pairs(val) do
      table.insert(result, string.format("%s:%s", value2string(k), value2string(v)))
    end
    return '{' .. table.concat(result, ',') .. '}'
  else
    return string.format("%q", tostring(val))
  end
end`

export const loadstring = `
return net.get_player_list()
return coalition
return country
`
export const net = {
  gui: {
    code: `local res = {}
for k, v in pairs(_G) do
  -- res[#res + 1] = k
  res[k] = type(v)
end
return net.lua2json(res)`,
    describe: `--GUI环境
--放置在 Script/Hooks 中的脚本通常在称为(GUI)(IIRC,可能是"server")
--可以运行 server 中的 DCS.*() 等函数
--也可以运行 net.*()
--无法使用 mission 中的 env.*() 等函数
local data={
  msg='我是GUI',
  time=DCS.getModelTime(),
  pause=DCS.getPause()
}
return net.lua2json(data)
`,
    link: {
      title: 'DCS server gameGUI',
      url: 'https://wiki.hoggitworld.com/view/DCS_server_gameGUI',
    },
  },
  server: {
    code: `local JSON = require('JSON')
local res = {}
for k, v in pairs(_G) do
  -- table.insert(res, k)
  res[k] = type(v)
end
-- print(table.concat(res, ","))
return JSON:encode(res)`,
    describe: `--多人游戏模式才能使用(仅服务器)
--可以运行 server 中的 DCS.*() 等函数
--也可以运行 mission 中的 env.*() 等函数
--无法使用net.*()
-- (holds the current mission when multiplayer? server only)
--[[
  env.info('测试LUA')
  return DCS.getRealTime()
]]
local JSON = require('JSON')
local res = {}
res.id = {}
res.name = {}
res.desc = {}
for i, tb in pairs(world.getAirbases()) do
  res.id[i] = Object.getName(tb)
  res.name[i] = tb:getName()
  res.desc[i] = tb:getDesc()
end
return JSON:encode(res)`,
    link: {
      title: 'List of scripting engine functions',
      url: 'https://wiki.hoggitworld.com/index.php?title=Category:Scripting',
    },
  },
  mission: {
    code: `${value2json}\n
local res = {}
for k, v in pairs(_G) do
  res[k] = type(v)
end
return value2json(res)`,
    describe: `--当前运行的任务(holds current mission)
--可以使用 mission 中的 env.*() 等函数
--无法使用 server 中的 DCS.*() 等函数
--可以使用 net.*()
--上面的三种必须用a_do_script 任务编辑器中的(DO SCRIPT)包裹起来
---code1(使用a_do_script)
a_do_script([[trigger.action.outText('加载成功(mission)', 10 , false)]])
a_do_script([[
local res = {}
for k, v in pairs(_G) do
  res[k] = type(v)
end
net.log(net.lua2json(res))
]])
---code2(不使用a_do_script)
${value2json}
local res = {}
for k, v in pairs(_G) do
  -- table.insert(res, k)
  res[k] = type(v)
end
-- print(table.concat(res, ","))
return value2json(res)
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
local res = {}
for k, v in pairs(_G) do
  -- table.insert(res, k)
  res[k] = type(v)
end
-- print(table.concat(res, ","))
return JSON:encode(res)`,
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
    code: `local JSON = require('JSON')
local res = {}
for k, v in pairs(_G) do
  -- table.insert(res, k)
  res[k] = type(v)
end
-- print(table.concat(res, ","))
return JSON:encode(res)`,
    describe: `-- 游戏安装目录下/Config/main.cfg的执行状态
-- 以及用于配置设置的保存的游戏目录下/Config/autoexec.cfg.
-- the state in which $INSTALL_DIR/Config/main.cfg is executed,
-- as well as $WRITE_DIR/Config/autoexec.cfg. used for configuration settings
local JSON = loadfile('Scripts/JSON.lua')()
local res = {}
for k, v in pairs(_G) do
  res[#res + 1] = k
end
return JSON:encode(res)
`,
    link: {
      title: 'Running a Server',
      url: 'https://wiki.hoggitworld.com/view/Running_a_Server',
    },
  },
}
