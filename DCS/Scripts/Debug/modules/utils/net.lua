local base = _G
local utils_net = {}

--- 安全执行 loadstring 方法
---@param codeText string @要执行的代码
---@return any,boolean
function utils_net.safe_loadstring(codeText)
  local status, result, fn = false, nil, nil
  fn, result = base.loadstring(codeText)
  if fn then
    status, result = pcall(fn)
  end
  return result, status
end

--- 安全执行 loadstring 方法
---@param state string @要执行的环境
---@param codeText string @要执行的代码
---@return any,boolean
function utils_net.dostring_in(state, codeText)
  -- net.dostring_in(state, string) -> result, status
  -- 在给定的内部 lua-state 中执行一个 lua-string 并返回一个字符串结果
  -- 返回的内容必须是一个字符串
  local result, status = net.dostring_in(state, codeText)
  return result, status
end

return utils_net
