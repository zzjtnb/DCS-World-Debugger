if zzjtnbDebuggerTCP == nil then
  zzjtnb.net.log('正在加载zzjtnbDebuggerTCP.lua ...')
  zzjtnbDebuggerTCP = {}
  --------------------------------    定义Debugger的callbacks  --------------------------------
  zzjtnbDebuggerTCP.callbacks = {}
  function zzjtnbDebuggerTCP.callbacks.onMissionLoadBegin()
    zzjtnb.net.sendMsg({type = 'serverStatus', data = {msg = '开始加载任务...'}})
  end
  function zzjtnbDebuggerTCP.callbacks.onMissionLoadEnd()
    zzjtnb.net.sendMsg({type = 'serverStatus', data = {msg = '任务加载结束...'}})
  end
  function zzjtnbDebuggerTCP.callbacks.onSimulationStart()
    if DCS.getRealTime() > 0 then
      zzjtnb.net.sendMsg({type = 'serverStatus', data = {msg = '游戏界面开始运行,可以开始调试Lua脚本'}})
    end
  end
  function zzjtnbDebuggerTCP.callbacks.onSimulationFrame()
    if zzjtnbTCP.server then
      -- ip, port = zzjtnbTCP.server:getsockname() --获取连接信息
      -- if ip ~= nil and port ~= nil then
      -- end
      if not zzjtnbTCP.client then
        zzjtnbTCP.client = zzjtnbTCP.server:accept() -- 连接的客户端
        local res, line, err = nil
        if zzjtnbTCP.client then
          zzjtnbTCP.client:settimeout(1) -- 设置超时时间
          zzjtnbTCP.client:setoption('reuseaddr', true) --重用地址
          -- zzjtnbTCP.client:setoption('keepalive', false) -- 设置保持连接
          zzjtnbTCP.client:setoption('tcp-nodelay', true) -- 设置即时传输模式
          line, err = zzjtnbTCP.client:receive()
          if not err then
            zzjtnb.debuggerLua(line)
          -- zzjtnbTCP.client:send('不存在zzjtnbTCP->' .. res .. '\n') -- 注意：发送的数据必须要有结束符才能发送成功
          end
        end
      else
        line, err = zzjtnbTCP.client:receive()
        if err then
          if err == 'timeout' then
            -- net.log('连接已超时')
            zzjtnbTCP.client:close()
            zzjtnbTCP.client = nil
            return
          elseif err == 'closed' then
            -- net.log('连接已关闭')
            zzjtnbTCP.client:close()
            zzjtnbTCP.client = nil
            return
          end
        end
        if line then
          zzjtnb.debuggerLua(line)
        end
      end
    end
  end
  function zzjtnbDebuggerTCP.callbacks.onSimulationStop()
    if zzjtnbTCP.client then
      zzjtnbTCP.client:close()
    end
    if zzjtnbTCP.server then
      zzjtnbTCP.server:close()
    end
    zzjtnb.net.sendMsg({type = 'serverStatus', data = {msg = '游戏界面已关闭'}})
  end

  DCS.setUserCallbacks(zzjtnbDebuggerTCP.callbacks)
  net.log('zzjtnbDebuggerTCP.lua加载完毕')
end
