if zzjtnbUDP == nil then
  net.log('正在加载zzjtnbUDP.lua ...')
  zzjtnbUDP = {}
  zzjtnbUDP.receive = nil
  zzjtnbUDP.socket = require('socket')
  zzjtnbUDP.host = '127.0.0.1'
  zzjtnbUDP.port = '8088'
  zzjtnbUDP.udp = zzjtnbUDP.socket.udp()
  -- zzjtnbUDP.udp:setpeername(zzjtnbUDP.host, zzjtnbUDP.port)
  zzjtnbUDP.udp:settimeout(0) -- REALLY short timeout.  Asynchronous operation required.
  net.log('zzjtnbUDP.lua加载完毕')
end
