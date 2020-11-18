local base = _G
local hooks = require("hooks")
local config = require("config")
local NetServer = base.require("TCP.server")
local NetClient = base.require("TCP.client")
local server = NetServer:new(config.server)
local client = NetClient:new(config.client)
local TCP = {
  server = server,
  client = client,
}
hooks.init(TCP)
-- 定义并注册多个消息处理器
-- local function time_handler(send_func, message)
--   send_func("当前时间: " .. os.date("%Y-%m-%d %H:%M:%S"))
-- end
-- server.handler.register(time_handler)
server.handler.register(hooks.message, client)

return TCP
