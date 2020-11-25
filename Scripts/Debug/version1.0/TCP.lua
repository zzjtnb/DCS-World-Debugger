if TCP == nil then
  net.log("正在加载UDP.lua ...")
  TCP = {}
  TCP.host = "localhost"
  TCP.port = "8888"
  --------------------------------    定义TCP的callbacks  --------------------------------
  TCP.callbacks = {}
  function TCP.callbacks.onSimulationStart()
    socket = require("socket")
    TCP.server = socket.tcp()
    assert(TCP.server:bind(TCP.host, TCP.port))
    assert(TCP.server:listen()) --转为服务器
    TCP.server:settimeout(1) -- 设置超时时间
    TCP.server:setoption("reuseaddr", true) --重用地址
    -- TCP.server:setoption('keepalive', false) -- 设置保持连接
    TCP.server:setoption("tcp-nodelay", true) -- 设置即时传输模式
    TCP.client = TCP.server:accept() -- 连接的客户端
  end
  DCS.setUserCallbacks(TCP.callbacks)
  net.log("TCP.lua加载完毕")
end
