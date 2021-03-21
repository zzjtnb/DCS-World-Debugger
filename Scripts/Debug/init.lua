local loadVersion = "version3.0"
dofile(lfs.writedir() .. "Scripts/Debug/" .. loadVersion .. "/UDP.lua")
dofile(lfs.writedir() .. "Scripts/Debug/" .. loadVersion .. "/common.lua")
dofile(lfs.writedir() .. "Scripts/Debug/" .. loadVersion .. "/TCP.lua")
dofile(lfs.writedir() .. "Scripts/Debug/" .. loadVersion .. "/Debugger.lua")
net.log("DebugInit 全部加载完毕")
