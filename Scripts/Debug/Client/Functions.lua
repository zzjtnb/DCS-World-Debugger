-- Client FUNCTIONS --

Client = Client or {}

function Client.functions.getGroups(args)
  local groups = {}
  local coalitionGroups = coalition.getGroups(args.coalitionId, args.groupCategory)
  for groupId, group in pairs(coalitionGroups) do
    local groupInfo = {}
    if not group:isExist() then
      Tools.net.log({'Group does not exist: ', group})
      return
    end
    groupInfo.id = groupId
    groupInfo.name = group:getName()
    groupInfo.category = group:getCategory()
    groupInfo.coalition = group:getCoalition()
    groupInfo.size = group:getSize()
    groupInfo.initialSize = group:getInitialSize()
    table.insert(groups, groupInfo)
  end
  return groups
end

function Client.functions.getUnits(args)
  local units = {}
  local group = Group.getByName(args.groupName)
  if not group:isExist() then
    Tools.net.log({'Group does not exist: ', group})
    return
  end
  local units = {}
  for unitId, unit in pairs(group:getUnits()) do
    local unitInfo = {}
    unitInfo.id = unitId
    unitInfo.name = unit:getName()
    unitInfo.fuel = unit:getFuel()
    unitInfo.ammo = unit:getAmmo()
    unitInfo.sensors = unit:getSensors()
    unitInfo.callsign = unit:getCallsign()
    unitInfo.hasRadar, unitInfo.trackedObject = unit:getRadar()
    unitInfo.type = unit:getTypeName()
    unitInfo.desc = unit:getDesc()
    unitInfo.inAir = unit:inAir()
    unitInfo.isActive = unit:isActive()
    unitInfo.life = unit:getLife()
    unitInfo.life0 = unit:getLife0()
    unitInfo.position = unit:getPosition()
    unitInfo.velocity = unit:getVelocity()
    unitInfo.nearestCargos = unit:getNearestCargos()
    table.insert(units, unitInfo)
  end
  return units
end
