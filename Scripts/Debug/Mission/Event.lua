Mission = Mission or {}
Mission.eventHandler = {}

function Mission.eventHandler.onEvent(handler, event)
  local status, error =
    pcall(
    function(event)
      Tools.net.udp_send_msg({id = '', type = 'event', date = os.date('%Y-%m-%d %H:%M:%S'), payload = event})
    end,
    event
  )
  if (not status) then
    Tools.env.err(string.format('Mission Event处理出错:%s', error))
  end
end

world.addEventHandler(Mission.eventHandler)
env.info('Mission EventHandler 加载完成')

DebugLua = {}
DebugLua.path = lfs.writedir() .. 'Scripts\\debug.lua'
DebugLua.customPath = 'C:\\Users\\Administrator\\Desktop\\DCS\\debug.lua'
function DebugLua.Load(arg)
  if arg then
    DebugLua.path = arg
  end
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
DebugLua.loadScript = missionCommands.addSubMenu('加载脚本')
missionCommands.addCommand('默认脚本', DebugLua.loadScript, DebugLua.Load)
missionCommands.addCommand('自定义脚本', DebugLua.loadScript, DebugLua.Load, DebugLua.customPath)
missionCommands.addCommand(
  '说明',
  DebugLua.loadScript,
  function()
    trigger.action.outText('默认脚本位于:\n' .. tostring(DebugLua.path), 15)
    trigger.action.outText('自定义脚本位于:\n' .. tostring(DebugLua.customPath), 15)
  end
)
