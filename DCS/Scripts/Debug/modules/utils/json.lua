local base = _G

local utils = {}
---lua table转字符串
---@param tab any
---@return string,boolean
function utils.lua2json(tab)
  if not net then
    return tab, false
  end
  local status, result = pcall(net.lua2json, tab)
  return tostring(result), status
end

--- json字符串转lua table
---@param str string
---@return table|string,boolean
function utils.json2lua(str)
  if not net then
    return str, false
  end
  local status, result = pcall(net.json2lua, str)
  return result, status
end

return utils
