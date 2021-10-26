local status, error =
  pcall(
  function()
    dofile(lfs.writedir() .. 'Scripts/Debug/Hooks/Main.lua')
    dofile(lfs.writedir() .. 'Scripts/Debug/LoadMissionScript/Main.lua')
  end
)
if (not status) then
  net.log(string.format('Hooks 加载出错:%s', error))
else
  net.log('Hooks 加载完成')
end
