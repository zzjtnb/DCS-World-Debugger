net.log("正在加载Debugger.lua ...")
Debugger = Debugger or {}
--------------------------------    定义Debugger的callbacks  --------------------------------
Debugger.callbacks = {}
function Debugger.callbacks.onMissionLoadBegin()
  Debugger.net.sendMsg({type = "serverStatus", data = {msg = "开始加载任务..."}})
end
function Debugger.callbacks.onMissionLoadEnd()
  Debugger.net.sendMsg({type = "serverStatus", data = {msg = "任务加载结束..."}})
end
function Debugger.callbacks.onSimulationStart()
  if DCS.getRealTime() > 0 then
    Debugger.net.sendMsg({type = "serverStatus", data = {msg = "游戏界面开始运行,可以开始调试Lua脚本"}})
  end
end
function Debugger.callbacks.onSimulationStop()
  Debugger.net.sendMsg({type = "serverStatus", data = {msg = "游戏界面已停止"}})
end
function Debugger.callbacks.onSimulationFrame()
  if TCP.server then
    if not TCP.client then
      TCP.client = TCP.server:accept() -- 连接的客户端
      local res, line, err = nil
      if TCP.client then
        TCP.client:settimeout(1) -- 设置超时时间
        TCP.client:setoption("reuseaddr", true) --重用地址
        -- TCP.client:setoption('keepalive', false) -- 设置保持连接
        TCP.client:setoption("tcp-nodelay", true) -- 设置即时传输模式
        line, err = TCP.client:receive()
        if not err then
          Debugger.debuggerLua(line)
        -- TCP.client:send('不存在TCP->' .. res .. '\n') -- 注意：发送的数据必须要有结束符才能发送成功
        end
      end
    else
      local line, err = TCP.client:receive()
      if err then
        if err == "timeout" then
          TCP.client:close()
          TCP.client = nil
          return
        elseif err == "closed" then
          TCP.client:close()
          TCP.client = nil
          return
        end
      end
      if line then
        Debugger.debuggerLua(line)
      end
    end
  end
end
DCS.setUserCallbacks(Debugger.callbacks)
net.log("Debugger.lua加载完毕")
