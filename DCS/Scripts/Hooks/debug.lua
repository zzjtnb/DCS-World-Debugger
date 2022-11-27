-- 是否重置MissionScripting.lua
_G['DEBUG_RESET'] = false

local status, error = pcall(function()
  dofile(lfs.writedir() .. 'Scripts/Debug/Init.lua')
end)
if (not status) then
  net.log(string.format('ERROR: Hooks 加载出错:%s', error))
else
  net.log('INFO: debug Hooks 加载完成')
end
