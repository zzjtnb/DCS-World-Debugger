local lfs = require("lfs")
local function getParentDirectory(currentDirectory, levelsToRemove)
  levelsToRemove = levelsToRemove or 1
  local parts = {}
  for part in currentDirectory:gmatch("[^\\]+") do
    table.insert(parts, part)
  end
  local parentPath = table.concat(parts, "/", 1, #parts - levelsToRemove)
  if levelsToRemove > 0 then
    parentPath = parentPath .. "/"
  end
  return parentPath
end

local currentdir = lfs.currentdir()
local projectPath = getParentDirectory(currentdir, 2)

local function addToPackagePath(paths)
  for _, path in ipairs(paths) do
    package.path = package.path .. ";" .. projectPath .. path
  end
end

local paths = {
  'Scripts/Debug/?.lua',
  'Scripts/Debug/modules/?.lua',
}

addToPackagePath(paths)

print(package.path)

-- local base = _G
-- local Logger = require("utils.logger")
-- local config = require("config")

-- local logger = Logger:new(config.client.log)
-- -- 记录不同级别的日志
-- logger:debug("这是一个调试消息")
-- logger:info("这是一个信息消息")
-- logger:warning("这是一个警告消息")
-- logger:error("这是一个错误消息")
-- logger:close()

-- local str = 'd7000quit\r\n'
-- local result = str:gsub("\r\n$", ""):gsub("quit$", "")
-- print(result) -- 输出 "d7000"
-- print(#'\r\n', #'quit\r\n', #'d7000', #str, result, #result)

-- local str = '7000quit\r\n'
-- local result = str:gsub("quit\r\n$", "")
-- print(result)


local TCP = require("tcp")
TCP.server:start()
