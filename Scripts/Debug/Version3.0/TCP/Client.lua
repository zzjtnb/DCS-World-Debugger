local host, port = "localhost", "20200"

-- net = require("net.main") mission环境导入(export.lua)
function TCP.client_connect()
  --- LuaSocket TCP客户端 -- LuaSocket TCP Client
  local socket = require("socket")
  -- Create Socket
  TCP.client = assert(socket.tcp())
  -- connect to the listener socket
  -- 连接到监听套接字
  TCP.client:connect(host, port)
  -- set immediate transmission mode
  -- 设置即时传输模式
  TCP.client:setoption("tcp-nodelay", true)
  -- --重用地址
  -- TCP.client:setoption("reuseaddr", true)
  -- -- 设置保持连接
  -- TCP.client:setoption("keepalive", true)
  TCP.client:settimeout(0.001)
end
function TCP.client_send(data)
  if TCP.client == nil then
    TCP.client_connect()
  end
  TCP.client:send(data .. "exit\r\n") -- to close the listener socket
  TCP.read_some(TCP.client)
  TCP.client_disconnect()
end
function TCP.read_some(s)
  local msg, status, partial = s:receive()
  if status == "closed" then
    return status, partial
  elseif status == "timeout" then
    net.log("SendError-->发送超时," .. status)
  else
    net.log("SendError-->发送失败,远程服务器没有开启.", msg, status)
  end
end
function TCP.client_disconnect()
  if TCP.client then
    TCP.client:close()
    TCP.client = nil
  end
end
TCP.client_connect()
