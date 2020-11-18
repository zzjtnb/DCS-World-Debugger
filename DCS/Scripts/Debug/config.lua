-- config.lua
local base     = _G
local lfs      = base.require("lfs")
local writedir = lfs.currentdir() .. "/log"
print(writedir)

local function saveFilePath(file)
  -- 检查是否存在 writedir 方法
  if type(lfs.writedir) == "function" then
    writedir = lfs.writedir() .. 'Logs/Debug'
  end
  if not lfs.attributes(writedir) then
    lfs.mkdir(writedir)
  end
  return string.format("%s/%s", writedir, file)
end


-- 配置文件
local config = {
  MAX_LENGTH = 1024,
  server = {
    host = "localhost",                  -- 服务器地址
    port = 9001,                         -- 服务器监听的端口号
    log = {
      file = saveFilePath('server.log'), -- 日志文件路径,可以为空,表示不写日志文件
      -- to_console = true,                 -- 是否输出到控制台
      level = "debug",                   -- 日志级别
      max_size = 1024 * 500,             -- 最大文件大小 500KB
    }
  },
  client = {
    host = "localhost",                  -- 服务器地址
    port = 9000,                         -- 客户端连接的端口号
    log = {
      file = saveFilePath('client.log'), -- 日志文件路径,可以为空,表示不写日志文件
      -- to_console = true,                 -- 是否输出到控制台
      level = "debug",                   -- 日志级别
      max_size = 1024 * 500,             -- 最大文件大小 500KB
    }
  },
}
return config
