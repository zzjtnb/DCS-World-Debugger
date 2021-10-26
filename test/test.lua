net.dostring_in('server', 'trigger.action.outText("加载成功-->server", 5, false)')
net.log(net.lua2json(net.get_all_clients()))
-- local status, tacview = pcall(require, 'JSON')

-- local JSON = require('JSON')
-- local JSON = loadfile('Scripts/JSON.lua')()
-- local keys = {}
-- for k, v in pairs(_G) do
--   keys[#keys + 1] = k
-- end
-- local res = JSON:encode(keys)
-- net.log(res)
-- return res

dofile('F:/Office/GitHub/DCS_World_Debugger/test/mist_4_4_90.lua')
do
  mist.debug.dump_G('_G_Dump_V1.lua')
end

-- table MissionCommands .addCommand( string name , table/nil path , function functionToRun , any anyArgument )
-- local displayRequests = missionCommands.addSubMenu('显示请求')
-- function displayMsg(flyby)
--   trigger.action.outText('加载成功-->server' .. net.lua2json(flyby), 10, false)
-- end

-- local negativeReply = missionCommands.addCommand('测试', displayRequests, displayMsg, {flyby = false})

-- local positiveReply = missionCommands.addCommand('Roger Ghostrider', displayRequests, displayMsg, {flyby = true})

net.log('加载Hooks成功')

-- local net = require('net')
-- function onNetMissionEnd()
--   if DCS.isServer() == true then
--     net.load_next_mission()
--   end
-- end
-- local hooks = {}
-- hooks.onNetMissionEnd = onNetMissionEnd
-- DCS.setUserCallbacks(hooks)
