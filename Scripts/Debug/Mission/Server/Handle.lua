-- TCP HANDLEFUNCTION --

function TCP.handleFunction(request)
  local result = TCP.functions[request.payload.functionName](request.payload.args)
  if type(result) ~= 'table' then
    result = {}
  end
  local response = {
    id = request.id,
    type = 'received',
    date = os.date('%Y-%m-%d %H:%M:%S'),
    payload = result
  }
  -- TCP.udpSend(response)
  Tools.net.tcp_send_msg(response)
end

function TCP.handleDebug(request)
  local result, status = nil, nil
  if request.type == 'api_loadstring' then
    result, status = Tools.dostring_api_env(request.payload.content)
  end
  if request.type == 'net_dostring' then
    if request.payload.env == 'mission' then
      request.payload.content = [[a_do_script("]] .. request.payload.content .. [[")]]
    end
    result, status = net.dostring_in(request.payload.env, request.payload.content) -- res is a string

  -- 'server': holds the current mission when multiplayer? server only
  -- 'config': the state in which $INSTALL_DIR/Config/main.cfg is executed, as well as $WRITE_DIR/Config/autoexec.cfg
  --           used for configuration settings
  -- 'mission': holds current mission
  -- 'export': runs $WRITE_DIR/Scripts/Export.lua and the relevant export API
  end

  local response = {
    id = request.id,
    type = request.type,
    payload = {
      status = status,
      result = result
    }
  }
  if not status then
    response.payload.luacode = request.payload.content
  end
  Tools.net.tcp_send_msg(response)
  -- TCP.udpSend(response)
end

function TCP.handle(request)
  if not request.id or not request.type or not request.payload then
    Tools.env.err('Received a unvalid request' .. request)
    return
  end
  if request.type == 'function' then
    TCP.handleFunction(request)
  end
  if request.type == 'api_loadstring' or request.type == 'net_dostring' then
    TCP.handleDebug(request)
  end
end
