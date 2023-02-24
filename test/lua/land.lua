local pro = land.profile((trigger.misc.getZone('red_tanks').point), (trigger.misc.getZone('blue_tanks').point))
for i, data in pairs(pro) do
  trigger.action.smoke(data, 0)
end
-- return pro

local someZone = trigger.misc.getZone('red_tanks').point
someZone.y = land.getHeight({x = someZone.x, y = someZone.z}) -- compensate for ground level
trigger.action.effectSmokeBig(someZone, 8, 0.75)

local foundUnits = {}
local sphere = trigger.misc.getZone('red_tanks')
local volS = {
  id = world.VolumeType.SPHERE,
  params = {
    point = sphere.point,
    radius = sphere.radius
  }
}

local ifFound = function(foundItem, val)
  foundUnits[#foundUnits + 1] = foundItem:getName()
  return true
end
world.searchObjects(Object.Category.UNIT, volS, ifFound)
