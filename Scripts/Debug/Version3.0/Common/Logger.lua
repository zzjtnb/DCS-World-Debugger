Debugger = Debugger or {}
-- Debug
Debugger.DebugMode = 0
-- (int) [0 (default),1,2] Value greater than 0 will display ServerData information in DCS log file, values: 1 - minimal verbose, 2 - all log information will be logged
-- (int)[0 (默认),1,2]值大于0将在DCS日志文件中显示ServerData信息,值：1-最小详细信息，2-将记录所有日志信息
---将日志添加到DCS.log文件
---@param text string --数据
---@param LogLevel number --日志等级
Debugger.AddLog = function(text, LogLevel)
  -- Adds logs to DCS.log file
  if ServerData.DebugMode >= LogLevel then
    net.log("[Debug 调试]-->" .. text)
  end
end
