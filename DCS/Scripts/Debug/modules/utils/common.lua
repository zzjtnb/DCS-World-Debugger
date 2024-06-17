local base = _G

local utils = {}

local Time = require("utils.time")

--- 判断变量是否为空
---@usage isempty(nil)->true
---@usage isempty('')->true
---@usage isempty('d')->false
---@usage isempty({})->true
---@param val any
---@return boolean
function utils.isempty(val)
  if type(val) == 'table' then
    return next(val) == nil
  end
  return val == nil or val == ''
end

-- this is used for "net.dostring_in()" Lua API
-- serialization
---@usage val={code = 200,msg = 'Hello World'} 返回{code:200,msg:"Hello World",}
---@param val string|boolean|table
function utils.value2json(val)
  local t = type(val)
  if t == "number" or t == "boolean" then
    return tostring(val)
  elseif t == "table" then
    local result = {}
    for k, v in pairs(val) do
      base.table.insert(result, base.string.format("%s:%s", utils.value2string(k), utils.value2string(v)))
    end
    return '{' .. base.table.concat(result, ',') .. '}'
  else
    return base.string.format("%q", tostring(val))
  end
end

-- this is used for "net.dostring_in()" Lua API
-- serialization
---@usage val={code = 200,msg = 'Hello World'} 返回{["code"]=200,["msg"]="Hello World",}
---@param val string|boolean|table
function utils.value2string(val)
  local t = type(val)
  if t == "number" or t == "boolean" then
    return tostring(val)
  elseif t == "table" then
    local result = {}
    for k, v in pairs(val) do
      base.table.insert(result, base.string.format("[%s]=%s", utils.value2string(k), utils.value2string(v)))
    end
    return '{' .. base.table.concat(result, ',') .. '}'
  else
    return base.string.format("%q", tostring(val))
  end
end

--- 将给定值转换为可执行的代码
---@param val any
---@return string
---@usage val='Hello World' 返回 return 'Hello World'
function utils.value2code(val)
  return base.string.format("return %s", utils.value2string(val))
end

--- 判断环境是否存在变量
---@param state state -- 需要执行的环境
---@param dostring string -- 要执行的代码
---@return boolean
---@usage
--- test_exec("export", "LoGetModelTime()")
--- test_exec("config", "cmdline")
function utils.test_exec(state, dostring)
  local val, res = net.dostring_in(state, utils.value2code(dostring))
  return res
end

--- 将给定表格的内容以树状结构输出.
--- @param tbl table @要输出的表格.
--- @param depth number|nil @最大深度,默认无限深度.
--- @return table @输出的树状结构.如果输入不是一个表格,则返回错误消息.
--- @usage
--- local result = deepdump(_G)
--- for k, v in pairs(result) do
---   print(k, v)
--- end
function utils.deepdump(tbl, depth)
  local result = {}
  local checklist = {}                 -- 将checklist作为局部变量
  local max_depth = depth or math.huge -- 默认无限深度

  local function _deepdump(t, current_depth, output, check)
    if current_depth > max_depth then
      output["... (达到最大深度)"] = nil
      return
    end

    check[t] = output -- 将表格t添加到checklist中
    for k, v in pairs(t) do
      local v_type = type(v)
      if v_type == "table" then
        -- if not check[v] then
        --   output[k] = {}
        --   _deepdump(v, current_depth + 1, output[k], check) -- 递归调用时传递checklist
        -- else
        --   output[k] = "(已遍历)"
        -- end

        if not check[v] then
          output[k] = "table" -- 仅显示'table'，而不进行递归
          check[v] = true     -- 标记该表格已被遍历
        end
      elseif v_type == "function" or v_type == "userdata" then
        output[k] = v_type
      else
        output[k] = v
      end
    end
  end

  if type(tbl) ~= "table" then
    return { ["错误"] = "输入的不是一个表格" }
  end

  _deepdump(tbl, 1, result, checklist) -- 传递checklist
  return result
end

return utils
