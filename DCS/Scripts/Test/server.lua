-- 这个文件是net.dostring_in(server)执行下面的代码
-- server环境下没有net,mission环境下没有DCS
env.info(tostring(DCS.isServer()))
-- 游戏状态栏的秒数,相对于游戏开始时间
-- 比如游戏开始时间是2031-1-1 9:10  状态栏时间是2031-1-1 9:16
-- DCS.getModelTime() 返回360(s)

env.info(tostring(DCS.getModelTime()))

env.info(tostring(DCS.getRealTime()))
env.info(tostring(Export.LoGetMissionStartTime()))

