package.path = package.path .. ';./Scripts/?.lua'
package.path = package.path .. ';./LuaSocket/?.lua'
package.cpath = package.cpath .. ';./LuaSocket/?.dll'

Client = Client or {}
Client.host = '127.0.0.1'
Client.clientPort = 15487
Client.serverPort = 15488
Client.dataTimeoutSec = 0.2
Client.functions = {}
Client.isDev = false
Client.socket = require('socket')

dofile(lfs.writedir() .. 'Scripts/Debug/Tools/utils.lua')
dofile(lfs.writedir() .. 'Scripts/Debug/Client/UDP.lua')
dofile(lfs.writedir() .. 'Scripts/Debug/Client/Handle.lua')
dofile(lfs.writedir() .. 'Scripts/Debug/Client/Functions.lua')

Tools.setDevEnv(Client.isDev)
Client.creat_udp_client()
Client.creat_udp_server()
