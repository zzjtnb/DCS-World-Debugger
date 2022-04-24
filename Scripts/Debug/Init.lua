local status, error =
  pcall(
  function()
    dofile(lfs.writedir() .. 'Scripts/Debug/Callbacks/Init.lua')
    dofile(lfs.writedir() .. 'Scripts/Debug/LoadMissionScript/Init.lua')
  end
)
if (not status) then
  net.log(string.format('ERROR: Debug 加载出错:%s', error))
else
  net.log('INFO: Debug 加载完成')
end
