-- TCP HANDLEFUNCTION --
TCP = TCP or {}
function TCP.handleDebug(request)
  local result, status = nil, nil
  if request.payload.type == 'loadstring' then
    result, status = Tools.loadstring(request.payload.content)
  end
  if request.payload.type == 'dostring_in' then
    if request.payload.env == 'mission' then
      request.payload.content = [[a_do_script("]] .. request.payload.content .. [[")]]
    end
    -- result is a string
    result, status = net.dostring_in(request.payload.env, request.payload.content)
  end

  local response = {
    id = request.id,
    type = request.type,
    sent = os.time(),
    payload = {
      type = request.payload.type,
      status = status,
      date = Tools.getTimeStamp()
    }
  }
  if not status then
    if Tools.isempty(result) then
      result = "执行失败"
    end
    response.payload.msg = result
  else
    if Tools.isempty(result) then
      result = "执行成功"
    end
    response.payload.result = result
  end
  TCP.send(response)
end

function TCP.handleFunction(request)
  local result = TCP.functions[request.payload.functionName](request.payload.args)
  if type(result) ~= 'table' then
    result = {}
  end
  local response = {
    id = request.id,
    type = 'received',
    sent = os.time(),
    payload = result
  }
  TCP.send(response)
end

function TCP.handle(request)
  -- net.log(request, 'TCP.handle')
  if not request.id or not request.type or not request.payload then
    env.err('TCP handle->Received a unvalid request')
    return
  end
  if request.type == 'function' then
    TCP.handleFunction(request)
  end
  -- if request.type == 'loadstring' or request.type == 'dostring_in' then
  --   TCP.handleDebug(request)
  -- end
  if request.type == 'debug' then
    TCP.handleDebug(request)
  end
end
