local path = ';E:/Eagle Dynamics/DCS World OpenBeta'
package.path = package.path .. path .. '/Scripts/?.lua'

local JSON = require('JSON')
local test = {
  ['skill'] = 'Average',
  ['type'] = 'ZTZ96B',
  ['unitId'] = 118,
  ['y'] = 242846.07436662,
  ['x'] = -5308.9077018481,
  ['name'] = 'CN-ZJ-1-4',
  ['heading'] = 5.4279739737024,
  ['playerCanDrive'] = true
}

local data = {}
for i = 1, 20 do
  data[i] = {}
  data[i]['type'] = test.type
  data[i]['name'] = 'Unit #' .. tostring(i)
  data[i]['unitId'] = 2
  data[i]['heading'] = 0
  data[i]['playerCanDrive'] = true
  data[i]['skill'] = test.skill
  data[i]['x'] = test.x + 50
  data[i]['y'] = test.y + 50
end
print(JSON:encode(data))

--监听标记事件
local Handler3 = {}
local JSON = loadfile('Scripts/JSON.lua')()
function Handler3:onEvent(event)
  env.info(JSON:encode(world))
  if event.id == world.event.S_EVENT_MARK_ADDED then
    trigger.action.outText('A mark was added at position' .. JSON:encode(event.pos), 10)
  end
end
world.addEventHandler(Handler3)

-- 加载调试脚本
DebugLua = {}
DebugLua.path = 'F:\\Office\\GitHub\\DCS_World_Debugger\\test\\test.lua'
function DebugLua.Load(arg)
  local status, error =
    pcall(
    function()
      dofile(DebugLua.path)
    end
  )
  if (not status) then
    trigger.action.outText('脚本加载错误->%s' .. tostring(error), 10)
  else
    trigger.action.outText('脚本加载成功-->' .. tostring(DebugLua.path), 10)
  end
end

missionCommands.addCommand('加载脚本', nil, DebugLua.Load)
