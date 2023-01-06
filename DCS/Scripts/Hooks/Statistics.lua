local statistics_dir = lfs.writedir() .. 'Scripts/statistics/'
package.path = statistics_dir .. '?.lua;' .. package.path

Tools = require('Tools')
TCP = require("TCP")
TCP.creat_tcp_server()
Statistics = require('Statistics')

------------------------ 定义Debugger的callbacks ------------------------
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
end
function onSimulationStart()
  -- net.log("------- onSimulationStart------", DCS.getPause(), DCS.isMultiplayer(), DCS.isTrackPlaying())
  local data = '游戏界面开始运行,可以开始调试Lua脚本'
  Statistics.send_data(data)

  -- 发送当前任务数据
  if (DCS.isMultiplayer() == true) then
    Statistics.MissionData.serverSettings = net.get_server_settings()
    -- 用户游戏设置
    local option = DCS.getUserOptions()
  end
  Statistics.UpdateMission()

end

-- 在模拟运行时不断发生,这个函数运行速度极快,每秒几百次.
-- 强烈建议进行检查以限制代码从此函数运行的频率.
function onSimulationFrame()
  TCP.server_accept()
  -- 以 10 秒的间隔运行您想要的任何代码
  if Statistics.RealTime + 10 < DCS.getRealTime() then
    Statistics.RealTime = DCS.getRealTime()
    -- whatever code you want
    -- TCP.server_accept()
    -- net.log('时间:', DCS.getRealTime(), DCS.getModelTime())
  end
end

function onSimulationStop()
  net.log("事件: onSimulationStop")
  local data = '游戏界面已停止'
  Statistics.send_data(data)
end

function onPlayerTrySendChat(playerID, msg, all)
  local tab = Tools.string_split_to_table(msg)
  if tab then
    if tab[1] == 'debug' then
      local status, error = pcall(function()
        local path = lfs.writedir() .. 'Scripts/Test/Main.lua'
        if not tab[2] then
          net.send_chat_to('请输入文件路径,默认执行Scripts/Test/Main.lua', playerID)
        else
          path = tab[2]
        end
        dofile(path)
      end)
      if (not status) then
        local result = string.format('脚本加载失败: %s', error)
        net.send_chat_to(result, playerID)
        net.log(result)
      else
        net.send_chat_to('脚本加载完成', playerID)
        net.log('脚本加载完成')
      end
    end
  end
end

function onPlayerConnect(id)
  if id == net.get_server_id() then
    Statistics.MissionData.serverInfo = net.get_player_info(id)
    return
  end

  net.log("事件: onPlayerConnect", id)

  Statistics.clients[id] = net.get_player_info(id)
  Statistics.send_data(Statistics.clients)
end

function onPlayerDisconnect(id, err_code)
  if id == net.get_server_id() then
    return
  end

  net.log("事件: onPlayerDisconnect", id, err_code)

  -- 本地玩家 ID 永远不会调用此方法
  Statistics.send_data(Statistics.clients[id])
  Statistics.clients[id] = nil
end

function onPlayerStart(id)
  if id == net.get_server_id() then
    Statistics.MissionData.serverInfo = net.get_player_info(id)
    return
  end

  net.log("事件: onPlayerStart", id)

  -- 玩家进入游戏调用
  -- 本地玩家 ID 永远不会调用此方法
  Statistics.clients[id].inSim = true
end

function onPlayerStop(id)
  if id == net.get_server_id() then
    return
  end

  net.log("事件: onPlayerStop", id)

  -- 玩家离开了游戏(如果玩家自愿退出，则在断开连接之前(onPlayerDisconnect)发生)
  -- 本地玩家 ID 永远不会调用此方法
  Statistics.clients[id].inSim = false

end

function onGameEvent(eventName, playerID, arg2, arg3, arg4, arg5, arg6, arg7)
  local player_info = net.get_player_info(playerID)
  if eventName == 'connect' then
    -- "connect", playerID, name
    net.log("事件: connect", eventName, playerID, arg2)
  elseif eventName == 'change_slot' then
    -- "change_slot", playerID, slotID, prevSide
    net.log("事件: change_slot", eventName, playerID, arg2, arg3)
    local playerName = net.get_player_info(playerID, 'name')
    local text = string.format("return trigger.action.outText(\"Welcome LT COL %s\", 60);", playerName)
    net.dostring_in('server', text)
  elseif eventName == 'takeoff' then
    -- "takeoff", playerID, unit_missionID, airdromeName
    net.log("事件: takeoff", eventName, playerID, arg2, arg3)
  elseif eventName == 'landing' then
    -- "landing", playerID, unit_missionID, airdromeName
    net.log("事件: landing", eventName, playerID, arg2, arg3)
  elseif eventName == 'kill' then
    -- "kill", killerPlayerID, killerUnitType, killerSide, victimPlayerID, victimUnitType, victimSide, weaponName
    net.log("事件: kill", eventName, playerID, arg2, arg3, arg4, arg5, arg6, arg7)
  elseif eventName == 'self_kill' then
    -- "self_kill", playerID
    net.log("事件: self_kill", eventName, playerID)
  elseif eventName == 'friendly_fire' then
    -- "friendly_fire", playerID, weaponName, victimPlayerID
    net.log("事件: friendly_fire", eventName, playerID, arg2, arg3)
  elseif eventName == 'pilot_death' then
    -- "pilot_death", playerID, unit_missionID
    net.log("事件: pilot_death", eventName, playerID, arg2)
  elseif eventName == 'crash' then
    -- "crash", playerID, unit_missionID
    net.log("事件: crash", eventName, playerID, arg2)
  elseif eventName == 'eject' then
    -- "eject", playerID, unit_missionID
    net.log("事件: eject", eventName, playerID, arg2)
  elseif eventName == 'mission_end' then
    -- "mission_end", winner, msg
    net.log("事件: mission_end", eventName, playerID, arg2)
  elseif eventName == 'disconnect' then
    -- "disconnect", playerID, name, playerSide, reason_code
    net.log("事件: disconnect", eventName, playerID, arg2, arg3, arg4)
  else
    net.log('Unknown event type:', eventName)
  end
  local _stat_table = {
    time = os.date('%Y-%m-%d %H:%M:%S'),
    aircraft_type = DCS.getUnitType(player_info['slot'])
  }
  net.log(player_info)
  Statistics.send_data(_stat_table)
end

local hooks = {}
hooks.onMissionLoadBegin = onMissionLoadBegin
hooks.onMissionLoadEnd = onMissionLoadEnd
hooks.onSimulationFrame = onSimulationFrame
hooks.onSimulationStart = onSimulationStart
hooks.onSimulationStop = onSimulationStop
hooks.onPlayerTrySendChat = onPlayerTrySendChat
hooks.onPlayerConnect = onPlayerConnect
hooks.onPlayerStart = onPlayerStart
hooks.onPlayerStop = onPlayerStop
hooks.onPlayerDisconnect = onPlayerDisconnect
hooks.onGameEvent = onGameEvent

-- 设置用户callbacs,使用上面定义的功能映射DCS事件处理程序
DCS.setUserCallbacks(hooks)
net.log('INFO: Hooks Statistics Callbacks 加载完成')

