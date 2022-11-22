TCP = {}
TCP.isDev = false
TCP.ownPort = 8888
TCP.distantPort = 6666
TCP.host = "127.0.0.1"
TCP.dataTimeoutSec = 10
TCP.MAX_PAYLOAD_SIZE = 8192
TCP.server = nil
TCP.client = nil

dofile(lfs.writedir() .. 'Scripts/Debug/Tools/utils.lua')
dofile(lfs.writedir() .. 'Scripts/Debug/Server/TCP.lua')
dofile(lfs.writedir() .. 'Scripts/Debug/Server/Handle.lua')
dofile(lfs.writedir() .. 'Scripts/Debug/Server/Functions.lua')

Tools.env.setDevEnv(TCP.isDev)
TCP.step()
