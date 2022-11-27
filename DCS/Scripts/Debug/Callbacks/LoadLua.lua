LoadLua = {}
LoadLua.callbacks = {}
function LoadLua.dostring_in(data)
  local info = {
    id = '',
    type = 'serverStatus',
    payload = {
      result = data
    },
    sent = os.time()
  }
  local code = "TCP.send(" .. Tools.table2tring(info) .. ")"
  Tools.dostring_in(code)
  --   local status =
  --     xpcall(
  --     function(code)
  --     end,
  --     Tools.value2string(err),
  --     code
  --   )
  --   net.log('发送状态', status)
end

------------------------ 定义Debugger的callbacks ------------------------

-- --- TCP服务尚未运行
-- -- this is where the netview is initiated
-- -- 这是启动 netview 的地方
-- function LoadLua.callbacks.onNetConnect(localPlayerID)
--   local data = '启动DCS API CONTROL服务器'
--   LoadLua.dostring_in(data)
-- end

function LoadLua.callbacks.onNetDisconnect(reason_msg, err_code)
  net.log('onNetDisconnect-->网络已断开连接')
  local msg = 'DCS API Server stoped'
  local data = {
    msg = msg,
    reason_msg = reason_msg,
    err_code = err_code
  }
  LoadLua.dostring_in(data)
end

-- --- world.addEventHandler尚未执行
-- --- TCP服务尚未运行
-- function LoadLua.callbacks.onMissionLoadBegin()
--   local data = '开始加载任务...'
--   if _G['DEBUG_DEV'] then
--     local code = "DEBUG_DEV=true"
--     -- result is a string
--     local result, status = net.dostring_in('mission', code)
--     net.log(data, result, status)
--   end
-- end

-- --- world.addEventHandler已经执行
-- function LoadLua.callbacks.onMissionLoadEnd()
--   -- 需要防止CTD引起的C Lua的API上net.pause和net.resume
--   LoadLua.mission_start_time = DCS.getRealTime()
--   local data = '任务加载结束...'
--   LoadLua.dostring_in(data)
-- end

function LoadLua.callbacks.onSimulationStart()
  if DCS.getRealTime() > 1 then
    local data = '游戏界面开始运行,可以开始调试Lua脚本'
    LoadLua.dostring_in(data)
  end
end

function LoadLua.callbacks.onPlayerTrySendChat(playerID, msg, all)
  local val = Tools.split_by_space(msg)
  if val[1] == 'debug' then
    local status, error = pcall(function()
      local path = lfs.writedir() .. 'Scripts/Test/Main.lua'
      if not val[2] then
        net.send_chat_to('请输入文件路径,默认执行Scripts/Test/Main.lua', playerID)
      else
        path = val[2]
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

function LoadLua.callbacks.onSimulationStop()
  net.log('API CONTROL SERVER TERMINATED')
  local data = '游戏界面已停止'
  LoadLua.dostring_in(data)
end

-- 设置用户callbacs,使用上面定义的功能映射DCS事件处理程序
DCS.setUserCallbacks(LoadLua.callbacks)
net.log('INFO: Hooks LoadLuaCallbacks 加载完成')
