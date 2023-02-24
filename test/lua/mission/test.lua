net.dostring_in('server', 'trigger.action.outText("加载成功(server)", 5, false)')

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

local function getParking()
  local base = world.getAirbases()
  local myBaseTbl = {}
  for i = 1, #base do
    if base[i]['id_'] == 5000002 then
      myBaseTbl = Airbase.getParking(base[i], 16)
    end
  end
  return myBaseTbl
end

local function getByName()
  local myBaseTbl = {}
  local gp = Group.getByName('red_tanks')
  myBaseTbl.units = gp:getUnits()
  myBaseTbl.name = gp:getName()
  myBaseTbl.groupId = gp:getID()
  myBaseTbl.category = gp:getCategory()
  myBaseTbl.coalition = gp:getCoalition()
  for i, data in pairs(myBaseTbl.units) do
    local info = {}
    myBaseTbl.units[i] = data:getDesc()
    myBaseTbl.info = info
  end
  return myBaseTbl
end

local plane = {
  ['group'] = {
    [1] = {
      ['modulation'] = 0,
      ['tasks'] = {}, -- end of ["tasks"]
      ['task'] = 'CAP',
      ['uncontrolled'] = false,
      ['groupId'] = 1,
      ['hidden'] = false,
      ['units'] = {
        [1] = {
          ['alt'] = 43,
          ['hardpoint_racks'] = true,
          ['alt_type'] = 'BARO',
          ['livery_id'] = 'PLAAF 2nd AD (Parade)',
          ['skill'] = 'Excellent',
          ['parking'] = 36,
          ['speed'] = 138.88888888889,
          ['type'] = 'J-11A',
          ['unitId'] = 1,
          ['psi'] = 0,
          ['parking_id'] = '25',
          ['x'] = -5011.9448015555,
          ['name'] = '固定翼-1-1',
          ['payload'] = {
            ['pylons'] = {
              [1] = {
                ['CLSID'] = '{RKL609_L}'
              }, -- end of [1]
              [2] = {
                ['CLSID'] = '{FBC29BFE-3D24-4C64-B81D-941239D12249}'
              }, -- end of [2]
              [3] = {
                ['CLSID'] = 'B-8M1 - 20 S-8OFP2'
              }, -- end of [3]
              [4] = {
                ['CLSID'] = '{B4C01D60-A8A3-4237-BD72-CA7655BC0FE9}'
              }, -- end of [4]
              [5] = {
                ['CLSID'] = '{B4C01D60-A8A3-4237-BD72-CA7655BC0FE9}'
              }, -- end of [5]
              [6] = {
                ['CLSID'] = '{B4C01D60-A8A3-4237-BD72-CA7655BC0FE9}'
              }, -- end of [6]
              [7] = {
                ['CLSID'] = '{B4C01D60-A8A3-4237-BD72-CA7655BC0FE9}'
              }, -- end of [7]
              [8] = {
                ['CLSID'] = 'B-8M1 - 20 S-8OFP2'
              }, -- end of [8]
              [9] = {
                ['CLSID'] = '{FBC29BFE-3D24-4C64-B81D-941239D12249}'
              }, -- end of [9]
              [10] = {
                ['CLSID'] = '{RKL609_R}'
              } -- end of [10]
            }, -- end of ["pylons"]
            ['fuel'] = 9400,
            ['flare'] = 96,
            ['chaff'] = 96,
            ['gun'] = 100
          }, -- end of ["payload"]
          ['y'] = 242993.84690978,
          ['heading'] = 0,
          ['callsign'] = 101,
          ['onboard_num'] = '010'
        } -- end of [1]
      }, -- end of ["units"]
      ['y'] = 242993.84690978,
      ['x'] = -5011.9448015555,
      ['name'] = '固定翼-1',
      ['communication'] = true,
      ['start_time'] = 0,
      ['frequency'] = 127.5
    } -- end of [1]
  } -- end of ["group"]
} -- end of ["plane"]
