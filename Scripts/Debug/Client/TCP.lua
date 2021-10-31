TCP = TCP or {}

function TCP.creat_client()
  TCP.client = TCP.socket.try(TCP.socket.connect(TCP.host, TCP.distantPort)) -- connect to the listener socket
  TCP.client:setoption('tcp-nodelay', true) -- set immediate transmission mode
end
function TCP.creat_server()
  TCP.server = TCP.socket.bind(TCP.host, TCP.ownPort)
  TCP.server:settimeout(0)
end

function TCP.step()
  if TCP.server == nil then
    TCP.creat_server()
  end
end

function TCP.send(payload)
  TCP.creat_client()
  if type(payload) == 'table' then
    payload = net.lua2json(payload)
  end
  -- net.log(net.lua2json({sent = payload}))
  if (payload) then
    local MAX_PAYLOAD_SIZE = 8192
    payload = TCP.slice(payload, MAX_PAYLOAD_SIZE)
    for i, v in pairs(payload) do
      if i == #payload then
        v = v .. 'exit\r\n'
      end
      TCP.socket.try(TCP.client:send(v)) -- to close the listener socket
    end
  -- TCP.client:close()
  end
end
function TCP.slice(str, max)
  local sliced = {}
  local flag = 0
  if #str < max then
    sliced[1] = str
  else
    for i = 0, #str, max do
      flag = flag + 1
      if i == 0 then
        sliced[flag] = string.sub(str, i, max)
      else
        sliced[flag] = string.sub(str, i + 1, i + max)
      end
    end
  end
  return sliced
end

function TCP.receive(args, time)
  if TCP.server == nil then
    TCP.creat_server()
  end
  -- wait for a connection from any client
  --等待任何客户端的连接( accept client)
  TCP.accept_client = TCP.server:accept()
  -- if client not nil, connection established
  -- 如果客户端不为空,则建立连接
  if TCP.accept_client ~= nil then
    TCP.accept_client:settimeout(0)
    TCP.accept_client:setoption('keepalive', true)
    --如果在0.001秒之内没有收到数据,则client:receive函数将返回:nil,'timeout'
    local request, err = TCP.accept_client:receive()

    if not err then
      local success, decodedRequest =
        pcall(
        function()
          return net.json2lua(request)
        end
      )
      if success then
        TCP.handle(decodedRequest)
      else
        timer.scheduleFunction(TCP.receive, {}, timer.getTime() + TCP.dataTimeoutSec)
      end
    end
  end

  return time + TCP.dataTimeoutSec
end

timer.scheduleFunction(TCP.receive, {}, timer.getTime() + TCP.dataTimeoutSec)
