local base        = _G

local StringUtils = {}

function StringUtils.toBuffer(data)
  local buffer = {}
  for i = 1, #data do
    local charCode = string.byte(data, i)
    table.insert(buffer, charCode)
  end
  return string.format("<Buffer %s>", table.concat(buffer, " "))
end

---去除字符串首尾的空格
---@param text string 需要处理的字符串
---@return string 处理后的字符串 ' hello world! ' -> 'hello world!'
function StringUtils.trim(text)
  return (text:gsub("^%s*(.-)%s*$", "%1"))
end

-- 按空格分割字符串转换table
---@param input string 需要处理的字符串
---@param delimiter string 按照什么字符分割,默认空格
---@return table|boolean 处理后的字符串 ' hello world! ' -> {[1]="hello",[2]="world!"}
function StringUtils.splittoTable(input, delimiter)
  input = StringUtils.trim(input)
  delimiter = base.tostring(delimiter or " ")
  if (delimiter == '') then
    return false
  end
  local pos, arr = 0, {}
  for st, sp in function()
    return base.string.find(input, delimiter, pos, true)
  end do
    base.table.insert(arr, base.string.sub(input, pos, st - 1))
    pos = sp + 1
  end
  base.table.insert(arr, base.string.sub(input, pos))
  --[[
      -- base.table.concat 函数来将表转换为字符串
      print(base.table.concat(arr, ",")) -- 输出 "{[1]="hello",[2]="world!"}"
    ]]
  return arr
end

--- 将字符串按指定大小分段,并返回包含这些段的表
---@param inputString string 要分段的字符串
---@param chunkSize? number 每段的大小,默认为 8k(8192 字节)
---@return table 包含字符串段的表
function StringUtils.chunkString(inputString, chunkSize)
  -- 设置每块数据的大小,例如 8 KB
  chunkSize = chunkSize or 8192 -- 默认值为 8192 字节
  local chunks = {}
  for i = 1, #inputString, chunkSize do
    table.insert(chunks, inputString:sub(i, i + chunkSize - 1))
  end
  return chunks
end

--- 截取字符串的前 `num` 个字符和后 `num` 个字符.
--- @param str string 要被截取的字符串.
--- @param num number 要截取的字符数量.
--- @return string front  字符串的前 `num` 个字符.
--- @return string back 字符串的后 `num` 个字符.
function StringUtils.trimEdges(str, num)
  -- 如果输入不是字符串,将其转换为字符串
  if type(str) ~= "string" then
    str = tostring(str)
  end
  local len = #str
  -- 检查字符串长度是否小于num，如果是，直接返回整个字符串
  if len <= num then
    return str, ""
  end
  local len = #str
  local front = string.sub(str, 1, num)
  local back = string.sub(str, len - num + 1, len)
  return front, back
end

return StringUtils
