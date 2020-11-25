Debugger = Debugger or {}
Debugger.JSON = require("JSON") --decode转json       encode转字符串
Debugger.net = {}
--------------------------------    定义Debugger的方法  --------------------------------
Debugger.jsonDecode = function(data)
  local isJSON, data =
    pcall(
    function()
      return Debugger.JSON:decode(data)
    end
  )
  return isJSON, data
end
Debugger.jsonEncode = function(data)
  local isJSON, data =
    pcall(
    function()
      return Debugger.JSON:encode(data)
    end
  )
  return isJSON, data
end
Debugger.isEmptytb = function(tbl)
  if next(tbl) ~= nil then
    return true
  else
    return false
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
Debugger.net.sendMsg = function(msg)
  msg.timeS = Debugger.net.getTimeStamp()
  Debugger.net.sendJSON(msg)
end
-------------------------------------------  执行接收到的Lua脚本 -------------------------------------------
Debugger.debuggerLua = function(str)
  local res = {}
  local luatb = net.json2lua(str)
  if luatb.state == "loadstring" then
    res.type = "loadstring"
    local status, retval =
      pcall(
      function()
        local fun = loadstring(luatb.lua_string)
        return fun()
      end
    )
    res.status = status
    res.data = retval
    Debugger.net.sendMsg(res)
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
    Debugger.net.sendMsg(res)
  end
end
