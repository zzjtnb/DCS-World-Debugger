local function smoke()
  local pro = land.profile((trigger.misc.getZone('red_tanks-1').point), (trigger.misc.getZone('blue_tanks-1').point))
  for i, data in pairs(pro) do
    trigger.action.smoke(data, 0)
  end
end
smoke()

local function effectSmokeBig()
  local someZone = trigger.misc.getZone('red_tanks-1').point
  someZone.y = land.getHeight({ x = someZone.x, y = someZone.z }) -- compensate for ground level
  trigger.action.effectSmokeBig(someZone, 8, 0.75)
end

effectSmokeBig()
