package.path = package.path .. ';./Scripts/?.lua'
package.path = package.path .. ';./LuaSocket/?.lua'
package.cpath = package.cpath .. ';./LuaSocket/?.dll'

local socket = require('socket')

TCP = TCP or {}

function TCP.creat_client()
  -- connect to the listener socket
  TCP.client = socket.try(socket.connect(TCP.host, TCP.distantPort))
  -- 设置超时
  TCP.client:settimeout(0)

  TCP.client:setoption('keepalive', true)
  TCP.client:setoption('reuseaddr', true)
  -- set immediate transmission mode
  TCP.client:setoption('tcp-nodelay', true)

end

function TCP.creat_server()
  -- create a TCP socket and bind it to the local host, at any port
  TCP.server = assert(socket.bind(TCP.host, TCP.ownPort))
  -- 默认情况下,所有 I/O 操作都是阻塞的。
  -- 也就是说,对方法 send、 receive和 accept的任何调用 都将无限期阻塞,直到操作完成
  -- 等待的时间量以秒为单位
  -- 如果值为 nil 允许操作无限期阻塞 ,负超时值具有相同的效果
  -- 在秒之内没有收到数据,则client:receive函数将返回:nil,'timeout'
  TCP.server:settimeout(0)
  -- 将此选项设置为true可以在连接的套接字上定期传输消息。
  -- 如果连接方未能响应这些消息,则连接被视为断开并通知使用套接字的进程;
  TCP.server:setoption('keepalive', true)
  -- 允许重用本地地址
  TCP.server:setoption('reuseaddr', true)
  -- 解决 TCP 粘包问题
  -- 设置即时传输模式
  -- 将此选项设置为true 会禁用 Nagle 的连接算法
  TCP.server:setoption('tcp-nodelay', true)

  -- find out which port the OS chose for us
  local ip, port = TCP.server:getsockname()
  -- print a message informing what's up
  -- print("Please telnet to localhost on port " .. port)
  -- print("After connecting, you have 10s to enter a line to be echoed")
  Tools.net.info(string.format("TCP server listen on: %s:%s", ip, port))
end

--- TCP 客户端
---@param payload string
function TCP.send(payload)
  if not TCP then
    return net.log('sendData -->发送失败,TCP服务端未启动', payload)
  end
  TCP.creat_client()
  -- find out which port the OS chose for us
  local ip, port = TCP.client:getsockname()
  net.log('sendDataTo -->' .. tostring(ip) .. ':' .. tostring(port))
  payload = Tools.value2string(payload)
  if (payload) then
    payload = Tools.stringSlice2Table(payload, TCP.MAX_PAYLOAD_SIZE)
    for i, v in pairs(payload) do
      if i == #payload then
        v = v .. 'qiut\r\n'
      end
      TCP.client:send(v)
    end
    -- 以 1K 的字节块来接收数据,并把接收到字节块输出来
    -- nil	closed	quit
    -- {"status":"timeout","partial":""}
    local chunk, status, partial = TCP.client:receive(1024)
    -- net.log('TCP.send-->', net.lua2json({
    --   chunk = chunk,
    --   status = status,
    --   partial = partial
    -- }))
    if status == 'timeout' or partial == "quit" then
      -- 关闭 TCP 连接
      TCP.client:close()
    end

    --[[
      repeat
          local status, partial = TCP.client:receive(1024)
          net.log('tcp client 接收', status, partial)
          if partial == "quit" then
            -- 关闭 TCP 连接
            TCP.client:close()
          end
        until status ~= "closed"
      ]]
  end
end

function TCP.receive(args, time)
  TCP.step()
  -- wait for a connection from any client
  local client = TCP.server:accept()
  -- if client not nil, connection established
  -- 如果客户端不为空,则建立连接
  if client ~= nil then
    local line, err = client:receive()
    -- net.log('TCP.receive-->', line, err)
    if not err then
      local status, decodedRequest = Tools.net.json2lua(line)
      if status then
        TCP.handle(decodedRequest)
      end
      --[[
          -- if there was no error, send it back to the client
          client:send('qiut\r\n')
       ]]
      -- done with client, close the object
      -- 会触发 nodejs TCP 客户端的 end 事件
      client:close()
    end
  end
  return time + TCP.dataTimeoutSec
end

function TCP.step()
  if TCP.server == nil then
    TCP.creat_server()
  end
end

timer.scheduleFunction(TCP.receive, {}, timer.getTime() + TCP.dataTimeoutSec)
