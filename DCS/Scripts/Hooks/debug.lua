--- Dedicated server Game User Interface script
-- required for proper DCS utilities start
-- Lua 5.1


local lfs = require("lfs")
---@diagnostic disable-next-line: undefined-field
local scriptDirectory = lfs.writedir()

local function addToPackagePath(paths)
  for _, path in ipairs(paths) do
    package.path = package.path .. ";" .. scriptDirectory .. path
  end
end

local paths = {
  'Scripts/Debug/?.lua',
  'Scripts/Debug/modules/?.lua',
}

addToPackagePath(paths)

local function createMessage(message)
  local res = {
    type = "message",
    status = true,
    message = message
  }
  return res
end

local TCP = require("tcp")

if not TCP.server.server.current then
  TCP.server:create_server()
  local data = 'DCS World Debugger 已启动,可以调试Lua脚本'
  -- net.log(data)
  TCP.client:send(createMessage(data))
end

------------------------ 定义 Debug 的 callbacks ------------------------

local hooks = {}
function hooks.onMissionLoadBegin()
  -- 初始化游戏数据
  -- world.addEventHandler尚未执行
  local data = '开始加载任务'
  net.log('Debug Hooks Callbacks: ' .. data)
  TCP.client:send(createMessage(data))
end

function hooks.onMissionLoadEnd()
  -- world.addEventHandler已经执行
  local data = '任务加载结束'
  net.log('Debug Hooks Callbacks: ' .. data)
  TCP.client:send(createMessage(data))
end

function hooks.onSimulationStart()
  if not TCP.server.server.current then
    TCP.server:create_server()
  end
  local data = '游戏界面开始运行'
  -- net.log('Debug Hooks Callbacks: ' .. data)
  TCP.client:send(createMessage(data))
end

-- 在模拟运行时不断发生,这个函数运行速度极快,每秒几百次.
-- 强烈建议进行检查以限制代码从此函数运行的频率.
function hooks.onSimulationFrame()
  TCP.server:handle_coroutines() -- 处理所有协程
end

function hooks.onSimulationStop()
  local data = '游戏界面已停止运行'
  -- net.log('Debug Hooks Callbacks: ' .. data)
  TCP.client:send(createMessage(data))
  -- TCP.server:stop()
end

-- 设置用户callbacs,使用上面定义的功能映射DCS事件处理程序
DCS.setUserCallbacks(hooks)

net.log("Debug Hooks Callbacks: 加载完成")
