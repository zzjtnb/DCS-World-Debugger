local function getByName(name)
  local JSON = require('JSON')
  local baseTbl = {}
  local gp = Group.getByName(name)
  baseTbl.units = gp:getUnits()
  baseTbl.name = gp:getName()
  baseTbl.groupId = gp:getID()
  baseTbl.category = gp:getCategory()
  baseTbl.coalition = gp:getCoalition()
  for i, data in pairs(baseTbl.units) do
    local info = {}
    baseTbl.units[i] = data:getDesc()
    baseTbl.info = info
  end
  return JSON:encode(baseTbl)
end
-- getByName('red_tanks')
local gp = getByName('Mi-8-1')
if #gp.units > 0 then
  -- 获取第一个单位
  local unit = gp.units[1]
  -- 获取该单位的位置
  local unitPosition = gp.unit:getPosition().p
  -- 发射信号弹
  -- 参数说明：unitPosition, 颜色(0-红, 1-绿, 2-白, 3-黄), 强度(0-1), 时间
  trigger.action.signalFlare(unitPosition, 0, 1, 0) -- 红色信号弹
end

local function getAllGroups ()
  local JSON = require('JSON')
  local tbl ={}
  for i, gp in pairs(coalition.getGroups(2)) do
    table.insert(tbl, Group.getName(gp))
   end
  return JSON:encode(tbl)
end

getAllGroups()
