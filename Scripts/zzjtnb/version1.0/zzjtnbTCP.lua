if zzjtnbTCP == nil then
  net.log('正在加载zzjtnbUDP.lua ...')
  zzjtnbTCP = {}
  zzjtnbTCP.host = 'localhost'
  zzjtnbTCP.port = '3001'
  --------------------------------    定义zzjtnbTCP的callbacks  --------------------------------
  zzjtnbTCP.callbacks = {}
  function zzjtnbTCP.callbacks.onSimulationStart()
    socket = require('socket')
    zzjtnbTCP.server = socket.tcp()
    assert(zzjtnbTCP.server:bind(zzjtnbTCP.host, zzjtnbTCP.port))
    assert(zzjtnbTCP.server:listen()) --转为服务器
    zzjtnbTCP.server:settimeout(1) -- 设置超时时间
    zzjtnbTCP.server:setoption('reuseaddr', true) --重用地址
    -- zzjtnbTCP.server:setoption('keepalive', false) -- 设置保持连接
    zzjtnbTCP.server:setoption('tcp-nodelay', true) -- 设置即时传输模式
    zzjtnbTCP.client = zzjtnbTCP.server:accept() -- 连接的客户端
  end
  DCS.setUserCallbacks(zzjtnbTCP.callbacks)
  net.log('zzjtnbTCP.lua加载完毕')
end
