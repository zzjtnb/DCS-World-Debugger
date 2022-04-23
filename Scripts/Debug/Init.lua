local status, error =
  pcall(
  function()
    dofile(lfs.writedir() .. 'Scripts/Debug/Callbacks/Init.lua')
    dofile(lfs.writedir() .. 'Scripts/Debug/LoadMissionScript/Init.lua')
  end
)
if (not status) then
  net.log(string.format('Debug 加载出错:%s', error))
else
  net.log('Debug 加载完成')
end
