local data = {}
data.result, data.status = net.dostring_in('mission', 'return a_do_script([[return "mission"]])')
net.log(net.lua2json(data), 'mission1')
data.result, data.status = net.dostring_in('mission', 'return "mission"')
net.log(net.lua2json(data), 'mission2')
data.result, data.status = net.dostring_in('server', 'return "{a=1}"')
net.log(net.lua2json(data), 'server')

-- net.log(net.lua2json(net.get_stat(1)))

-- net.log(net.lua2json(base.DCS), '_G中的数据')

local keys = {}
for k, v in pairs(_G) do
  table.insert(keys, k)
end
TCP.send_data(keys)

-- local base = _G
-- net.log(base._APP_VERSION, '_G中的数据')
-- net.log(base.ED_FINAL_VERSION, '_G中的数据')
-- net.log(base["__DCS_VERSION__"], '_G中的数据')

net.log('-------------调试结束-----------------')

-- local JSON = require('JSON')
-- local keys = {
--   -- 用户游戏设置
--   option = DCS.getUserOptions()
-- }
-- return JSON:encode(keys)

TCP.send_data('顶顶顶')
