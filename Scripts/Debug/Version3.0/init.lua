net.log("INFO: Lua调试器-->正在加载...")
local loadVersion = "Version3.0"
local status, error =
  pcall(
  function()
    dofile(lfs.writedir() .. "Scripts/Debug/" .. loadVersion .. "/Common/Config.lua")
    dofile(lfs.writedir() .. "Scripts/Debug/" .. loadVersion .. "/Common/Tools.lua")
    dofile(lfs.writedir() .. "Scripts/Debug/" .. loadVersion .. "/Common/Logger.lua")
    dofile(lfs.writedir() .. "Scripts/Debug/" .. loadVersion .. "/TCP/Client.lua")
    dofile(lfs.writedir() .. "Scripts/Debug/" .. loadVersion .. "/TCP/Server.lua")
    dofile(lfs.writedir() .. "Scripts/Debug/" .. loadVersion .. "/Callbacks/TCP.lua")
  end
)
if (not status) then
  net.log(string.format("ERROR: Lua调试器加载失败:"), error)
else
  net.log("INFO: Lua调试器-->全部加载完毕...")
end
