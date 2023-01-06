-- local groupData = {
--   ["visible"] = false,
--   ["taskSelected"] = true,
--   ["route"] = {}, -- end of ["route"]
--   ["groupId"] = 2,
--   ["tasks"] = {}, -- end of ["tasks"]
--   ["hidden"] = false,
--   ["units"] = {
--     [1] = {
--       ["type"] = "LAV-25",
--       ["transportable"] = {
--         ["randomTransportable"] = false
--       }, -- end of ["transportable"]
--       ["unitId"] = 2,
--       ["skill"] = "Average",
--       ["y"] = 616314.28571429,
--       ["x"] = -288585.71428572,
--       ["name"] = "Ground Unit1",
--       ["playerCanDrive"] = true,
--       ["heading"] = 0.28605144170571
--     } -- end of [1]
--   }, -- end of ["units"]
--   ["y"] = 616314.28571429,
--   ["x"] = -288585.71428572,
--   ["name"] = "Ground Group",
--   ["start_time"] = 0,
--   ["task"] = "Ground Nothing"
-- } -- end of [1]
-- coalition.addGroup(country.id.USA, Group.Category.GROUND, groupData)
local target = Group.getByName('F15C-1')

net.log('测试', net.lua2json(net.get_player_list()), net.lua2json(target:getUnits()))

local code = [[
DebugLua = {}
DebugLua.path = lfs.writedir() .. 'Scripts/Test/server.lua'
function DebugLua.Load(arg)
  local status, error = pcall(function()
    dofile(DebugLua.path)
  end)
  if (not status) then
    trigger.action.outText('脚本加载错误->%s' .. tostring(error), 10)
  else
    trigger.action.outText('脚本加载成功-->' .. tostring(DebugLua.path), 10)
  end
end

missionCommands.addCommand('加载脚本-mission', nil, DebugLua.Load)
]]
net.dostring_in('server', code)

local text = string.format("return trigger.action.outText(\"Welcome LT COL %s\", 60);", 'ddd')
net.dostring_in('server', text)

net.dostring_in('mission', 'a_do_script([[trigger.action.outText("加载成功(mission)", 5 , false)]])')
net.dostring_in('server', 'trigger.action.outText("加载成功(server)", 5, false)')
