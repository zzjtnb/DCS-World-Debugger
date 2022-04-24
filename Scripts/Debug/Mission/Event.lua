Mission = Mission or {}
Mission.eventHandler = Mission.eventHandler or {}

function Mission.eventHandler.onEvent(handler, event)
  local status, error =
    pcall(
    function(event)
      Tools.net.tcp_send_msg({id = '', type = 'event', date = os.date('%Y-%m-%d %H:%M:%S'), payload = event})
    end,
    event
  )
  if (not status) then
    Tools.env.err(string.format('Mission Event处理出错:%s', Tools.JSON:encode(error)))
  end
end

world.addEventHandler(Mission.eventHandler)
env.info('Mission EventHandler 加载完成')

-- 加载调试脚本
DebugLua = {}
-- DebugLua.path = 'F:\\Office\\GitHub\\DCS_World_Debugger\\test\\test.lua'
DebugLua.path = lfs.writedir() .. 'Scripts/Test/Main.lua'
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
