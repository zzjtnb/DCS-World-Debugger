net.log("INFO: Lua调试器-->正在加载...")
local loadVersion = "Version3.0"
local status, error =
  pcall(
  function()
    -- Load Luas
    package.path = package.path .. ";./LuaSocket/?.lua"
    package.path = package.path .. ";./Scripts/?.lua"
    package.cpath = package.cpath .. ";./LuaSocket/?.dll"
    dofile(lfs.writedir() .. "Scripts/Debug/" .. loadVersion .. "/Common/Logger.lua")
    dofile(lfs.writedir() .. "Scripts/Debug/" .. loadVersion .. "/Common/Debugger.lua")
    dofile(lfs.writedir() .. "Scripts/Debug/" .. loadVersion .. "/Server/UDP.lua")
    dofile(lfs.writedir() .. "Scripts/Debug/" .. loadVersion .. "/Server/TCP.lua")
    dofile(lfs.writedir() .. "Scripts/Debug/" .. loadVersion .. "/Debugger/UDP_Debugger.lua")
    dofile(lfs.writedir() .. "Scripts/Debug/" .. loadVersion .. "/Debugger/TCP_Debugger.lua")
  end
)
if (not status) then
  net.log(string.format("ERROR: Lua调试器加载失败:%s", error))
else
  net.log("INFO: Lua调试器-->全部加载完毕...")
end
