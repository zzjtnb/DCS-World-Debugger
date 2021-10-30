local base = world.getAirbases()
local myBaseTbl = {}
for i = 1, #base do
  local info = {}
  info.desc = Airbase.getDesc(base[i])
  info.callsign = Airbase.getCallsign(base[i])
  info.id = Airbase.getID(base[i])
  info.cat = Airbase.getCategory(base[i])
  info.point = Airbase.getPoint(base[i])
  info.park = Airbase.getParking(base[i])

  if Airbase.getUnit(base[i]) then
    info.unitId = Airbase.getUnit(base[i]):getID()
  end

  myBaseTbl[info.callsign] = info
end

return myBaseTbl
