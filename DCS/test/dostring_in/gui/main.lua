local game = {
  slots = {}
}

local function on_mission(filename)
  --already reported
  net.log(string.format("Mission name: %s", filename))
  -- parse available slots
  local serializer = [[
    serialize = function(val)
      if type(val) == 'number' or type(val) == 'boolean' then
        return tostring(val)
      elseif type(val) == 'string' then
        return string.format("%q", val)
      elseif type(val) == 'table' then
        local k, v
        local str = '{'
        for k, v in pairs(val) do
          str = str .. '[' .. serialize(k) .. ']=' .. serialize(v) .. ','
        end
        str = str .. '}'
        return str
      end
      return 'nil'
    end
  ]]
  -- load serializer into mission env
  net.dostring_in('mission', serializer)

  -- parse available slots
  local slot_parser = [[
    local side_parser = function(side)
      local i, v
      local slots = {}
      for i, v in ipairs(side) do
        local u = { unit_id = v.unitId, type = v.type, onboard_num = v.onboard_num }
        local group = v.group
        if group then
          u.group_name = group.name
          u.group_task = group.task
        end
        table.insert(slots, u)
      end
      return slots
    end
    local res = { red = side_parser(db.clients.red), blue = side_parser(db.clients.blue) }
    return serialize(res)
  ]]
  local val, res = net.dostring_in('mission', slot_parser)
  net.log(string.format("%s: (%s) %q", 'mission 测试', tostring(res), val))
  if res then
    local t = loadstring('return ' .. val)
    game.slots = t()
  else
    game.slots = {}
  end
  res = net.lua2json(game)
  net.log(string.format("mission 测试 slots: %s", res))
  return res
end
return on_mission('高加索Lua测试')
