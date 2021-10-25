--Initialization script for the Mission lua Environment (SSE)
dofile('Scripts/ScriptingSystem.lua')
-- -- Add LuaSocket to the LUAPATH, so that it can be found.
-- package.path = package.path .. ';.\\LuaSocket\\?.lua;'
-- package.cpath = package.cpath .. ';.\\LuaSocket\\?.dll'
-- local socket = require('socket')
-- -- Connect to the debugger, first require it.
-- local initconnection = require('debugger')
-- -- Now make the connection..
-- -- "127.0.0.1" is the localhost.
-- -- 1000 is the timeout in ms on IP level.
-- -- "dcsserver" is the name of the server. Ensure the same name is used at the Debug Configuration panel!
-- -- nil (is for transport protocol, but not using this)
-- -- "win" don't touch. But is important to indicate that we are in a windows environment to the debugger script.
-- initconnection('127.0.0.1', 10000, 'dcsserver', nil, 'win', 'D:\\Office\\Java\\workspace\\DCS World')

-----------------------------------任务环境脚本-----------------------------------

dofile(lfs.writedir() .. 'Scripts/Debug/Mission/Main.lua')

-----------------------------------清理任务脚本环境-----------------------------------

--Sanitize Mission Scripting environment
--This makes unavailable some unsecure functions.
--Mission downloaded from server to client may contain potentialy harmful lua code that may use these functions.
--You can remove the code below and make availble these functions at your own risk.

local function sanitizeModule(name)
  _G[name] = nil
  package.loaded[name] = nil
end
do
  -- sanitizeModule("os")
  -- sanitizeModule("io")
  -- sanitizeModule("lfs")
  sanitizeModule('debug') -- 恶意任务无法脱离沙盒并使用LuaSocket。
  -- require = nil
  -- loadlib = nil
end
