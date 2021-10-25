LoadLua = LoadLua or {}
LoadLua.do_step = false

LoadLua.callbacks = LoadLua.callbacks or {}

if DCS and DCS.isServer() then
  LoadLua.isServer = DCS.isServer()
end
--------------------------------    定义Debugger的callbacks  --------------------------------
-- this is where the netview is initiated
-- 这是启动 net view 的地方
function LoadLua.callbacks.onNetConnect(localPlayerID)
  -- LoadLua.do_step = false onSimulationFrame can start step()
  -- LoadLua.do_step = true onSimulationFrame可以启动step()
  LoadLua.do_step = true
  net.log('启动DCS API CONTROL服务器')
  local ip, port = LoadLua.server:getsockname()
  local msg = string.format('DCS API Server started on at %s:%s', ip, port)
  local code = [[ Tools.net.udp_send_msg({type = 'ServerStatus', payload =]] .. net.lua2json({msg = msg}) .. [[ })]]
  Tools.a_do_script(code)

  --[[
    -- map slot and id and things
    NetSlotInfo = {} -- reset NetSlotInfo
    -- local coals = DCS.getAvailableCoalitions() --> table { [coalition_id] = { name = "coalition name", } ... }
    local slots = DCS.getAvailableSlots("blue")
    net.log(net.lua2json(slots))
    for slot_id, slot_info in ipairs(slots) do
      NetSlotInfo[slot_id] = {
        ["action"] = slot_info.action,
        ["countryName"] = slot_info.countryName,
        ["groupName"] = slot_info.groupName,
        ["groupSize"] = slot_info.groupSize,
        ["onboard_num"] = slot_info.onboard_num,
        ["role"] = slot_info.role,
        ["type"] = slot_info.type,
        ["task"] = slot_info.task,
        ["unitId"] = slot_info.unitId
      }
    end
  ]]
end

function LoadLua.callbacks.onNetDisconnect(reason_msg, err_code)
  net.log('onNetDisconnect-->网络已断开连接')
  local msg = string.format('DCS API Server stoped')
  local code = [[ Tools.net.udp_send_msg({type = 'ServerStatus', payload =]] .. net.lua2json({msg = msg, reason_msg = reason_msg, err_code = err_code}) .. [[ })]]
  Tools.a_do_script(code)

  -- onSimulationFrame can't start step()
  -- onSimulationFrame不能启动step()
  LoadLua.do_step = false
end
function LoadLua.callbacks.onMissionLoadBegin()
  local code = [[Tools.net.udp_send_msg({type = 'ServerStatus', payload = {msg = '开始加载任务...'}})]]
  Tools.a_do_script(code)
end
function LoadLua.callbacks.onMissionLoadEnd()
  LoadLua.mission_start_time = DCS.getRealTime() --需要防止CTD引起的C Lua的API上net.pause和net.resume
  local code = [[Tools.net.udp_send_msg({type = 'ServerStatus', payload = {msg = '任务加载结束...'}})]]
  Tools.a_do_script(code)
end
function LoadLua.callbacks.onSimulationStart()
  if DCS.getRealTime() > 0 then
    local code = [[Tools.net.udp_send_msg({type = 'ServerStatus', payload = {msg = '游戏界面开始运行,可以开始调试Lua脚本'}})]]
    Tools.a_do_script(code)
  end
end

function LoadLua.callbacks.onPlayerTrySendChat(playerID, msg, all)
  local val = Tools.split_by_space(msg)
  if val[1] == 'debug' then
    local status, error =
      pcall(
      function()
        local path = lfs.writedir() .. 'Scripts/Debug/Test/Main.lua'
        if val[2] then
          path = val[2]
        end
        dofile(path)
      end
    )
    if (not status) then
      local result = string.format('脚本加载失败: %s', error)
      net.send_chat_to(result, playerID)
      Tools.net.log(result)
    else
      net.send_chat_to('脚本加载完成', playerID)
      Tools.net.log('脚本加载完成')
    end
  end
end

function LoadLua.callbacks.onSimulationStop()
  local code = [[Tools.net.udp_send_msg({type = 'ServerStatus', payload = {msg = '游戏界面已停止'}})]]

  Tools.a_do_script(code)
  net.log('API CONTROL SERVER TERMINATED')
end

if LoadLua.isServer then
  --设置用户callbacs,使用上面定义的功能映射DCS事件处理程序
  DCS.setUserCallbacks(LoadLua.callbacks)
  Tools.net.log('[Debug]-->当前环境为Server环境')
else
  Tools.net.log('[Debug]-->当前环境为Mission环境')
end
