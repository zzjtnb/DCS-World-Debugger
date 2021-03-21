net.log("正在加载Debugger.lua ...")
Debugger = Debugger or {}
local do_step = false
--------------------------------    定义Debugger的callbacks  --------------------------------
Debugger.callbacks = {}

function Debugger.callbacks.onNetConnect(localPlayerID) -- only if isServer()
  -- this is where the netview is initiated?
  net.log("onNetConnect-->网络已连接")
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
  do_step = true -- onSimulationFrame can start step()
end

function Debugger.callbacks.onNetDisconnect(reason_msg, err_code)
  net.log("onNetDisconnect-->网络已断开连接")
  do_step = false -- onSimulationFrame can start step()
end
function Debugger.callbacks.onMissionLoadBegin()
  Debugger.net.send_udp_msg({type = "serverStatus", data = {msg = "开始加载任务..."}})
end
function Debugger.callbacks.onMissionLoadEnd()
  Debugger.mission_start_time = DCS.getRealTime() --需要防止CTD引起的C Lua的API上net.pause和net.resume
  Debugger.net.send_udp_msg({type = "serverStatus", data = {msg = "任务加载结束..."}})
end
function Debugger.callbacks.onSimulationStart()
  if DCS.getRealTime() > 0 then
    Debugger.net.send_udp_msg({type = "serverStatus", data = {msg = "游戏界面开始运行,可以开始调试Lua脚本"}})
  end
end
local step_frame_count = 0
function Debugger.callbacks.onSimulationFrame()
  if do_step then
    step_frame_count = step_frame_count + 1
    if step_frame_count == 1 then
      -- net.log("this is frame: " .. step_frame_count .. " at " .. os.time())
      -- call step if in game env?
      local success, error = pcall(step)
      if not success then
        net.log("Error: " .. error)
      end
      step_frame_count = 0
    end
  end
end
function Debugger.callbacks.onSimulationStop()
  Debugger.net.send_udp_msg({type = "serverStatus", data = {msg = "游戏界面已停止"}})
  TCP.server:close()
  net.log("API CONTROL SERVER TERMINATED")
end
DCS.setUserCallbacks(Debugger.callbacks)
net.log("Debugger.lua加载完毕")
