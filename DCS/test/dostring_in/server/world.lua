--- 加载调试脚本
local function loadDebug()
  local DebugLua = {}
  DebugLua.path = 'F:/Office/GitHub/DCS_World_Debugger/test/test.lua'
  function DebugLua.loadFile(arg)
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

  missionCommands.addCommand('加载脚本', nil, DebugLua.loadFile)
end

---监听标记事件
local function addEventHandler()
  local Handler = {}
  local JSON = require('JSON')
  function Handler:onEvent(event)
    env.info(JSON:encode(event))
    if event.id == world.event.S_EVENT_MARK_ADDED then
      trigger.action.outText('A mark was added at position' .. JSON:encode(event.pos), 10)
    end
  end
  world.addEventHandler(Handler)
end

local function search()
  local foundUnits = {}
  local sphere = trigger.misc.getZone('red_tanks-1')
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
  return foundUnits
end
