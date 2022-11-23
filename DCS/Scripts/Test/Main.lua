net.dostring_in('mission', 'a_do_script([[trigger.action.outText("加载成功(mission)", 5 , false)]])')
net.dostring_in('server', 'trigger.action.outText("加载成功(server)", 5, false)')
-- net.log(net.lua2json(_G))
net.log('-------------调试结束-----------------')
