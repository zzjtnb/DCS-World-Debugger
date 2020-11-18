local TableUtils = {}

---将多个表合并为一个,如果存在相同key则后面的会覆盖前面的
---@param ...table 要合并的表
---@return table @ 合并后的表
---@usage local t1 = {a = 1,b = 2}
---@usage local t2 = {c = 3,d = 4}
---@usage local t3 = {d = 5,e = 6}
---@usage local t4=merge_tables(t1, t2,t3)
---@usage t4={a= 1,c= 3,b= 2,e= 6,d= 5}
function TableUtils.merge(...)
  local result = {}
  for _, t in ipairs({ ... }) do
    for k, v in pairs(t) do
      result[k] = v
    end
  end
  return result
end

--- 判断某个值是否包含在table中
---@param table any @ {'connect', 'disconnect', 'change_slot'}
---@param value any @ 'connect'
function TableUtils.contains(table, value)
  for _, v in ipairs(table) do
    if v == value then
      return true
    end
  end
  return false
end

--- 按照规定长度分割字符串转table
---@param str string 要分割的字符串
---@param max number 分割的长度
---@return table
function TableUtils.stringSlice2Table(str, max)
  local sliced = {}
  local flag = 0
  if #str < max then
    sliced[1] = str
  else
    for i = 0, #str, max do
      flag = flag + 1
      if i == 0 then
        sliced[flag] = string.sub(str, i, max)
      else
        sliced[flag] = string.sub(str, i + 1, i + max)
      end
    end
  end
  return sliced
end

return TableUtils
