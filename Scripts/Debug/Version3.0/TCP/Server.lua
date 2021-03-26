--- LuaSocket TCP_Server 服务端 -- LuaSocket TCP_Server Server
local host = "localhost"
local port = "10505"
local socket = require("socket")
-- 看来s = socket.bind(…)实际上等效于：
-- s = socket.tcp()
-- s:bind(…)
-- s:listen(32)
-- 我不确定为什么将它们分为两个功能，但是修改代码以listen()使其工作：
-- local socket = require 'socket'
-- local server = socket.tcp()
-- server:bind('*',51423)
-- server:listen(32)
-- local client = server:accept()
TCP.server = assert(socket.bind(host, port))
TCP.server:settimeout(0.001) --设置超时时间
TCP.server:setoption("reuseaddr", true) --重用地址

function Step()
  if TCP.server then
    -- give up if no connection
    TCP.server:settimeout(0.001)
    -- wait for a connection from any client
    --等待任何客户端的连接( accept client)
    TCP.server_client = TCP.server:accept()
    -- if client not nil, connection established
    -- 如果客户端不为空,则建立连接
    if TCP.server_client then
      -- make sure we don't block waiting for this client's line
      -- 确保我们不会阻止等待这个客户端的线路
      -- TCP.server_client:settimeout(0.001)
      --[[
          You should be able to use server:timeout() before calling server:accept():
          server:settimeout(2)
          local client, err = server:accept()
          print(client, err)
          This prints nil timeout for me if no request comes in 2 seconds.
      --]]
      --如果在0.001秒之内没有收到数据,则client:receive函数将返回:nil,'timeout'
      local line, err = TCP.server_client:receive()
      if not err then
        local success, request =
          pcall(
          function()
            return net.json2lua(line)
          end
        )
        -- run request here
        if success then
          -- process_request
          local result = Tools.lua_str(request)
          -- after process_request
          Tools.net.server_send_msg(result)
        else
          net.log(request) -- log error
          Tools.net.client_send_msg({type = "serverStatus", data = {msg = "调试lua失败:" .. request}})
        end
      end
      -- done with client, close the object
      -- -与客户端一起完成,关闭对象
      TCP.server_client:close()
    else -- no client connection
      -- do nothing
    end
  end
end
