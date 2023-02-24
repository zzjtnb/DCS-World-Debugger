net.log('-------------开始调试-----------------')

local data = {}
local result, status
local code = "return a_do_script([[return toJson({msg='a_do_script'})]])"

result, status = net.dostring_in('mission', code)
data.result = result
data.status = status
--  {"result":"","status":true} a_do_script
net.log(net.lua2json(data), 'a_do_script')

result, status = net.dostring_in('mission', [[return toJson({msg='mission'})]])
data.result = result
data.status = status
--  {"result":"{\"msg\":\"mission\"}","status":true} mission
net.log(net.lua2json(data), 'mission')

result, status = net.dostring_in('server', [[return 'server']])
data.result = result
data.status = status
--  {"result":"server","status":true} server
net.log(net.lua2json(data), 'server')
