local base = _G
local lfs = require("lfs")
--- 日志级别枚举
--- @enum levels
local levels = { debug = 0, info = 1, warning = 2, error = 3 }

--- Logger 类用于处理日志记录到文件和控制台
--- @class Logger
--- @field file string --日志文件的路径
--- @field to_console boolean 是否将日志消息记录到控制台(默认为true)
--- @field levels table<string,number> 日志级别与其数值的映射
--- @field level number 要记录的最小日志级别{ debug = 0, info = 1, warning = 2, error = 3 }
--- @field max_size number 日志文件的最大文件大小.默认500KB
--- @field size number 当前日志文件的大小.
local Logger = {}
Logger.__index = Logger


--- LoggerConfig类用于配置Logger的选项
---@class LoggerConfig
---@field file string 日志文件的路径.
---@field to_console boolean 是否将日志消息记录到控制台(默认为true).
---@field level string 要记录的最小日志级别(debug,info,warning,error).
---@field max_size number 日志文件的最大大小(字节,默认为500KB).

--- 创建一个新的Logger实例.
--- @param config LoggerConfig 用于配置日志记录器的选项
--- @return Logger Logger实例
function Logger:new(config)
  local logger = setmetatable({}, Logger)
  logger.file = config.file
  logger.to_console = config.to_console or false
  logger.level = levels[config.level or "debug"]
  logger.max_size = config.max_size or (1024 * 500) -- 默认500KB
  logger.size = 0

  if logger.file then
    logger.file_handle = base.io.open(logger.file, "a")
    if not logger.file_handle then
      logger:error("无法打开日志文件")
    else
      logger.size = logger:get_file_size()
    end
  end

  return logger
end

--- 获取当前文件大小.
---@return integer size #文件大小(字节)
function Logger:get_file_size()
  if not self.file_handle then return 0 end
  local file_info = lfs.attributes(self.file)
  if file_info then
    return file_info.size
  else
    self:error("无法获取日志文件大小")
    return 0
  end
end

--- 判断是否应该进行日志文件轮转
---@return boolean #如果文件大小超过最大大小,则返回true;否则返回false
function Logger:should_rotate()
  return self.size > self.max_size
end

--- 执行日志文件轮转
function Logger:rotate()
  self:close()
  local rotated_file = self.file .. base.os.date("_%Y-%m-%d_%H-%M-%S")
  local success, err = base.os.rename(self.file, rotated_file)
  if not success then
    self:error("无法重命名日志文件")
  else
    self.file_handle = base.io.open(self.file, "a")
    if not self.file_handle then
      self:error("无法重新打开日志文件")
    else
      self.size = 0
    end
  end
end

--- 记录日志消息
---@param level string 日志级别(debug,info,warning,error).
---@param message string 要记录的消息.
function Logger:message(level, message, ...)
  local level_value = levels[level]
  if not level_value or level_value < self.level then return end

  local extra_messages = { ... }
  local time = base.os.date("%Y-%m-%d %H:%M:%S")
  local log_message = string.format("%s %s %s %s\n", time, level:upper(), message,
    table.concat(extra_messages))
  if self.file_handle then
    self.file_handle:write(log_message)
    self.file_handle:flush()
    self.size = self.size + #log_message
  end

  if self.to_console then
    if net then
      ---@diagnostic disable-next-line: undefined-field
      net.log(message)
    else
      base.print(log_message)
    end
  end
end

--- 记录调试消息
---@param message string 要记录的消息
function Logger:debug(message, ...)
  self:message("debug", message, ...)
end

--- 记录信息消息
---@param message string 要记录的消息
function Logger:info(message, ...)
  self:message("info", message, ...)
end

--- 记录警告消息
---@param message string 要记录的消息
function Logger:warning(message, ...)
  self:message("warning", message, ...)
end

--- 记录错误消息
---@param message string 要记录的消息
function Logger:error(message, ...)
  self:message("error", message, ...)
end

--- 关闭日志文件
function Logger:close()
  if self.file_handle then
    self.file_handle:close()
    self.file_handle = nil
  end
end

return Logger


--[[
local Logger = require("utils.logger")
local config = require("config")

local logger = Logger:new(config.client.log)
-- 记录不同级别的日志
logger:debug("这是一个调试消息")
logger:info("这是一个信息消息")
logger:warning("这是一个警告消息")
logger:error("这是一个错误消息")
logger:close()
]]
