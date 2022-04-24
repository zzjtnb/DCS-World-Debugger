local status, error =
  pcall(
  function()
    dofile(lfs.writedir() .. 'Scripts/Debug/Callbacks/Init.lua')
    dofile(lfs.writedir() .. 'Scripts/Debug/LoadMissionScript/Init.lua')
  end
)
if (not status) then
  Tools.net.err(string.format('Debug 加载出错:%s', error))
else
  Tools.net.info('Debug 加载完成')
end
