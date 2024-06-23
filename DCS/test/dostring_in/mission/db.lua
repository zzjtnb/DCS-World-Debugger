function value2json(val)
  local function json_encode(val, visited, path)
    local t = type(val)
    if t == "number" or t == "boolean" then
      return tostring(val)
    elseif t == "string" then
      return string.format('%q', val)
    elseif t == "function" then
      return '"[function]"'
    elseif t == "userdata" then
      return '"[userdata]"'
    elseif t == "table" then
      if visited[val] then
        return string.format('"%s:[循环引用]"', path)
      end
      visited[val] = true

      local is_array = #val > 0
      local result = {}
      for k, v in pairs(val) do
        local key = is_array and '' or json_encode(k, visited, path) .. ':'
        local new_path = path .. (is_array and '' or tostring(k) .. '.')
        table.insert(result, key .. json_encode(v, visited, new_path))
      end

      visited[val] = nil
      local open, close = is_array and '[' or '{', is_array and ']' or '}'
      return open .. table.concat(result, ',') .. close
    else
      return type(val)..path
    end
  end

  return json_encode(val, {}, '')
end

local side_parser = function(side)
  local slots = {}
  for _, v in ipairs(side) do
    local u = { unit_id = v.unitId, type = v.type, onboard_num = v.onboard_num }
    local group = v.group
    if group then
      u.group_name = group.name
      u.group_task = group.task
    end
    table.insert(slots, group)
  end
  return slots
end

local res = { red = side_parser(db.clients.red), blue = side_parser(db.clients.blue) }
return value2json(db.clients)
