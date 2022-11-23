dofile(lfs.writedir() .. 'Scripts/Debug/LoadMissionScript/Init.lua')

if _G['DEBUG_DEV'] then
  dofile(lfs.writedir() .. 'Scripts/Debug/Callbacks/Init.lua')
end
