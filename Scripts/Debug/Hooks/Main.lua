dofile(lfs.writedir() .. 'Scripts/Debug/Tools/utils.lua')
dofile(lfs.writedir() .. 'Scripts/Debug/Hooks/Callbacks.lua')
--loadstring
--[[
for k, v in pairs(net) do
  net.log("net." .. k)
end
for k, v in pairs(DCS) do
  net.log("DCS." .. k)
end
for k, v in pairs(Export) do
  net.log("Export." .. k)
end
--]]
--dotring(server)
--[[
for k, v in pairs(env) do
  env.info(k)
end
]]
