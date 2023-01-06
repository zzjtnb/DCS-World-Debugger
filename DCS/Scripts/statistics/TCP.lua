-- module name. All function in this file, if used outside, should be called "functionname"
module('TCP', package.seeall)

package.path = package.path .. ';./Scripts/?.lua'
package.path = package.path .. ';./LuaSocket/?.lua'
package.cpath = package.cpath .. ';./LuaSocket/?.dll'

local socket = require('socket')

-- host = "dcs.foryoufly.net"
host = host or "localhost"
port = port or 8888
lport = lport or 6666
BLOCKSIZE = 1024 * 8 -- 默认为 8k 8192字节(Byte)
server = nil
client = nil
dataTimeoutSec = 0

function send_data(payload)
  if not client then
    local status = create_tcp_client()
    if not status then
      return
    end
  end
  payload = Tools.data2string(payload)
  if (payload) then
    payload = payload .. 'qiut\r\n'
    client:send(payload)
    -- payload = Tools.stringSlice2Table(payload, BLOCKSIZE)
    -- for i, v in pairs(payload) do
    --   if i == #payload then
    --     v = v .. 'qiut\r\n'
    --   end
    --   client:send(v)
    -- end
    -- 以 2K 的字节块来接收数据,并把接收到字节块输出来
    local chunk, status, partial = client:receive(BLOCKSIZE)
    -- net.log(chunk, status, partial, '客户端接收')
    -- nil	closed	quit
    if status == 'timeout' or status == 'closed' or partial == "quit" then
      -- 关闭 TCP 连接
      client:close()
      client = nil
    end
  end

end

function create_tcp_client()
  local status, error = pcall(function()
    -- connect to the listener socket
    client = socket.try(socket.connect(host, lport))
  end)
  if status then
    -- 设置超时时间(单位是秒).如果设置为 0,则表示没有超时时间限制
    client:settimeout(dataTimeoutSec)
    client:setoption('keepalive', true)
    -- client:setoption('reuseaddr', true)
    -- set immediate transmission mode
    client:setoption('tcp-nodelay', true)
  end
  return status, error
end

function creat_tcp_server()
  -- create a TCP socket and bind it to the local host, at any port
  server = assert(socket.bind(host, port))
  -- 设置超时时间(单位是秒).如果设置为 0,则表示没有超时时间限制
  -- 默认情况下,所有 I/O 操作都是阻塞的。
  -- 也就是说,对方法 send、 receive和 accept的任何调用 都将无限期阻塞,直到操作完成
  -- 等待的时间量以秒为单位
  -- 如果值为 nil 允许操作无限期阻塞 ,负超时值具有相同的效果
  -- 在秒之内没有收到数据,则client:receive函数将返回:nil,'timeout'
  server:settimeout(dataTimeoutSec)
  -- 将此选项设置为true可以在连接的套接字上定期传输消息。
  -- 如果连接方未能响应这些消息,则连接被视为断开并通知使用套接字的进程;
  server:setoption('keepalive', true)
  -- 允许重用本地地址
  server:setoption('reuseaddr', true)
  -- 解决 TCP 粘包问题
  -- 将此选项设置为true 会禁用 Nagle 的连接算法
  server:setoption('tcp-nodelay', true)

  -- find out which port the OS chose for us
  local ip, port = server:getsockname()
  -- print a message informing what's up
  -- print("Please telnet to localhost on port " .. port)
  -- print("After connecting, you have 10s to enter a line to be echoed")
  net.log(string.format("INFO: TCP server listen on: %s:%s", ip, port))
  server_accept()
end

function server_accept()
  -- wait for a connection from any client
  local sock = server:accept()
  -- if client not nil, connection established
  -- 如果客户端不为空,则建立连接
  if sock ~= nil then
    local line, err = sock:receive()
    -- net.log('收到数据-->', line, err)
    if not err then
      local status, decodedRequest = Tools.json2lua(line)
      if status then
        handle(decodedRequest)
      end
      --[[
          -- if there was no error, send it back to the client
          sock:send('qiut\r\n')
       ]]
      -- done with client, close the object
      -- 会触发 nodejs TCP 客户端的 end 事件
      -- sock:close()
    end
  end
end

function handle(request)
  if not request or not request.id or not request.type or not request.payload then
    env.err('TCP handle->Received a unvalid request')
    return
  end
  if request.type == 'debug' then
    handleDebug(request)
  end
end

function handleDebug(request)
  local result, status = nil, nil
  if request.payload.type == 'loadstring' then
    result, status = Tools.safe_loadstring(request.payload.content)
  end
  if request.payload.type == 'dostring_in' then
    -- net.dostring_in(state, string) -> string
    -- 在给定的内部 lua-state 中执行一个 lua-string 并返回一个字符串结果
    -- 返回的内容必须是一个字符串
    result, status = net.dostring_in(request.payload.env, request.payload.content)
  end

  local response = {
    id = request.id,
    type = request.type,
    sent = os.time(),
    payload = {
      type = request.payload.type,
      status = status,
      date = Tools.getTimeStamp()
    }
  }
  if not status then
    if Tools.isempty(result) then
      result = "执行失败"
    end
    response.payload.msg = result
  else
    if Tools.isempty(result) then
      result = "执行成功"
    end
    response.payload.result = result
  end
  send_data(response)
end

