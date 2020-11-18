--- Pipe 模块定义和初始化
local Pipe = {}
Pipe.__index = Pipe

--- 创建 Pipe 对象的新实例
--- @return table Pipe 的实例
function Pipe.new()
  local instance = setmetatable({}, Pipe)
  instance.packageHeaderLen = 8       -- 包头长度为8字节
  instance.packageSerialNumberLen = 4 -- 包序列号长度为4字节
  instance.serialNumber = 0           -- 初始化序列号为0
  return instance
end

--- 将整数转换为4字节(高低位)
--- @param int number 要转换的整数
--- @return string 转换后的字节字符串
local function intToBytes(int)
  local bytes = {}
  for i = 3, 0, -1 do
    bytes[#bytes + 1] = string.char(math.floor(int / 256 ^ i) % 256)
  end
  return table.concat(bytes)
end

--- 将4个字节转换为整数
--- @param ... number 字节
--- @return number 转换后的整数
local function bytesToInt(...)
  local bytes = { ... }
  local int = 0
  for i = 1, #bytes do
    int = int * 256 + bytes[i]
  end
  return int
end

--- 对数据进行编码,并添加包头信息
--- @param data string 要编码的数据
--- @param serialNumber number 序列号(可选)
--- @return string 编码后的数据包
function Pipe:encode(data, serialNumber)
  data = string.gsub(data, "--.*|\n", "") -- 移除注释和换行
  local bodyBuffer = data
  if serialNumber == nil then
    serialNumber = self.serialNumber          -- 使用当前序列号
    self.serialNumber = self.serialNumber + 1 -- 序列号自增
  end

  local serialNumberBytes = intToBytes(serialNumber)        -- 序列号转换为字节
  local bodyLengthBytes = intToBytes(#bodyBuffer)           -- 消息体长度转换为字节
  local headerBuffer = serialNumberBytes .. bodyLengthBytes -- 组装包头

  return headerBuffer .. bodyBuffer                         -- 返回完整的数据包
end

--- 对缓冲区中的数据进行解码
--- @param buffer string 要解码的缓冲区
--- @return table @解码后的数据,包括序列号,消息体长度和消息体内容
function Pipe:decode(buffer)
  local decodeData = {
    serialNumber = 0, -- 初始化序列号
    bodyLen = 0,      -- 初始化消息体长度
    body = ""         -- 初始化消息体内容
  }

  if #buffer >= self.packageHeaderLen then
    -- 从缓冲区中提取包头
    local headerBuffer = string.sub(buffer, 1, self.packageHeaderLen)
    -- 从缓冲区中提取消息体
    local bodyBuffer = string.sub(buffer, self.packageHeaderLen + 1)
    -- 读取包序列号 (前self.packageSerialNumberLen字节)
    decodeData.serialNumber = bytesToInt(string.byte(headerBuffer, 1, self.packageSerialNumberLen))
    -- 读取消息体长度 (接下来的self.packageHeaderLen - self.packageSerialNumberLen字节)
    decodeData.bodyLen = bytesToInt(string.byte(headerBuffer, self.packageSerialNumberLen + 1, self.packageHeaderLen))
    -- 读取消息体内容
    local totalBody = string.sub(bodyBuffer, 1, decodeData.bodyLen)
    -- 移除末尾的 "quit\r\n"
    decodeData.body = totalBody:gsub("\r\n$", ""):gsub("quit$", "")
    print(decodeData.body, decodeData.bodyLen, decodeData.serialNumber)
  else
    print(string.format("Buffer 太短,无法解码.bufferLength:%d, packageHeaderLen:%d", #buffer, self.packageHeaderLen))
  end

  return decodeData
end

--- 获取数据包的总长度
--- @param buffer string 要检查的缓冲区
--- @return number @数据包的总长度,如果缓冲区长度不足,则返回0
function Pipe:getPackageLength(buffer)
  if #buffer < self.packageHeaderLen then
    return 0 -- 缓冲区长度不足,无法解析包长度
  end

  local bodyLength = bytesToInt(string.byte(buffer, self.packageSerialNumberLen + 1, self.packageHeaderLen)) -- 读取消息体长度
  local totalLength = self.packageHeaderLen + bodyLength                                                     -- 计算数据包总长度

  local newlineBuffer = "quit\r\n"
  local endBuffer = string.sub(buffer, totalLength + 1, totalLength + #newlineBuffer) -- 提取末尾缓冲区

  if endBuffer == newlineBuffer then
    return totalLength + #newlineBuffer -- 如果末尾有换行符,返回完整长度
  end

  return totalLength -- 返回数据包总长度
end

return Pipe


--[[
local Pipe = require("TCP.pipe")
local pipe = Pipe.new()
local encode = pipe:encode('Hello World')
local decoded = pipe:decode(encode)
]]
