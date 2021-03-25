net.log("正在加TCP.lua ...")
TCP = TCP or {}
TCP.host = "localhost"
TCP.port = "20200"
--------------------------------    定义TCP的callbacks  --------------------------------
package.path = package.path .. ";./LuaSocket/?.lua"
package.path = package.path .. ";./Scripts/?.lua"
package.cpath = package.cpath .. ";./LuaSocket/?.dll"
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
TCP.server = assert(socket.bind(TCP.host, TCP.port))
TCP.server:settimeout(0.001) --设置超时时间
TCP.server:setoption("reuseaddr", true) --重用地址

function Step()
  if TCP.server then
    TCP.server:settimeout(0.001) -- give up if no connection
    TCP.client = TCP.server:accept() --等待任何客户端的连接( accept client)
    if TCP.client then -- if client not nil, connection established
      -- TCP.client:setoption("keepalive", true) --保持连接
      -- TCP.client:setoption("reuseaddr", true) --重用地址
      -- TCP.client:settimeout(0.001) --如果在0.001秒之内没有收到数据,则client:receive函数将返回:nil,'timeout'
      local line, err = TCP.client:receive()
      if not err then
        --net.log(line)
        local success, request =
          pcall(
          function()
            return net.json2lua(line)
          end
        )
        if success then -- run request here
          -- process_request
          local result = Debugger.lua_str(request)
          -- after process_request
          Debugger.net.send_tcp_msg(result)
        else
          net.log(request) -- log error
          Debugger.net.send_udp_msg({type = "serverStatus", data = {msg = "调试lua失败:" .. request}})
        end
      end
      TCP.client:close() -- done, close connection
    else -- no client connection
      -- do nothing
    end
  end
end
net.log("TCP.lua加载完毕")
