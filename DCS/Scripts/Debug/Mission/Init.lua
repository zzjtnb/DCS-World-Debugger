xpcall(function()
  dofile(lfs.writedir() .. 'Scripts/Debug/Server/Init.lua')
  dofile(lfs.writedir() .. 'Scripts/Debug/Mission/Event.lua')
end, function(err)
  local info = debug.traceback()
  net.log('Debug Mission 加载出错:', err, info)
end)
