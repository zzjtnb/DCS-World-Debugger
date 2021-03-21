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
  -- if err then
  --   net.log("sendData -> " .. err)
  -- end
  end
end

-------------------------------------------  执行接收到的Lua脚本 -------------------------------------------
Debugger.lua_str = function(luatb)
  local res = {}
  res.type = luatb.state
  if luatb.state == "loadstring" then
    local status, retval =
      pcall(
      function()
        local fun = loadstring(luatb.lua_string)
        return fun()
      end
    )
    res.status = status
    res.data = retval
  else
    res.type = "dostring_in"
    local result, fettle = net.dostring_in(luatb.state, luatb.lua_string)
    if #result > 0 then
      local status, retval =
        pcall(
        function()
          return net.json2lua(result)
        end
      )
      if status then
        res.data = retval
      else
        res.data = result
      end
      res.status = status
    else
      res.status = fettle
      res.data = "执行成功"
    end
  end
  return res
end
