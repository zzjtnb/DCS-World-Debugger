local socket = require("socket")
local logger = require("utils.logger")
local StringUtils = require("utils.string")

--- 网络服务器模块
---@class NetServer
local NetServer = {
  server = { sockets = {} },
  client = { list = {} },
  coroutine = { list = {} },
  handler = { list = {} },
}

--- 创建新的 NetServer 对象
--- 使用给定的配置初始化服务器实例
---@param config table 初始化配置表,包括日志配置,主机地址和端口
---@return NetServer 新的服务器实例
function NetServer:new(config)
  local obj = {}
  setmetatable(obj, self)
  self.__index = self
  obj:initialize(config)
  return obj
end

--- 初始化服务器
--- 根据配置初始化服务器,包括设置日志,主机地址和端口
---@param config table 初始化配置
function NetServer:initialize(config)
  self.log = logger:new(config.log)      -- 初始化日志记录器
  self.host = config.host or "localhost" -- 设置主机地址,默认为localhost
  self.port = config.port                -- 设置端口
end

--- 创建服务器套接字并开始监听
--- 绑定服务器到指定的主机地址和端口,并设置相关选项
function NetServer:create_server()
  local err = nil
  -- 绑定服务器套接字
  self.server.current, err = socket.bind(self.host, self.port)
  if not self.server.current then
    -- 记录绑定错误
    self:log_error("绑定服务器套接字", err)
  else
    -- 设置非阻塞模式
    self.server.current:settimeout(0)
    -- 禁用Nagle算法,减少延迟
    self.server.current:setoption("tcp-nodelay", true)
    -- 更新客户端套接字列表
    self:update_client_sockets()
    -- 记录服务器启动信息
    self:log_Info("服务器监听在: ", self.host, ":", self.port)
  end
end

--- 记录错误日志
--- 记录在指定上下文中发生的错误
---@param context string 错误发生的上下文描述
---@param err string 错误信息
function NetServer:log_error(context, err)
  if err and err ~= "timeout" then
    -- 记录错误信息
    self.log:error(string.format("TCP(Server) %s时出错: %s", context, err))
  end
end

--- 记录信息日志
--- 记录在指定上下文中发生的信息
---@param ... unknown
function NetServer:log_Info(...)
  local extra_messages = { ... }
  self.log:info(string.format("TCP(Server) %s", table.concat(extra_messages)))
end

--- 启动服务器
--- 启动服务器主循环,持续处理客户端连接和消息
function NetServer:start()
  -- 创建服务器套接字
  self:create_server()
  while true do
    -- 处理所有协程
    self:handle_coroutines()
  end
end

--- 处理所有协程
--- 通过socket.select选择可读的套接字并处理相应的客户端消息
function NetServer:handle_coroutines()
  -- 选择可读套接字
  local readable, _, err = socket.select(self.server.sockets, nil, 0.1)
  -- 记录选择错误
  self:log_error("服务器选择", err)
  for _, client in ipairs(readable) do
    if client == self.server.current then
      -- 接受新客户端连接
      self:accept_clients()
    else
      self.client.current = client
      -- 处理客户端消息
      self:handle_message()
    end
  end
  -- 清理已完成的协程
  self:cleanup_coroutines()
end

--- 接受新的客户端连接
--- 接受新客户端连接并初始化相应的套接字
function NetServer:accept_clients()
  local client, err = self.server.current:accept()
  if client then
    -- 设置客户端套接字为非阻塞模式
    client:settimeout(0)
    self.client.list[client] = true
    -- 记录新客户端连接信息
    -- local ip, port = client:getpeername()
    -- self:log_Info('新客户端连接:', ip, port)
    -- 启动处理客户端消息的协程
    self:start_coroutine(client)
    -- 更新客户端套接字列表
    self:update_client_sockets()
  else
    -- 记录接受连接错误
    self:log_error("接受客户端连接", err)
  end
end

--- 启动处理客户端消息的协程
--- 为每个新客户端创建一个协程来处理其消息
---@param client userdata 客户端套接字
function NetServer:start_coroutine(client)
  local co = coroutine.create(function()
    while self.client.list[client] do
      self.client.current = client
      -- 处理客户端消息
      self:handle_message()
      -- 挂起协程
      coroutine.yield()
    end
  end)
  self.coroutine.list[client] = co
  -- 启动协程
  coroutine.resume(co)
end

--- 清理已经完成的协程
--- 移除并关闭已完成的客户端协程和套接字
function NetServer:cleanup_coroutines()
  for client, co in pairs(self.coroutine.list) do
    if coroutine.status(co) == "dead" then
      self.coroutine.list[client] = nil
      self.client.list[client] = nil
      -- 关闭客户端套接字
      client:close()
      -- 更新客户端套接字列表
      self:update_client_sockets()
    end
  end
end

--- 处理客户端消息
--- 接收并处理来自当前客户端的消息
function NetServer:handle_message()
  local ip, port = self.client.current:getpeername()
  -- self.log:debug(string.format("拦截客户端消息: %s:%s", ip, port))
  -- 接收客户端消息
  local message, err = self.client.current:receive()
  if message then
    -- 处理接收到的消息
    self:process_message(message:gsub("\r\n$", ""):gsub("quit$", ""))
  elseif err == "closed" then
    -- 记录客户端断开连接信息
    self:log_Info("客户端断开连接:", ip, port)
    -- 移除断开的客户端
    self:remove_client(self.client.current)
  else
    -- 记录接收消息错误
    self:log_error(string.format("接收客户端消息 %s:%s", ip, port), err)
  end
end

--- 处理收到的消息
--- 解析并处理来自客户端的消息,并调用相应的处理器
---@param message string 客户端发送的消息
function NetServer:process_message(message)
  local ip, port = self.client.current:getpeername()
  local front, back = StringUtils.trimEdges(message, 100)
  local str = string.format("%s...%s", front, back)
  self:log_Info("接收客户端消息: ", ip, ":", port, "\n", str)
  local send = function(response)
    -- 发送响应消息
    self:send(response)
  end
  if next(self.handler.list) == nil then
    -- 调用默认处理器
    self.handler.default(send, message)
  else
    -- 调用注册的处理器
    for _, handler in ipairs(self.handler.list) do
      handler(send, message)
    end
  end
end

--- 发送消息到客户端
--- 编码并发送消息到当前客户端
---@param message string 要发送的消息
function NetServer:send(message)
  local ip, port = self.client.current:getpeername()
  local str = message:sub(1, 20) .. message:sub(-20)
  self.log:debug(string.format("发送消息到客户端: %s:%s\n%s", ip, port, str))
  -- 添加 'quit\r\n' 到消息末尾
  local longString = message .. 'quit\r\n'
  -- 字节数=字符串长度*平均每个字符的字节数
  -- 根据 UTF-8 编码规则,我们可以估算平均每个字符的字节数:
  -- 英文字母和数字:占用 1 个字节.
  -- 中文汉字:占用 3 个字节.
  -- 分段字符串,默认每段大小为 8192 字节
  local chunks = StringUtils.chunkString(longString)
  -- 发送每段字符串
  for _, chunk in ipairs(chunks) do
    local success, err = self.client.current:send(chunk)
    if not success then
      self.log:error('TCP Server 发送数据失败: ' .. err)
      return
    end
  end
end

--- 移除客户端
--- 关闭并移除指定的客户端
---@param client any  客户端套接字
function NetServer:remove_client(client)
  local ip, port = client:getpeername()
  if self.client.list[client] then
    self.client.list[client] = nil
    self.coroutine.list[client] = nil
    -- 记录客户端移除信息
    self:log_Info("移除客户端:", ip, port)
    -- 尝试关闭客户端套接字
    pcall(function() client:close() end)
    -- 更新客户端套接字列表
    self:update_client_sockets()
  end
end

--- 更新客户端套接字列表
--- 更新服务器当前维护的所有套接字列表
function NetServer:update_client_sockets()
  self.server.sockets = { self.server.current }
  -- 将所有客户端套接字加入列表
  for socket, _ in pairs(self.client.list) do
    table.insert(self.server.sockets, socket)
  end
end

--- 默认消息处理器
--- 默认的消息处理函数,回显收到的消息
---@param send_func function 发送函数
---@param message string 接收到的消息
function NetServer.handler.default(send_func, message)
  -- 回显消息
  send_func(string.format("回显: %s", message))
end

--- 注册消息处理器
--- 添加新的消息处理器到处理器列表
---@param handler function 新的消息处理函数
function NetServer.handler.register(handler)
  -- 将处理器添加到列表
  table.insert(NetServer.handler.list, handler)
end

--- 停止服务器
--- 停止服务器并关闭所有客户端连接和日志
function NetServer:stop()
  -- 记录服务器停止信息
  self:log_Info("服务器停止中")
  -- 关闭并移除所有客户端
  for client, _ in pairs(self.client.list) do
    self:remove_client(client)
  end
  pcall(function()
    -- 关闭服务器套接字
    self.server.current:close()
    -- 关闭日志记录器
    self.log:close()
  end)
end

return NetServer


--[[
-- 假设有一个名为 `logger` 的日志模块
local logger = require("utils.logger")

-- 定义服务器配置
local config = {
  log = {
    file = "server.log",   -- 日志文件路径
    level = "debug"        -- 日志级别
  },
  host = "localhost",      -- 服务器主机地址
  port = 12345             -- 服务器端口
}

-- 引入并创建 NetServer 实例
local NetServer = require("NetServer")
local server = NetServer:new(config)

-- 注册自定义消息处理器
NetServer.handler.register(function(send, message)
  -- 自定义处理逻辑,比如简单回显消息
  local response = "Server received: " .. message
  send(response)
end)

-- 启动服务器
-- 服务器将在当前线程中运行
server:start()

-- 以下是如何优雅地停止服务器的示例(可以绑定到信号或用户输入事件)
local function stop_server()
  server:stop()
end

-- 示例:在 10 秒后停止服务器
socket.sleep(10)
stop_server()
]]
