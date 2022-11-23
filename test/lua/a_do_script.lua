net.dostring_in('mission', 'a_do_script([[trigger.action.outText("加载成功(mission)", 5 , false)]])')
net.dostring_in('server', 'trigger.action.outText("加载成功(server)", 5, false)')

-- dofile(lfs.writedir() .. 'Scripts/Debug/Tools/utils.lua')

-- net.log(net.lua2json(_G))
net.log('-------------调试结束-----------------')

-- net.dostring_in('mission', 'missionCommands.removeItem({[1] = "加载脚本"})')

-- local result = {type = 'ServerData', event = 'aa', data = {a = 1, b = 2, c = 3}, executionTime = {dcs_current_frame_delay = 10}}
-- Tools.net.tcp_send_msg({type = 'ServerData', event = 'aa', data = {a = 1, b = 2, c = 3}, executionTime = {dcs_current_frame_delay = 10}})

-- Tools.net.tcp_send_msg({ executionTime = {dcs_current_frame_delay = 18416.500000001},type = 'ServerData',event = 'LogChat',data = {datetime = '2022-04-24 21:27:59', player = '服里最帅的人', ucid = '438dcc14ab7e0354d0c7a8da5d058c43', msg = 'debug', missionhash = '【NP2.0 PVP动态战役】古达乌塔vs库塔伊西V10.0.8@3.0.0@20220424_212300', all = -1}})

-- Tools.net.tcp_send_msg({type = 'ServerStatus', payload = {msg = '游戏界面开始运行,可以开始调试Lua脚本'}})

-- a_do_script("Tools.net.tcp_send_msg({type = 'ServerStatus', payload = {msg = '游戏界面开始运行,可以开始调试Lua脚本'}})")

-- Tools.net.tcp_send_msg({"executionTime":{"dcs_current_frame_delay":14218.599999992},"type":"ServerData","event":"LogChat","data":{"datetime":"2022-04-24 19:58:02","player":"服里最帅的人","ucid":"438dcc14ab7e0354d0c7a8da5d058c43","msg":"dsf","missionhash":"【NP2.0 PVP动态战役】古达乌塔vs库塔伊西V10.0.8@3.0.0@20220424_195634","all":-1}})

-- local loadScriptPath = lfs.writedir() .. 'Scripts/Debug/Test'
-- Tools.attrdir(loadScriptPath)

-- 查看多人游戏 "mission"环境中可用的内容列表：
-- local fun_str = 'local keys = {} for k, v in pairs(_G) do  keys[#keys + 1] = k end return keys'
-- local status, retval = Tools.dostring_api_env(fun_str)
-- net.log(status)
-- net.log(net.lua2json(retval))

-- net.dostring_in('mission')一定要加a_do_script

-- a_do_script
-- a_do_script('')括号里面必须要''分号
-- 发送	 a_do_script(env.info("hello World")) return "Hello DCS"
-- 解析成  [string "a_do_script(env.info("hello World")) return "Hello DCS""]
-- 上面这样会报错，不能解析
-- 要返回内容必须写在a_do_script('')后面 return
-- a_do_script('env.info("hello World") return "Hello DCS"') 这样不会返回内容
-- a_do_script('env.info("hello World")') return "Hello DCS" 这样会返回 Hello DCS

-- --错误的写法
-- local str = "a_do_script(env.info('hello World')) return 'Hello DCS'"
-- LuaNET: [string "a_do_script(env.info('hello World')) return 'Hello DCS'"]

-- --正确的写法
-- --第一种写法
-- local b = [[a_do_script("env.info('hello World')") return 'Hello DCS']] --这种也可以
-- local res, status = net.dostring_in('mission', b) -- "Hello DCS",true

-- --第二种写法
-- local str = "a_do_script(\"env.info('hello World')\") return 'Hello DCS'"
-- local res, status = net.dostring_in('mission', str) -- "Hello DCS",true

-- --第三种写法
-- local sttr = "env.info('hello B')"
-- local a = [[a_do_script("]] .. sttr .. [[")]]
-- local res, status = net.dostring_in('mission', a) --'',true

-- local b = [[a_do_script("env.info('hello World')") return 'Hello DCS']]

-- local sttr = "local JSON = loadfile('Scripts/JSON.lua')() local tb = {name = 'dcs', age = 20} local tableToString = JSON:encode(tb) env.info(tableToString)"

-- local a = [[local JSON = loadfile('Scripts/JSON.lua')()
--  a_do_script("]] .. sttr .. [[") return JSON:encode({a=1,b=2})]]

-- net.log(b, '\n', a)

-- local res, fettle = net.dostring_in('mission', a)
-- net.log(res, fettle, 'test')

-- myscript = {}
-- function myscript.onMissionLoadEnd()
--   net.dostring_in('mission', 'a_do_script("loadfile(\\"D:/myscript.lua\\")()");')
-- end
-- DCS.setUserCallbacks(myscript)

-- local JSON = require('JSON')
-- for k, v in pairs(_G) do
--   _G[k] = v
-- end
-- return JSON:encode(_G)

-- local keys = {}
-- for k, v in pairs(_G) do
--   keys[k] = v
--   net.log(k, v)
-- end
-- return keys
