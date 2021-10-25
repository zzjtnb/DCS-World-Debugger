Client = Client or {}
function Client.creat_udp_client()
  Client.udp_client = Client.socket.udp()
  assert(Client.udp_client:setpeername(Client.host, Client.clientPort))
end
function Client.creat_udp_server()
  Client.udp_server = Client.socket.udp()
  assert(Client.udp_server:settimeout(0))
  assert(Client.udp_server:setsockname(Client.host, Client.serverPort))
end

function Client.udp_step()
  if Client.udp_client == nil then
    Client.creat_udp_client()
  end
  if Client.udp_server == nil then
    Client.creat_udp_server()
  end
end

function Client.udpSend(payload)
  if type(payload) == 'table' then
    payload = net.lua2json(payload)
  end
  --Tools.net.log({sent = payload})
  if (payload) then
    assert(Client.udp_client:send(payload))
  else
    timer.scheduleFunction(Client.udpReceive, {}, timer.getTime() + Client.dataTimeoutSec)
  end
end

function Client.udpReceive(args, time)
  local request = Client.udp_server:receive()
  if request ~= nil then
    local decodedRequest = Tools.json2lua(request)
    --Tools.net.log({received = decodedRequest})
    if decodedRequest then
      Client.handle(decodedRequest)
    else
      timer.scheduleFunction(Client.udpReceive, {}, timer.getTime() + Client.dataTimeoutSec)
    end
  end
  return time + Client.dataTimeoutSec
end

timer.scheduleFunction(Client.udpReceive, {}, timer.getTime() + Client.dataTimeoutSec)
