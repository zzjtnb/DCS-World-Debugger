local Time = require("utils.time")
local Net = require("utils.net")
local utils = require("utils.json")
local TCP
local hooks = {
  handler = {},
}

function hooks.init(tcp)
  TCP = tcp
end

function hooks.message(send, message)
  if not net then
    -- send(message)
    TCP.client:send(message)
    return
  end
  local request, status = utils.json2lua(message)
  if status and type(request) == 'table' then
    local result, status = hooks.request(request)
    if status then
      TCP.client:send(result)
    end
  else
    message = string.format("请求解析失败: %s", tostring(request))
    TCP.client:send(request)
  end
end

function hooks.request(request)
  local result, status = nil, false
  if (request.type and request.payload) then
    local method = hooks.handler[request.type]
    if method then result, status = method(request) end
  end
  return result, status
end

function hooks.handler.debug(request)
  local result, status = nil, false
  if request.payload.type == 'loadstring' then
    result, status = Net.safe_loadstring(request.payload.content)
  end
  if request.payload.type == 'dostring_in' then
    result, status = Net.dostring_in(request.payload.state, request.payload.content)
  end

  request.status = status
  request.data = result
  request.date = Time.current()
  request.payload = nil
  if status and not result then
    request.data = '执行成功'
  end
  return request, true
end

return hooks
