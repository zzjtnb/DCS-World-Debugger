-- package.path = package.path .. ';./Scripts/?.lua'
-- package.path = package.path .. ';./LuaSocket/?.lua'
-- package.cpath = package.cpath .. ';./LuaSocket/?.dll'
local install_dir = lfs.currentdir()
local saved_dir = lfs.writedir()

local guiBindPath = {
  'dxgui/bind/?.lua',
  'dxgui/loader/?.lua',
  'dxgui/skins/skinME/?.lua',
  'dxgui/skins/common/?.lua',
}
local scriptsPath = {
  'Scripts/?.lua',
  'Scripts/Debug/?.lua',
  'Scripts/Common/?.lua',
  'Scripts/UI/?.lua',
  'Scripts/UI/F10View/?.lua',
  'Scripts/UI/View/?.lua',
  'Scripts/UI/Multiplayer/?.lua',
  'Scripts/DemoScenes/?.lua',
}
local missionEditorPath = {
  'MissionEditor/?.lua',
  'MissionEditor/modules/?.lua',
  'MissionEditor/modules/Options/?.lua',
}
local LuaSocketPath = {
  'LuaSocket/?.lua',
}
local cpath = {
  'bin/?.dll',
  'LuaSocket/?.dll',
}
local userPath = {
  'Scripts/statistics/?.lua',
}

function setPackagePath(path, dir)
  local path_dir = install_dir
  if dir then
    path_dir = dir
  end
  for k, v in pairs(path) do
    package.path = package.path .. path_dir .. v .. ';'
  end
end
function setPackageCpath(path, dir)
  local path_dir = install_dir
  if dir then
    path_dir = dir
  end
  for k, v in pairs(path) do
    package.cpath = package.cpath .. path_dir .. v .. ';'
  end
end

setPackagePath(guiBindPath)
setPackagePath(scriptsPath)
setPackagePath(LuaSocketPath)
setPackagePath(missionEditorPath)
setPackageCpath(cpath)
setPackagePath(userPath, saved_dir)

ZZJT = require('ZZJT')
TCP = require("TCP")
me_chats = require('me_chats')
Statistics = require('Statistics')
