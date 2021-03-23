local loadVersion = "Version3.0"
net.log("INFO Debug调试器->正在加载")
dofile(lfs.writedir() .. "Scripts/Debug/" .. loadVersion .. "/UDP.lua")
dofile(lfs.writedir() .. "Scripts/Debug/" .. loadVersion .. "/TCP.lua")
dofile(lfs.writedir() .. "Scripts/Debug/" .. loadVersion .. "/common.lua")
dofile(lfs.writedir() .. "Scripts/Debug/" .. loadVersion .. "/Debugger.lua")
net.log("INFO Debug调试器->已全部加载")
