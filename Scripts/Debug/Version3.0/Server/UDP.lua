--- LuaSocket UDP 客户端 -- LuaSocket UDP Client
UDP = UDP or {}
UDP.socket = require("socket")
UDP.host = "127.0.0.1"
UDP.port = "20201"
UDP.udp = UDP.socket.udp()
UDP.udp:settimeout(0.001)
