Debugger = Debugger or {}
Debugger.net = {}
--------------------------------    定义Debugger的方法  --------------------------------
Debugger.jsonDecode = function(data)
  local success, result =
    pcall(
    function()
      return JSON:decode(data)
    end
  )
  return success, result
end
Debugger.jsonEncode = function(data)
  local success, result =
    pcall(
    function()
      return JSON:encode(data)
    end
  )
  return success, result
end
Debugger.isEmptytb = function(tbl)
  if next(tbl) ~= nil then
    return false
  else
    return true
  end
end
-------------------------------------------  定义Debugger的net  -------------------------------------------
Debugger.net.sendData = function(data)
  net.log("sendDataTo --> " .. UDP.host .. ":" .. UDP.port)
  net.log("sendJSON --> " .. data)
  local succ, err = UDP.udp:sendto(data, UDP.host, UDP.port)
  if err then
    net.log("sendData -> " .. err)
  end
end
Debugger.net.sendJSON = function(data)
  Debugger.net.sendData(net.lua2json(data))
end
Debugger.net.getTimeStamp = function()
  return {
    os = os.date("%Y-%m-%d %X", os.time()),
    real = DCS.getRealTime(),
    model = DCS.getModelTime()
  }
end
Debugger.net.send_udp_msg = function(msg)
  msg.timeS = Debugger.net.getTimeStamp()
  Debugger.net.sendJSON(msg)
end

Debugger.net.send_tcp_msg = function(data)
  data.timeS = Debugger.net.getTimeStamp()
  data = net.lua2json(data)
  net.log("process_request --> " .. data)
  if TCP.client then
    local bytes, status, lastbyte = TCP.client:send(data .. "\n")
    net.log(bytes, status, lastbyte)
  end
end

-------------------------------------------  执行接收到的Lua脚本 -------------------------------------------
Debugger.lua_str = function(request)
  local msg = {}
  msg.type = request.type
  if request.type == "net_dostring" then
    local res, fettle = net.dostring_in(request.env, request.content) -- res is a string
    -- 'server': holds the current mission when multiplayer? server only
    -- 'config': the state in which $INSTALL_DIR/Config/main.cfg is executed, as well as $WRITE_DIR/Config/autoexec.cfg
    --           used for configuration settings
    -- 'mission': holds current mission
    -- 'export': runs $WRITE_DIR/Scripts/Export.lua and the relevant export API
    if #res > 0 then
      local success, result =
        pcall(
        function()
          return net.json2lua(res)
        end
      )
      msg.status = success
      if success then -- is json string
        msg.data = result
      else -- normal string
        msg.data = res
      end
    else
      net.log(res)
      net.log(fettle)
      msg.status = fettle
      msg.data = "执行成功"
    end
  elseif request.type == "api_loadstring" then
    local status, retval = dostring_api_env(request.content)
    msg.status = status
    msg.data = retval
    if status and retval == nil then
      msg.data = "执行成功"
    end
  end
  return msg
end
function dostring_api_env(s)
  local f, err = loadstring(s)
  if f then
    return true, f()
  else
    return false, err
  end
end
