package.path = package.path .. ';./Scripts/?.lua'
package.path = package.path .. ';./LuaSocket/?.lua'
package.cpath = package.cpath .. ';./LuaSocket/?.dll'

TCP = TCP or {}
TCP.host = '127.0.0.1'
TCP.ownPort = 15488
TCP.distantPort = 15487
TCP.dataTimeoutSec = 0.2
TCP.functions = {}
TCP.isDev = false
TCP.socket = require('socket')

dofile(lfs.writedir() .. 'Scripts/Debug/Tools/utils.lua')
dofile(lfs.writedir() .. 'Scripts/Debug/Client/TCP.lua')
dofile(lfs.writedir() .. 'Scripts/Debug/Client/Handle.lua')
dofile(lfs.writedir() .. 'Scripts/Debug/Client/Functions.lua')

Tools.setDevEnv(TCP.isDev)
TCP.step()
