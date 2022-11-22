-- 用于把./MissionScripting.lua中的脚本加载到游戏安装目录下的Scripts/Mission/目录下
LoadMissionScript = LoadMissionScript or {}
LoadMissionScript.error = function(msg)
  msg = tostring(msg)
  local newMsg = 'ERROR: 加载任务脚本 ' .. msg
  net.log(newMsg)
end

LoadMissionScript.warning = function(msg)
  msg = tostring(msg)
  local newMsg = 'WARNING: 加载任务脚本 ' .. msg
  net.log(newMsg)
end

LoadMissionScript.info = function(msg)
  msg = tostring(msg)
  local newMsg = 'INFO: 加载任务脚本 ' .. msg
  net.log(newMsg)
end
LoadMissionScript.info('初始化:正在加载...')

local currentPath = lfs.currentdir() .. 'Scripts/MissionScripting.lua'
local writePath = lfs.writedir() .. 'Scripts/Debug/LoadMissionScript/MissionScripting.lua'

-- 加载任务环境脚本
local curMSf, err = io.open(currentPath, 'r')

if curMSf then
  local LoadMissionScriptMSf, err = io.open(writePath, 'r')

  if LoadMissionScriptMSf then
    local curMS = curMSf:read('*all')
    local LoadMissionScriptMS = LoadMissionScriptMSf:read('*all')
    curMSf:close()
    LoadMissionScriptMSf:close()
    local curMSfunc, err = loadstring(curMS)
    if curMSfunc then
      local LoadMissionScriptMSfunc, err = loadstring(LoadMissionScriptMS)
      if LoadMissionScriptMSfunc then
        if string.dump(curMSfunc) ~= string.dump(LoadMissionScriptMSfunc) and curMS ~= LoadMissionScriptMS then -- 尝试安装...第一个条件应该足以进行测试，但恐怕它可能取决于系统。
          LoadMissionScript.warning(currentPath .. '不是最新的,正在安装新的脚本...')
          local newMSf, err = io.open(currentPath, 'w')
          if newMSf then
            newMSf:write(LoadMissionScriptMS)
            newMSf:close()
          else
            LoadMissionScript.error('无法打开' .. currentPath .. '进行写作，原因如下:' .. tostring(err))
          end
        else
          -- 无需安装
          LoadMissionScript.info(currentPath .. '是最新的,无需安装.')
          return true
        end
      else
        LoadMissionScript.error('无法编译 ' .. writePath ', 原因: ' .. tostring(err))
      end
    else
      LoadMissionScript.error('无法编译' .. currentPath .. ',原因: ' .. tostring(err))
    end
  else
    LoadMissionScript.error('无法打开 ' .. writePath .. '用于读取,原因: ' .. tostring(err))
  end
else
  LoadMissionScript.error('无法打开 ' .. currentPath .. '用于读取,原因: ' .. tostring(err))
end

LoadMissionScript.info(lfs.writedir() .. 'Scripts/Debug/LoadMissionScript/Init.lua加载完成.')
