local socket = require("socket")
local logger = require("utils.logger")
local StringUtils = require("utils.string")
local utils = require("utils.json")

local NetClient = {}
NetClient.__index = NetClient

function NetClient:new(config)
  local client = setmetatable({}, NetClient)
  setmetatable(client, NetClient)
  client.host = config.host or "localhost"
  client.port = config.port or 9000
  client.socket = nil
  client.log = logger:new(config.log)
  return client
end

--- 记录错误日志
--- 记录在指定上下文中发生的错误
---@param context string 错误发生的上下文描述
---@param err string 错误信息
function NetClient:log_error(context, err)
  if err and err ~= "timeout" then
    -- 记录错误信息
    self.log:error(string.format("TCP(Client) %s时出错: %s", context, err))
  end
end

--- 记录信息日志
--- 记录在指定上下文中发生的信息
---@param ... unknown
function NetClient:log_Info(...)
  local extra_messages = { ... }
  self.log:info(string.format("TCP(Client) %s", table.concat(extra_messages)))
end

---创建连接
---@return boolean,string
function NetClient:connect()
  self.socket = socket.tcp()
  local res, err = self.socket:connect(self.host, self.port)
  if res then
    -- 设置超时时间(单位是秒).如果设置为 0,则表示没有超时时间限制
    self.socket:settimeout(0)
    self.socket:setoption('keepalive', true)
    self.socket:setoption('reuseaddr', true)
    -- set immediate transmission mode
    self.socket:setoption('tcp-nodelay', true)
  end
  return res, err
end

function NetClient:send(data)
  local res, err = self:receive()
  if not res or not self.socket then
    res, err = self:connect()
    if not res then
      return res, err
    end
  end
  local decode = utils.lua2json(data)
  local front, back = StringUtils.trimEdges(decode, 100)
  local str = string.format("%s...%s", front, back)
  self:log_Info("发送服务器消息: ", self.host, ":", self.port, "\n", str)
  -- 添加 'quit\r\n' 到消息末尾
  local longString = string.format("%squit\r\n", decode)
  -- 字节数=字符串长度*平均每个字符的字节数
  -- 根据 UTF-8 编码规则,我们可以估算平均每个字符的字节数:
  -- 英文字母和数字:占用 1 个字节.
  -- 中文汉字:占用 3 个字节.
  -- 分段字符串,默认每段大小为 8192 字节
  local chunks = StringUtils.chunkString(longString)
  -- 发送每段字符串
  for _, chunk in ipairs(chunks) do
    local success, err = self.socket:send(chunk)
    if not success then
      self:log_error('发送数据', err)
      return
    end
  end
end

function NetClient:receive()
  if not self.socket then
    return false, "未连接到服务器"
  end
  local response, err = self.socket:receive()
  if err then
    -- self.log:error("接收消息: " .. err)
    if err == "closed" then
      self:close()
    end
    return false, err
  end
  -- self.log:error("收到回复: " .. response)
  return true, response
end

function NetClient:close()
  if self.socket then
    self.socket:close()
    self.socket = nil
  end
end

return NetClient
