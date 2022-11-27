TCP = {}
-- 关闭错误弹窗,输出发送信息
TCP.isDev = false
TCP.ownPort = 8888
TCP.distantPort = 6666
TCP.host = "127.0.0.1"
TCP.dataTimeoutSec = 0.1
TCP.MAX_PAYLOAD_SIZE = 8192
TCP.server = nil
TCP.client = nil

dofile(lfs.writedir() .. 'Scripts/Debug/Tools/utils.lua')
dofile(lfs.writedir() .. 'Scripts/Debug/Socket/TCP.lua')
dofile(lfs.writedir() .. 'Scripts/Debug/Socket/Handle.lua')
dofile(lfs.writedir() .. 'Scripts/Debug/Socket/Functions.lua')

Tools.env.setDevEnv(TCP.isDev)
