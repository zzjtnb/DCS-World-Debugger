Tools = Tools or {}
Tools.net = {}
Tools.env = {}
Tools.date = os.date('%Y-%m-%d %H:%M:%S')

------------------------------------------- Tools.net -------------------------------------------

-- 执行脚本
-- local fun_str = 'local keys = {} for k, v in pairs(_G) do  keys[#keys + 1] = k end return keys'
-- local status, retval = Tools.dostring_api_env(fun_str)
Tools.dostring_api_env = function(code)
  local status, retval =
    pcall(
    function(code)
      local func, err = loadstring(code)
      if func then
        return func(), true
      else
        return err, false
      end
    end,
    code
  )
  return retval, status
end

Tools.a_do_script = function(code)
  code = [[a_do_script("]] .. code .. [[")]]
  local result, status = net.dostring_in('mission', code) -- res is a string
  if not status then
    local response = {type = 'ServerStatus', payload = {status = status, result = result}}
    Tools.net.tcp_send_msg(response)
  end
end

Tools.net.sendData = function(response, displayMsg)
  if TCP and TCP.client == nil then
    TCP.creat_client()
  end
  local ip, port = TCP.client:getsockname()
  -- local ip, port = TCP.server:getsockname()
  net.log('sendDataTo -->' .. tostring(ip) .. ':' .. tostring(port))
  if displayMsg then
    net.log('sendData -->' .. response)
  end
  TCP.send(response)
end
Tools.net.sendJSON = function(response, displayMsg)
  if type(response) == 'table' then
    Tools.net.sendData(Tools.lua2json(response), displayMsg)
  else
    Tools.net.sendData(response, displayMsg)
  end
end

---发送消息到TCP服务端
Tools.net.tcp_send_msg = function(response, displayMsg)
  response.executionTime = response.executionTime or {}
  response.executionTime = Tools.MergeTables(response.executionTime, Tools.getTimeStamp())
  Tools.net.sendJSON(response, displayMsg)
end

Tools.net.log = function(message)
  if type(message) ~= 'table' then
    net.log(Tools.date .. ' [Tools] => ' .. message)
  else
    net.log(Tools.date .. ' [Tools] Table => ' .. net.lua2json(message))
  end
end

------------------------------------------- Tools JSON -------------------------------------------
Tools.JSON = loadfile('Scripts/JSON.lua')()
function Tools.JSON:onDecodeError(message)
  Tools.err({'While decoding JSON data -> ', message})
end

function Tools.JSON:onEncodeError(message)
  Tools.err({'While encoding JSON data -> ', message})
end

--转table
function Tools.lua2json(message)
  local status, result =
    pcall(
    function(data)
      return net.lua2json(data)
    end,
    message
  )
  if status then
    return result
  else
    return status
  end
end
--转字符串
function Tools.json2lua(message)
  local status, result =
    pcall(
    function(data)
      return net.json2lua(data)
    end,
    message
  )
  if status then
    return result
  else
    return status
  end
end

------------------------------------------- Tools env -------------------------------------------
function Tools.setDevEnv(isDev)
  env.setErrorMessageBoxEnabled(isDev)
end

function Tools.env.err(message)
  if type(message) ~= 'table' then
    env.error(Tools.date .. ' [Tools] ERROR => ' .. message)
    return
  end
  env.error(Tools.date .. ' [Tools] ERROR Table => ' .. Tools.encode(message))
end
------------------------------------------- Tools JSON -------------------------------------------

Tools.getTimeStamp = function()
  local _TempData = {os = os.date('%Y-%m-%d %H:%M:%S')}
  if DCS then
    _TempData.real = DCS.getRealTime()
    _TempData.model = DCS.getModelTime()
  end
  return _TempData
end
------------------------------------------- Tools 目录 -------------------------------------------

--get filename
Tools.getFileName = function(str)
  local idx = str:match('.+()%.%w+$')
  if (idx) then
    return str:sub(1, idx - 1)
  else
    return str
  end
end

--get file postfix
Tools.getExtension = function(str)
  return str:match('.+%.(%w+)$')
end

Tools.attrdir = function(rootpath)
  for entry in lfs.dir(rootpath) do
    --过滤"."和".."目录
    if entry ~= '.' and entry ~= '..' then
      local path = rootpath .. '\\' .. entry
      local attr = lfs.attributes(path)
      local filename = Tools.getFileName(entry)
      --如果是是目录，就递归调用，否则就写入文件
      if attr.mode ~= 'directory' then
        -- local postfix = Tools.getExtension(entry)
        -- net.log(filename .. '\t' .. attr.mode .. '\t' .. postfix)
        Tools.attrdir(path)
      else
        net.log(path)
      end
    end
  end
end
------------------------------------------- Tools table -------------------------------------------

---合并两个table
---@return table
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
---@param args any 根据哪个key合并
---@return table按参数合并后的表
Tools.ArgsMergeTables = function(args, ...)
  --  args=name, tb1={name:"张三",age:18} , tb2={name:"张三",age:18} return tb={name:"张三",age:18}
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

---去除字符串收尾的空格
---@param str string 需要处理的字符串
---@return string 处理后的字符串 ' hello world ' -> ' hello world'
Tools.TrimStr = function(str)
  return string.format('%s', str:match('^%s*(.-)%s*$'))
end

--去除尾部空白符
---@param str string 需要处理的字符串
---@return string 处理后的字符串 ' hello world ' -> ' hello world'
Tools.cut_tail_spaces = function(str)
  local tail = string.find(str, '%s+$') -- find where trailing spaces start
  if tail then
    return string.sub(str, 1, tail - 1) -- cut if there are any
  else
    return str
  end
end

--按空格分割字符串转换table
---@param str string 需要处理的字符串
---@return string 处理后的字符串 ' hello world ' -> '{[1]="hello",[2]="world"}'
Tools.split_by_space = function(str)
  if str == nil then
    return
  end
  str = Tools.TrimStr(str)
  local arr = {}
  for w in string.gmatch(str, '%S+') do
    table.insert(arr, w)
  end
  return arr
end

-- Lua类型转字符串
--@usage 处理前:{first = 'red', 'blue', third = 'green', 'yellow'}
--@usage 处理后:{[1]="blue",[2]="yellow",["first"]="red",["third"]="green"}
---@param val string 需要处理的 "boolean"|"function"|"nil"|"number"|"string"
---@return string 处理后的字符串
function Tools.value2string(val)
  local t = type(val)
  if t == 'number' or t == 'boolean' then
    return tostring(val)
  elseif t == 'table' then
    local str = ''
    local k, v
    for k, v in pairs(val) do
      str = str .. '[' .. Tools.value2string(k) .. ']=' .. Tools.value2string(v) .. ','
    end
    str = string.sub(str, 0, #str - 1)
    return '{' .. str .. '}'
  else
    return string.format('%q', tostring(val))
  end
end

function Tools.value2code(val)
  return 'return ' .. Tools.value2string(val)
end
-- Lua类型转JSON字符串
--@usage 处理前:{first = 'red', 'blue', third = 'green', 'yellow'}
--@usage 处理后:{[1]:"blue",[2]:"yellow",["first"]:"red",["third"]="green"}
---@param val string 需要处理的 "boolean"|"function"|"nil"|"number"|"string"
---@return string 处理后的字符串
function Tools.value2json(val)
  local t = type(val)
  if t == 'number' or t == 'boolean' then
    return tostring(val)
  elseif t == 'table' then
    local str = ''
    local k, v
    for k, v in pairs(val) do
      str = str .. '[' .. Tools.value2json(k) .. ']:' .. Tools.value2json(v) .. ','
    end
    str = string.sub(str, 0, #str - 1)
    return '{' .. str .. '}'
  else
    return string.format('%q', tostring(val))
  end
end

-- local color = {first = 'red', 'blue', third = 'green', 'yellow'}
-- local color = Tools.split_by_space(' hello world ')
-- local res = Tools.value2string(color)
-- print(res)
