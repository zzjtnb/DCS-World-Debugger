-- module name. All function in this file, if used outside, should be called "ZZJT.functionname"
module('ZZJT', package.seeall)

date = os.date('%Y-%m-%d %H:%M:%S')

--- 安全执行loadstring方法
---@param code string @要执行的代码
---@return any,boolean
function safe_loadstring(code)
  local fun, err = loadstring(code)
  if fun then
    local status, result = pcall(fun)
    if status then
      return result, true
    else
      return result, false
    end
  else
    return err, false
  end
end

function safe_dostring_in(code, model)
  if model == nil then
    model = 'server'
  end
  if model == 'mission' then
    code = 'a_do_script([[' .. code .. ']])'
  end
  return net.dostring_in(model, code)
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
    os = os.date('%Y-%m-%d %H:%M:%S'),
  }
  if DCS then
    time.real = DCS.getRealTime()
    time.model = DCS.getModelTime()
  end
  return time
end

--- 根据秒数返回时间串
---@param t_sec string 33000
---@return number hours
---@return number minutes
---@return number seconds
function getTimeString(t_sec)
  local timeInSeconds = t_sec or 0
  local secondsPerDay = 60 * 60 * 24
  timeInSeconds = timeInSeconds - math.floor(timeInSeconds / secondsPerDay) * secondsPerDay
  local hours = math.floor(timeInSeconds / 3600)
  timeInSeconds = timeInSeconds % 3600
  local minutes = math.floor(timeInSeconds / 60)
  local seconds = timeInSeconds % 60
  -- return string.format("%i:%02i:%02i", hours, minutes, seconds)
  return hours, minutes, seconds
end

--------------------------------------- 文件和目录 ---------------------------------------
--- 获取文件路径、文件名、文件后缀
---@param path string '/path/to/file.txt'
---@return string dir  '/path/to'
---@return string filename
---@return string extension
function get_file_info(path)
  -- 将文件路径中的分隔符替换为 /
  path = string.gsub(path, "\\", "/")
  -- 匹配文件名和后缀
  local filename, extension = string.match(path, ".*/(.+)%.([^.]+)$")
  -- 如果匹配失败，则文件可能没有后缀
  if not filename then
    filename = path
    extension = ""
  end
  -- 匹配路径中的文件夹
  local dir = string.match(path, "(.+)/[^/]*$")
  if not dir then
    dir = "."
  end
  return dir, filename, extension
end

--- 判断文件是否存在
---@param  filename string
---@return boolean
function getFileExists(filename)
  local attributes = lfs.attributes(filename)
  return attributes and 'file' == attributes.mode
end

--- 判断文件夹是否存在
---@param filename string
function getFolderExists(foldername)
  local attributes = lfs.attributes(foldername)
  return attributes and 'directory' == attributes.mode
end

function compareStrings(string1, string2)
  return string.lower(string1) < string.lower(string2)
end

--- 获取path下的文件夹和文件
---@param path string
---@return table folders
---@return table files
function getPathFoldersAndFiles(path)
  local files = {}
  local folders = {}
  for file in lfs.dir(path) do
    if '.' ~= file and '..' ~= file then
      local filePath = path .. '\\' .. file
      local attrib = lfs.attributes(filePath)
      if attrib then
        if 'file' == attrib.mode then
          table.insert(files, file)
        elseif 'directory' == attrib.mode then
          table.insert(folders, file)
        end
      end
    end
  end
  table.sort(files, compareStrings)
  table.sort(folders, compareStrings)
  return folders, files
end

--- 把路径分割成table,返回一个线性表(数组)
---@param path string @ E:\\Eagle Dynamics\\DCS World OpenBeta\\
---@return table @{[1]="E:",[2]="Eagle Dynamics",[3]="DCS World OpenBeta"
function splitPath(path)
  local result = {}
  for item in string.gmatch(path, "[^\\/]+") do
    table.insert(result, item)
  end
  return result
end

--- 从字符串 path 中移除字符串 rootPath 并返回结果
---@param path string '/home/user/documents'
---@param rootPath string '/home/user'
---@return string 'documents'
function cropRootPath(path, rootPath)
  local result = path
  if rootPath then
    local pos = string.find(path, rootPath)
    if pos then
      -- +1 用于 '/' 字符 , +1 用于 rootPath 后面的字符索引
      result = string.sub(path, string.len(rootPath) + 2)
    end
  end
  return result
end

-------------------------------------------  table -------------------------------------------

---将多个表合并为一个
---如果 preserve_existing 为 false (默认),原始表中的值将被覆盖.
---如果 preserve_existing 为 true ,则原始表中的值将被保留.
---@param ...table 要合并的表
---@param preserve_existing boolean 是否保留原始表中的值. 默认值:false
---@return table @ 合并后的表
---@usage local t1 = {a = 1,b = 2}
---@usage local t2 = {c = 3,d = 4}
---@usage local t3 = {d = 5,e = 6}
---@usage local t4=merge_tables(t1, t2,t3)
---@usage t4={a= 1,c= 3,b= 2,e= 6,d= 5} --preserve_existing=false(默认)
---@usage local t4=merge_tables(t1, t2,t3,true)
---@usage t4={a= 1,c= 3,b= 2,e= 6,d= 4} --preserve_existing=true
function merge_tables(...)
  local preserve_existing = false -- 默认值为 false
  local args = {
    ...,
  }
  -- 如果最后一个参数是布尔值，则将其设为 preserve_existing 的值
  if type(args[#args]) == "boolean" then
    preserve_existing = table.remove(args)
  end
  local result = {}
  for i, t in ipairs(args) do
    for k, v in pairs(t) do
      if not preserve_existing or result[k] == nil then
        result[k] = v
      end
    end
  end
  return result
end

---按指定参数合并表
---@usage args=name,tb1={name:"张三",age:18},tb2={name:"张三",age:18} return tb={name:"张三",age:18}
---@param args string @根据哪个key合并
---@vararg table @要合并的表
---@return table @按参数合并后的表
ArgsMergeTables = function(args, ...)
  local tabs = {
    ...,
  }
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
--- 判断某个值是否包含在table中
---@param table any @ {'connect', 'disconnect', 'change_slot'}
---@param value any @ 'connect'
function table_contains(table, value)
  for _, v in ipairs(table) do
    if v == value then
      return true
    end
  end
  return false
end
---去除字符串首尾的空格
---@param str string 需要处理的字符串
---@return string 处理后的字符串 ' hello world! ' -> 'hello world!'
function string_trim(s)
  return (s:gsub("^%s*(.-)%s*$", "%1"))
end
------------------------------------------- 字符串和table操作 -------------------------------------------

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

--- 按照规定长度分割字符串转table
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

-- 将 table 转换为 JSON 字符串
---@param v boolean|number|string|table|function @需要处理的数据
---@return string @处理后的字符串
function toJson(param)
  if type(param) == "string" then
    return '"' .. param:gsub('"', '\\"') .. '"'
  elseif type(param) == "number" or type(param) == "boolean" then
    return tostring(param)
  elseif type(param) == "table" then
    local json = "{"
    local comma = ""
    for key, value in pairs(param) do
      json = json .. comma .. '"' .. tostring(key) .. '":' .. toJson(value)
      comma = ","
    end
    return json .. "}"
  elseif type(param) == "function" then
    return functionToJson(param)
  else
    -- return "null"
    return string.format("%q", tostring(val))
  end
end

-- 将函数转换为 JSON 字符串
---@param func function @需要转换的function
---@return string @处理后的字符串
function functionToJson(func)
  -- 导入 Lua 的调试库
  local debug = require("debug")
  -- 获取函数的源代码
  local source = string.dump(func, true)
  -- 创建一个新的 Lua 环境
  local env = {}
  -- 使用调试库获取函数的 upvalues 和变量名
  local i = 1
  while true do
    local name, value = debug.getupvalue(func, i)
    if not name then
      break
    end
    env[name] = value
    i = i + 1
  end
  -- 转换函数的 upvalues 和变量为 JSON 字符串
  local envString = toJson(env)
  -- 将函数源代码和环境变量转换为 JSON 字符串
  local json = '{"source":' .. toJson(source) .. ',"env":' .. envString .. '}'
  return json
end

-- this is used for "net.dostring_in()" Lua API
-- serialization
---@usage val={code = 200,msg = 'Hello World'} 返回{["code"]=200,["msg"]="Hello World",}
---@usage val='Hello World' 返回 return 'Hello World'
---@param val string|boolean|table
function value2string(val)
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

function value2table(val)
  return value2string(val)
end

-- test_exec("export", "LoGetModelTime()")
-- test_exec("config", "cmdline")
--- 判断环境是否存在变量
---@param state string
---@param str string
function test_exec(state, str)
  local val, res = net.dostring_in(state, value2code(str))
  net.log(string.format("%s: (%s) %q", state, tostring(res), val))
end
