-- 遍历地图上的所有空军基地，并在每条跑道周围绘制一个灰色框。
local base = world.getAirbases()
local mId = 0
for i = 1, #base do
  local rny = base[i]:getRunways()
  if rny then
    for j = 1, #rny do
      local points = {}
      local init = rny[j].position
      local bearing = rny[j].course * -1
      local L2 = rny[j].length / 2
      local offset1 = {y = 0, x = init.x + (math.cos(bearing + math.pi) * L2), z = init.z + (math.sin(bearing + math.pi) * L2)}
      local offset2 = {y = 0, x = init.x - (math.cos(bearing + math.pi) * L2), z = init.z - (math.sin(bearing + math.pi) * L2)}
      local width = rny[j].width / 2
      points[1] = {x = offset1.x + (math.cos(bearing + (math.pi / 2)) * width), y = 0, z = offset1.z + (math.sin(bearing + (math.pi / 2)) * width)}
      points[2] = {x = offset1.x + (math.cos(bearing - (math.pi / 2)) * width), y = 0, z = offset1.z + (math.sin(bearing - (math.pi / 2)) * width)}
      points[3] = {x = offset2.x + (math.cos(bearing - (math.pi / 2)) * width), y = 0, z = offset2.z + (math.sin(bearing - (math.pi / 2)) * width)}
      points[4] = {x = offset2.x + (math.cos(bearing + (math.pi / 2)) * width), y = 0, z = offset2.z + (math.sin(bearing + (math.pi / 2)) * width)}
      mId = mId + 1
      trigger.action.quadToAll(-1, mId, points[1], points[2], points[3], points[4], {0, 0, 0, 1}, {0, 0, 0, .5}, 3)
    end
  end
end
