--- Dedicated server Game User Interface script
-- required for proper DCS utilities start
-- Lua 5.1
dofile(lfs.writedir() .. 'Scripts/statistics/initGUI.lua')

------------------------ 定义Statistics的callbacks ------------------------
--- world.addEventHandler尚未执行
function onMissionLoadBegin()
  -- 初始化游戏数据
  local data = '开始加载任务...'
  Statistics.send_data(data)
end
--- world.addEventHandler已经执行
function onMissionLoadEnd()
  local data = '任务加载结束...'
  Statistics.send_data(data)
  -- already reported
  -- log_write("Loaded mission ", filename)
  local toJson = [[
    toJson = function(param)
      if type(param) == "string" then
        return '"' .. param:gsub('"', '\\"') .. '"'
      elseif type(param) == "number" or type(param) == "boolean" then
        return tostring(param)
      elseif type(param) == "table" then
        local json = "{"
        local comma = ""
        for key, value in pairs(param) do
          json = json .. comma .. '"' .. tostring(key) .. '":' .. toJson(value)
          comma = ","
        end
        return json .. "}"
      elseif type(param) == "function" then
        return "function"
      else
        return string.format("%q", tostring(val))
      end
    end
  ]]
  -- load serializer into mission env
  net.dostring_in('mission', toJson)
  -- a_do_script([[local keys = {} for k, v in pairs(_G) do keys[k] = type(v) end -- print(table.concat(keys, \",\")) net.log(net.lua2json(keys))]])
  net.dostring_in('mission', 'return a_do_script([[' .. toJson .. ']])')
end
function onSimulationStart()
  local data = '游戏界面开始运行,可以开始调试Lua脚本'
  Statistics.send_data(data)
end
-- 在模拟运行时不断发生,这个函数运行速度极快,每秒几百次.
-- 强烈建议进行检查以限制代码从此函数运行的频率.
function onSimulationFrame()
  TCP.server_accept()
  -- 以 10 秒的间隔运行您想要的任何代码
  -- if Statistics.RealTime + 10 < DCS.getRealTime() then
  --   Statistics.RealTime = DCS.getRealTime()
  --   -- whatever code you want
  --   -- TCP.server_accept()
  --   -- net.log('时间:', DCS.getRealTime(), DCS.getModelTime())
  -- end
end
function onSimulationStop()
  local data = '游戏界面已停止'
  Statistics.send_data(data)
end
function onPlayerTrySendChat(playerID, msg, all)
  local tab = ZZJT.string_split_to_table(msg)
  if not tab then
    return false
  end
  local player_info = net.get_player_info(playerID)
  me_chats.init(tab, player_info)
end
local hooks = {}
hooks.onMissionLoadBegin = onMissionLoadBegin
hooks.onMissionLoadEnd = onMissionLoadEnd
hooks.onSimulationFrame = onSimulationFrame
hooks.onSimulationStart = onSimulationStart
hooks.onSimulationStop = onSimulationStop
hooks.onPlayerTrySendChat = onPlayerTrySendChat

-- 设置用户callbacs,使用上面定义的功能映射DCS事件处理程序
DCS.setUserCallbacks(hooks)
net.log('INFO: Hooks Statistics Callbacks 加载完成')

