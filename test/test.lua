net.dostring_in('server', 'trigger.action.outText("加载成功-->server", 5, false)')

local function getZone(zone)
  if type(zone) == 'string' then
    zone = trigger.misc.getZone(zone)
  elseif type(zone) == 'table' and not zone.radius then
    zone = trigger.misc.getZone(zone[math.random(1, #zone)])
  end
  trigger.action.outText('The Radius of the bus stop zone is:\n' .. net.lua2json(zone), 20)
  return zone
end

net.log('加载测试脚本成功')

net.log(net.lua2json(country.id))
dofile('F:/Office/GitHub/DCS_World_Debugger/test/mist_4_4_90.lua')

local function addGroup(countryId, groupCategory, groupName)
  local gp = mist.getCurrentGroupData(groupName)
  local units = {}
  local zone = getZone(groupName).point
  local x = zone.x
  local y = zone.z
  local heading = gp.units[1]['heading']
  for i = 1, 20 do
    -- if i == 1 then
    --   x = x + 8
    --   y = y + 8
    -- else
    --   x = units[i - 1].x + 8
    --   y = units[i - 1].y + 8
    -- end
    x = x + 50
    y = y + 50
    units[i] = {}
    units[i]['type'] = gp.units[1].type
    units[i]['name'] = groupName .. 'Unit #' .. tostring(i)
    units[i]['heading'] = heading
    units[i]['playerCanDrive'] = true
    units[i]['skill'] = gp.units[1].skill
    units[i]['x'] = x
    units[i]['y'] = y
    units[i]['speed'] = 60
  end

  local newGroup = {
    ['visible'] = true,
    ['taskSelected'] = true,
    ['hidden'] = false,
    units = units,
    country = countryId,
    category = gp.category,
    name = groupName .. '1'
  }

  coalition.addGroup(countryId, groupCategory, newGroup)
  mist.goRoute(newGroup.name, mist.getGroupRoute(groupName))
end

addGroup(country.id.CHINA, Group.Category.GROUND, 'red_tanks')
addGroup(country.id.USA, Group.Category.GROUND, 'blue_tanks')

local base = world.getAirbases()
local myBaseTbl = {}
for i = 1, #base do
  local info = {}
  info.desc = Airbase.getDesc(base[i])
  info.callsign = Airbase.getCallsign(base[i])
  info.id = Airbase.getID(base[i])
  info.cat = Airbase.getCategory(base[i])
  info.point = Airbase.getPoint(base[i])
  if Airbase.getUnit(base[i]) then
    info.unitId = Airbase.getUnit(base[i]):getID()
  end

  myBaseTbl[info.callsign] = info
end

return myBaseTbl
