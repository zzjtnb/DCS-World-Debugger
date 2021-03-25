net.log("正在加载UDP.lua ...")
UDP = UDP or {}
UDP.receive = nil
UDP.socket = require("socket")
UDP.host = "127.0.0.1"
UDP.port = "20201"
UDP.udp = UDP.socket.udp()
UDP.udp:settimeout(0.001)
net.log("UDP.lua加载完毕")
