-- module name. All function in this file, if used outside, should be called "Tools.functionname"
module('Tools', package.seeall)

date = os.date('%Y-%m-%d %H:%M:%S')

--- 安全执行loadstring方法
---@param code string @要执行的代码
---@return any,boolean
function safe_loadstring(code)
  local chunk, err = loadstring(code)
  if chunk then
    local status, result = pcall(chunk)
    if status then
      return result, true
    else
      return result, false
    end
  else
    return err, false
  end
end

------------------------------------------- env -------------------------------------------

function setDevEnv(isDev)
  env.setErrorMessageBoxEnabled(isDev)
end

---lua table转字符串
---@param table table
---@return string
function lua2json(table)
  local status, result = pcall(function(data)
    return net.lua2json(data)
  end, table)
  return result, status
end

--- json字符串转lua table
---@param table string
---@return boolean,table
function json2lua(message)
  local status, result = pcall(function(data)
    return net.json2lua(data)
  end, message)
  return status, result
end

------------------------------------------- time -------------------------------------------

--- 获取系统时间
---@return table @{os:'',real:'',model:''}
function getTimeStamp()
  local time = {
    os = os.date('%Y-%m-%d %H:%M:%S')
  }
  if DCS then
    time.real = DCS.getRealTime()
    time.model = DCS.getModelTime()
  end
  return time
end

--- 根据秒数返回时间串
---@usage 处理前:33000
---@usage 处理后: 09:10:00
function getTimeString(time)
  local hours = math.floor(time / 3600)
  local minutes = math.floor((time % 3600) / 60)
  local seconds = math.floor(time % 60)
  if (hours < 10) then
    hours = "0" .. hours
  end
  if (minutes < 10) then
    minutes = "0" .. minutes
  end
  if (seconds < 10) then
    seconds = "0" .. seconds
  end
  local time = " " .. hours .. ":" .. minutes .. ":" .. seconds
  return time
end

-------------------------------------------  目录 -------------------------------------------
--- 获取文件名(get filename)
---@param filePath string
---@return string 文件名
function getFileName(filePath)
  local idx = filePath:match('.+()%.%w+$')
  if (idx) then
    return filePath:sub(1, idx - 1)
  else
    return filePath
  end
end

-- 获取文件后缀(get file postfix)
---@param filePath string 文件名或者路径
---@return string 后缀名
function getExtension(filePath)
  return filePath:match('.+%.(%w+)$')
end

function attrdir(rootpath)
  for entry in lfs.dir(rootpath) do
    -- 过滤"."和".."目录
    if entry ~= '.' and entry ~= '..' then
      local path = rootpath .. '\\' .. entry
      local attr = lfs.attributes(path)
      local filename = getFileName(entry)
      -- 如果是是目录，就递归调用，否则就写入文件
      if attr.mode ~= 'directory' then
        local postfix = getExtension(entry)
        net.log(filename .. '\t' .. attr.mode .. '\t' .. postfix)
        attrdir(path)
      else
        net.log(path)
      end
    end
  end
end

-------------------------------------------  table -------------------------------------------
-- 合并两个table
---@vararg table @要合并的表
---@return table @后缀名
MergeTables = function(...)
  local tabs = {...}
  if not tabs then
    return {}
  end
  local origin = tabs[1]
  for i = 2, #tabs do
    if origin then
      if tabs[i] then
        for k, v in pairs(tabs[i]) do
          origin[k] = v
        end
      end
    else
      origin = tabs[i]
    end
  end
  return origin
end

---按指定参数合并表
---@usage args=name,tb1={name:"张三",age:18},tb2={name:"张三",age:18} return tb={name:"张三",age:18}
---@param args string @根据哪个key合并
---@vararg table @要合并的表
---@return table @按参数合并后的表
ArgsMergeTables = function(args, ...)
  local tabs = {...}
  if not tabs then
    return {}
  end
  local origin = tabs[1]
  for i = 2, #tabs do
    if origin then
      if tabs[i] then
        for k, v in pairs(tabs[i]) do
          if tabs[i][args] == origin[args] then
            origin[k] = v
          end
        end
      end
    else
      origin = tabs[i]
    end
  end
  return origin
end
-------------------------------------------  字符串 -------------------------------------------
--- func desc
---@usage val={code = 200,msg = 'Hello World'}  return ["code"]=200,["msg"]="Hello World",}
---@usage val='Hello World'  return 'Hello World'

---@param val any
function value2string(val)
  local t = type(val)
  if t == "number" or t == "boolean" then
    return tostring(val)
  elseif t == "table" then
    local str = ''
    for k, v in pairs(val) do
      str = str .. '[' .. value2string(k) .. ']=' .. value2string(v) .. ','
    end
    return '{' .. str .. '}'
  else
    return string.format("%q", tostring(val))
  end
end

function value2code(val)
  return 'return ' .. value2string(val)
end

function value2table(val)
  return value2string(val)
end

--- 判断变量是否为空
---@usage isempty(nil)->true
---@usage isempty('')->true
---@usage isempty('d')->false
---@usage isempty({})->true
---@param s any
---@return boolean
function isempty(s)
  if type(v) == 'table' then
    return next(s) == nil
  end
  return s == nil or s == ''
end

--- 按照规定长度分割字符串转lua table
---@param str string 要分割的字符串
---@param max number 分割的长度
---@return table
function stringSlice2Table(str, max)
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

-- 把function转为字符串类型
---@param f function @需要转换的function
---@return string @处理后的字符串
function get_source_code(f)
  local t = debug.getinfo(f)
  if t.linedefined < 0 then
    print('source', t.source)
    return
  end
  local name = t.source:gsub('^@', '')
  local i = 0
  local text = {}
  for line in io.lines(name) do
    i = i + 1
    if i >= t.linedefined then
      text[#text + 1] = line
    end
    if i >= t.lastlinedefined then
      break
    end
  end
  return table.concat(text, '\n')
end

-- 转为字符串类型
---@param v boolean|number|string|table|function @需要处理的数据
---@return string @处理后的字符串
function data2string(v)
  if type(v) == 'table' then
    v = lua2json(v)
  end
  if type(v) == 'boolean' then
    v = tostring(v)
  end
  if type(v) == 'function' then
    v = get_source_code(v)
  end
  return v
end

---去除字符串首尾的空格
---@param str string 需要处理的字符串
---@return string 处理后的字符串 ' hello world! ' -> 'hello world!'
function string_trim(s)
  return (s:gsub("^%s*(.-)%s*$", "%1"))
end

-- 按空格分割字符串转换table
---@param input string 需要处理的字符串
---@param delimiter string 按照什么字符分割,默认空格
---@return table|boolean 处理后的字符串 ' hello world! ' -> {[1]="hello",[2]="world!"}
function string_split_to_table(input, delimiter)
  input = string_trim(input)
  delimiter = tostring(delimiter or " ")
  if (delimiter == '') then
    return false
  end
  local pos, arr = 0, {}
  for st, sp in function()
    return string.find(input, delimiter, pos, true)
  end do
    table.insert(arr, string.sub(input, pos, st - 1))
    pos = sp + 1
  end
  table.insert(arr, string.sub(input, pos))
  --[[
      -- table.concat 函数来将表转换为字符串
      print(table.concat(arr, ",")) -- 输出 "{[1]="hello",[2]="world!"}"
    ]]
  return arr
end

