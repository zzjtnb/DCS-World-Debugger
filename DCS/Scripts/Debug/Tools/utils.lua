Tools = Tools or {}
Tools.net = Tools.net or {}
Tools.env = Tools.env or {}
Tools.date = os.date('%Y-%m-%d %H:%M:%S')

------------------------------------------- Tools env -------------------------------------------
Tools.env.JSON = loadfile('Scripts/JSON.lua')()
function Tools.env.JSON:onDecodeError(message)
  env.err('While decoding JSON data -> ')
  env.info(message)
end

function Tools.env.JSON:onEncodeError(message)
  env.err('While encoding JSON data -> ')
  env.info(message)
end

function Tools.env.setDevEnv(isDev)
  env.setErrorMessageBoxEnabled(isDev)
end

------------------------------------------- Tools.net -------------------------------------------
function Tools.net.info(v)
  net.log('INFO: ' .. Tools.value2string(v))
end

function Tools.net.error(v)
  net.log('ERROR: ' .. Tools.value2string(v))
end

---lua table转字符串
---@param table table
---@return string
function Tools.net.lua2json(table)
  local status, result = pcall(function(data)
    return net.lua2json(data)
  end, table)
  return result, status
end

--- json字符串转lua table
---@param table string
---@return boolean,table
function Tools.net.json2lua(message)
  local status, result = pcall(function(data)
    return net.json2lua(data)
  end, message)
  return status, result
end

------------------------------------------- Tools -------------------------------------------
--- loadstring方法
---@param code string @要执行的代码
---@return any,boolean
Tools.loadstring = function(code)
  local status, retval = pcall(function(code)
    local func, err = loadstring(code)
    if func then
      return func(), true
    else
      return err, false
    end
  end, code)
  return retval, status
end

--- net.dostring_in
---@param code string @要执行的代码
Tools.dostring_in = function(code)
  code = [[a_do_script("]] .. code .. [[")]]
  -- local result, status = net.dostring_in('mission', code) -- result is a string
  net.dostring_in('mission', code)
end

--- 获取系统时间
---@return table @{os:'',real:'',model:''}
Tools.getTimeStamp = function()
  local _TempData = {
    os = os.date('%Y-%m-%d %H:%M:%S')
  }
  if DCS then
    _TempData.real = DCS.getRealTime()
    _TempData.model = DCS.getModelTime()
  end
  return _TempData
end
------------------------------------------- Tools 目录 -------------------------------------------
--- 获取文件名(get filename)
---@param filePath string
---@return string 文件名
Tools.getFileName = function(filePath)
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
Tools.getExtension = function(filePath)
  return filePath:match('.+%.(%w+)$')
end

Tools.attrdir = function(rootpath)
  for entry in lfs.dir(rootpath) do
    -- 过滤"."和".."目录
    if entry ~= '.' and entry ~= '..' then
      local path = rootpath .. '\\' .. entry
      local attr = lfs.attributes(path)
      local filename = Tools.getFileName(entry)
      -- 如果是是目录，就递归调用，否则就写入文件
      if attr.mode ~= 'directory' then
        local postfix = Tools.getExtension(entry)
        net.log(filename .. '\t' .. attr.mode .. '\t' .. postfix)
        Tools.attrdir(path)
      else
        net.log(path)
      end
    end
  end
end

------------------------------------------- Tools table -------------------------------------------
-- 合并两个table
---@vararg table @要合并的表
---@return table @后缀名
Tools.MergeTables = function(...)
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
---@usage args=name,tb1={name:"张三",age:18},tb2={name:"张三",age:18},return tb={name:"张三",age:18}
---@param args string @根据哪个key合并
---@vararg table @要合并的表
---@return table @按参数合并后的表
Tools.ArgsMergeTables = function(args, ...)
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
------------------------------------------- Tools 字符串 -------------------------------------------
--- 判断变量是否为空
---@usage Tools.isempty(nil)->true
---@usage Tools.isempty('')->true
---@usage Tools.isempty('d')->false
---@usage Tools.isempty({})->true
---@param s any
---@return boolean
function Tools.isempty(s)
  if type(v) == 'table' then
    return next(s) == nil
  end
  return s == nil or s == ''
end

--- 按照规定长度分割字符串转lua table
---@param str string 要分割的字符串
---@param max number 分割的长度
---@return table
function Tools.stringSlice2Table(str, max)
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
function Tools.get_source_code(f)
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
function Tools.value2string(v)
  if type(v) == 'table' then
    v = net.lua2json(v)
  end
  if type(v) == 'boolean' then
    v = tostring(v)
  end
  if type(v) == 'function' then
    v = Tools.get_source_code(v)
  end
  return v
end

---去除字符串收尾的空格
---@param str string 需要处理的字符串
---@return string 处理后的字符串 ' hello world ' -> ' hello world'
Tools.TrimStr = function(str)
  return string.format('%s', str:match('^%s*(.-)%s*$'))
end

-- 去除尾部空白符
---@usage  ' hello world ' -> ' hello world'
---@param str string 需要处理的字符串
---@return string 处理后的字符串
Tools.cut_tail_spaces = function(str)
  local tail = string.find(str, '%s+$') -- find where trailing spaces start
  if tail then
    return string.sub(str, 1, tail - 1) -- cut if there are any
  else
    return str
  end
end

-- 按空格分割字符串转换table
---@param str string 需要处理的字符串
---@return table|boolean 处理后的字符串 ' hello world ' -> '{[1]="hello",[2]="world"}'
Tools.split_by_space = function(str)
  if str == nil then
    return false
  end
  str = Tools.TrimStr(str)
  local arr = {}
  for w in string.gmatch(str, '%S+') do
    table.insert(arr, w)
  end
  return arr
end

-- Lua类型转字符串包裹key
-- @usage 处理前:{first = 'red', 'blue', third = 'green', 'yellow'}
-- @usage 处理后:{[1]="blue",[2]="yellow",["first"]="red",["third"]="green"}
---@param val string 需要处理的 "boolean"|"function"|"nil"|"number"|"string"
---@return string 处理后的字符串
function Tools.table2tring_pack(val)
  local t = type(val)
  if t == 'number' or t == 'boolean' then
    return tostring(val)
  elseif t == 'table' then
    local str = ''
    for k, v in pairs(val) do
      str = str .. '[' .. Tools.table2tring_pack(k) .. ']=' .. Tools.table2tring_pack(v) .. ','
    end
    str = string.sub(str, 0, #str - 1)
    return '{' .. str .. '}'
  else
    return string.format('%q', tostring(val))
  end
end

-- Lua Table 类型转单引号字符串字符串
-- @usage 处理前:{first = 'red', 'blue', third = 'green', 'yellow'}
-- @usage 处理后:{1="blue",2='yellow',first='red',third='green'}
---@param val string|table 需要处理的 "boolean"|"function"|"nil"|"number"|"string"
---@return string 处理后的字符串
function Tools.table2tring(val)
  local t = type(val)
  if t == "string" then
    return '\'' .. val .. '\''
  elseif t == 'number' or t == 'boolean' then
    return tostring(val)
  elseif t == 'table' then
    local str = ''
    for k, v in pairs(val) do
      str = str .. k .. '=' .. Tools.table2tring(v) .. ','
    end
    str = string.sub(str, 0, #str - 1)
    return '{' .. str .. '}'
  end
  return val
end
--[[
  local function value2string(val)
  local t = type(val)
  if t == "number" or t == "boolean" then
    return tostring(val)
  elseif t == "table" then
    local str = ''
    local k, v
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

]]

function Tools.table2code(val)
  return 'return ' .. Tools.table2tring(val)
end

-- Lua类型转JSON字符串
-- @usage 处理前:{first = 'red', 'blue', third = 'green', 'yellow'}
-- @usage 处理后:{[1]:"blue",[2]:"yellow",["first"]:"red",["third"]="green"}
---@param val boolean|function|nil|number|string" 需要处理的
---@return string 处理后的字符串
function Tools.table2json(val)
  local t = type(val)
  if t == 'number' or t == 'boolean' then
    return tostring(val)
  elseif t == 'table' then
    local str = ''
    for k, v in pairs(val) do
      str = str .. '[' .. Tools.table2json(k) .. ']:' .. Tools.table2json(v) .. ','
    end
    str = string.sub(str, 0, #str - 1)
    return '{' .. str .. '}'
  else
    return string.format('%q', tostring(val))
  end
end
