-- 加载调试脚本
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
