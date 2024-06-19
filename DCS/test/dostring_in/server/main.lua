net.dostring_in('server', 'trigger.action.outText("加载成功(server)", 5, false)')
-- local status, tacview = pcall(require, 'JSON')
-- local JSON = require('JSON')
-- local JSON = loadfile('Scripts/JSON.lua')()
-- local JSON = dofile('Scripts/JSON.lua')
-- local keys = {}
-- for k, v in pairs(_G) do
--   keys[#keys + 1] = k
-- end
-- local res = JSON:encode(keys)
-- net.log(res)

dofile('D:/Office/GitHub/DCS-World-Debugger/DCS/test/modules/mist/mist_4_5_126.lua')

local function addGroup(groupName, countryId, groupCategory)
  local gp = mist.getCurrentGroupData(groupName)
  local units = {}
  local x = gp.units[1].x
  local y = gp.units[1].y
  for i = 1, 5 do
    if i == 1 then
      x = x + 4
      y = y + 4
    else
      x = units[i - 1].x + 4
      y = units[i - 1].y + 4
    end
    units[i] = {}
    units[i]['type'] = gp.units[1].type
    units[i]['name'] = 'Unit #' .. tostring(i)
    units[i]['unitId'] = mist.getNextUnitId()
    units[i]['heading'] = gp.units[1]['heading']
    units[i]['playerCanDrive'] = true
    units[i]['skill'] = gp.units[1].skill
    units[i]['x'] = x
    units[i]['y'] = y
  end

  local newGroup = {
    ['visible'] = true,
    ['taskSelected'] = true,
    ['hidden'] = false,
    units = units,
    country = gp.units[1].country,
    category = gp.category,
    groupName = 'test',
    groupId = mist.getNextGroupId()
  }
  mist.dynAdd(newGroup)
end
addGroup('red_tanks', 27, 2)

local function getZone(zone)
  if type(zone) == 'string' then
    zone = trigger.misc.getZone(zone)
  elseif type(zone) == 'table' and not zone.radius then
    zone = trigger.misc.getZone(zone[math.random(1, #zone)])
  end
  trigger.action.outText('The Radius of the bus stop zone is: ' .. net.log(net.lua2json(zone)), 20)
end
getZone('red_tanks')

-- for i = 1, 20 do
--   mist.cloneInZone(gp.groupName, 'spawn', false)
--   -- Group.getByName('CHINA gnd ' .. tostring(i)):destroy()
-- end

-- mist.spawnRandomizedGroup('FPD-MER', {lowerLimit = 2, upperLimit = 9})

-- do
--   mist.debug.dump_G('_G_Dump_V1.lua')
-- end

--- table MissionCommands .addCommand( string name , table/nil path , function functionToRun , any anyArgument )
local displayRequests = missionCommands.addSubMenu('显示请求')
local function displayMsg(flyby)
  trigger.action.outText('加载成功(server)' .. net.lua2json(flyby), 10, false)
end
local negativeReply = missionCommands.addCommand('否定答复', displayRequests, displayMsg, {flyby = false})
local positiveReply = missionCommands.addCommand('肯定答复', displayRequests, displayMsg, {flyby = true})

net.log('加载测试脚本成功')

