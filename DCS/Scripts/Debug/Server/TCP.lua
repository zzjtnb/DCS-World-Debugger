package.path = package.path .. ';./Scripts/?.lua'
package.path = package.path .. ';./LuaSocket/?.lua'
package.cpath = package.cpath .. ';./LuaSocket/?.dll'

local socket = require('socket')

TCP = TCP or {}

function TCP.creat_client()
  -- connect to the listener socket
  TCP.client = socket.try(socket.connect(TCP.host, TCP.distantPort))
  TCP.client:settimeout(TCP.dataTimeoutSe)
  -- TCP.client:setoption('keepalive', true)
  TCP.client:setoption('reuseaddr', true)
  -- set immediate transmission mode
  TCP.client:setoption('tcp-nodelay', true)

end

function TCP.creat_server()
  -- create a TCP socket and bind it to the local host, at any port
  TCP.server = assert(socket.bind(TCP.host, TCP.ownPort))
  -- 如果在10秒之内没有收到数据,则client:receive函数将返回:nil,'timeout'
  TCP.server:settimeout(TCP.dataTimeoutSe)
  -- TCP.server:setoption('keepalive', true)
  TCP.server:setoption('reuseaddr', true)
  -- set immediate transmission mode
  TCP.server:setoption('tcp-nodelay', true)

  -- find out which port the OS chose for us
  local ip, port = TCP.server:getsockname()
  -- print a message informing what's up
  -- print("Please telnet to localhost on port " .. port)
  -- print("After connecting, you have 10s to enter a line to be echoed")
  Tools.net.info(string.format("TCP server listen on: %s:%s", ip, port))
end
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
    repeat
      -- 以 1K 的字节块来接收数据,并把接收到字节块输出来
      -- local chunk, status, partial = TCP.client:receive(1024)
      -- net.log('客户端接收数据:', chunk, status, partial)
      local status, partial = TCP.client:receive(1024)
      if partial == "quit" then
        -- 关闭 TCP 连接
        TCP.client:close()
      end
    until status ~= "closed"
  else
    -- 关闭 TCP 连接
    TCP.client:close()
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
    -- net.log(line, err, 'TCP.receive')
    -- if there was no error, send it back to the client
    if not err then
      -- net.log('TCP.receive: ' .. line)
      local status, decodedRequest = Tools.net.json2lua(line)
      if status then
        TCP.handle(decodedRequest)
      end
    end
    client:send('qiut\r\n')
    -- done with client, close the object
    client:close()
  end
  return time + TCP.dataTimeoutSec
end

function TCP.step()
  if TCP.server == nil then
    TCP.creat_server()
  end
end

timer.scheduleFunction(TCP.receive, {}, timer.getTime() + TCP.dataTimeoutSec)
