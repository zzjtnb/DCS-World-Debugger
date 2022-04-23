local path = ';E:/Eagle Dynamics/DCS World OpenBeta'

--package.path和package.cpath 用于搜索自己写的库文件或者第三方的库文件
-- 一. package.path 这个路径被 [require] 在 Lua 加载器中做搜索时用到。
--搜索指定路径下,以.lua结尾的文件
package.path = package.path .. path .. '/bin/?.lua;'

package.path = package.path .. path .. '/Scripts/?.lua'
package.path = package.path .. path .. '/Scripts/?/?.lua'
package.path = package.path .. path .. '/Scripts/?/init.lua'

package.path = package.path .. path .. '/Config/?.lua'

package.path = package.path .. path .. '/LuaSocket/?.lua'
-- -- 二.package.cpath 这个路径被 [require] 在 C 加载器中做搜索时用到。
-- --搜索指定路径下,以.dll结尾的文件
package.cpath = package.cpath .. path .. '/bin/lua-?.dll;'
package.cpath = package.cpath .. path .. '/bin/?.dll;'
package.cpath = package.cpath .. path .. '/LuaSocket/?.dll;'

-- print(package.path)
-- print(package.cpath)

local JSON = require('JSON')
-- local res = {first = 'red', 'blue', third = 'green', three = 'yellow'}
-- local tab = {type = 'ServerStatus', payload = {msg = '开始加载任务...'}}
local tab = {}
tab.type = 'ServerStatus'
tab.payload = {}
tab.payload.msg = '开始加载任务...'
local status, error =
  pcall(
  function(data)
    -- return JSON:decode(data)
    return JSON:encode(data)
  end,
  tab
)

print(status, error)

-- local indent = 2
-- local k = 'dd'
-- local formatting = string.rep('  ', indent) .. k .. ': '
-- print(formatting)

function Formeat(msg, indent)
  if not indent then
    indent = 0
  end

  for k, v in pairs(msg) do
    local formatting = string.rep('  ', indent) .. k .. ': '
    if type(v) == 'table' then
      print(formatting)
      Formeat(v, indent + 1)
    elseif type(v) == 'boolean' then
      print(formatting .. tostring(v))
    else
      print(formatting .. tostring(v))
    end
  end
end
Formeat(tab)
-- local net = require('netview')
-- net.start()

local function value2string(val)
  local t = type(val)
  if t == 'number' or t == 'boolean' then
    return tostring(val)
  elseif t == 'table' then
    local str = ''
    local k, v
    for k, v in pairs(val) do
      str = str .. '[' .. value2string(k) .. ']=' .. value2string(v) .. ','
    end
    str = string.sub(str, 0, #str - 1)
    return '{' .. str .. '}'
  else
    return string.format('%q', tostring(val))
  end
end

local function value2code(val)
  return 'return ' .. value2string(val)
end

print(value2code(tab))
local as = true
if not as then
  print(not as)
end
