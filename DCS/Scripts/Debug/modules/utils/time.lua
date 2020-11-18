local Time = {}

--- 获取系统时间
---@return table @{os:'',real:'',model:''}
function Time.current()
  local times = {
    os = os.date('%Y-%m-%d %H:%M:%S'),
  }
  if DCS then
    times.real = DCS.getRealTime()
    times.model = DCS.getModelTime()
  end
  return times
end

--- 从给定的总秒数中获取时间组件(小时,分钟,秒).
--- @param totalSeconds number|nil 总秒数.如果为 nil,则默认为 0.
--- @return number, number, number
--- 示例:
--- getTime(3661) -- 返回 1, 1, 1
function Time.format(totalSeconds)
  -- 如果 totalSeconds 为 nil,则将其设置为 0
  totalSeconds = totalSeconds or 0
  -- 计算一天的秒数
  local secondsPerDay = 60 * 60 * 24
  -- 从 totalSeconds 中提取出天数后的时间
  local timeInSeconds = totalSeconds - math.floor(totalSeconds / secondsPerDay) * secondsPerDay
  -- 计算小时,分钟和秒
  local hours = math.floor(timeInSeconds / 3600)
  local minutes = math.floor((timeInSeconds % 3600) / 60)
  local seconds = timeInSeconds % 60
  -- 返回时间组件
  return hours, minutes, seconds
end

return Time
