Tools = Tools or {}
Tools.net = Tools.net or {}

--------------------------------    定义Tools的方法  --------------------------------
Tools.jsonDecode = function(data)
  local success, result =
    pcall(
    function()
      return net.json2lua(data)
    end
  )
  return success, result
end
Tools.jsonEncode = function(data)
  local success, result =
    pcall(
    function()
      return net.lua2json(data)
    end
  )
  return success, result
end
-- Make next function local - this improves performance
-- 将next函数设为本地-这样可以提高性能
local next = next
Tools.isEmptytb = function(tbl)
  if next(tbl) ~= nil then
    return false
  else
    return true
  end
end
Tools.MergeTables = function(...)
  local tabs = {...}
  if not tabs then
    return {}
  end
  local origin = tabs[1]
  for i = 2, #tabs do
    if origin then
      if tabs[i] then
        for k, v in pairs(tabs[i]) do
          origin[k] = v
        end
      end
    else
      origin = tabs[i]
    end
  end
  return origin
end

Tools.dostring_api_env = function(s)
  local f, err = loadstring(s)
  if f then
    return true, f()
  else
    return false, err
  end
end

-------------------------------------------  定义Tools的net  -------------------------------------------
Tools.net.sendData = function(data)
  if TCP.client == nil then
    TCP.client_connect()
  end
  local ip, port = TCP.client:getsockname()
  net.log("SendDataTo-->" .. ip .. ":" .. port)
  net.log("SendJSON-->" .. data)
  TCP.client_send(data)
end
Tools.net.sendJSON = function(data)
  Tools.net.sendData(net.lua2json(data))
end
Tools.net.getTimeStamp = function()
  local _TempData = {
    os = os.date("%Y-%m-%d %H:%M:%S"),
    real = DCS.getRealTime(),
    model = DCS.getModelTime()
  }
  return _TempData
end
Tools.net.client_send_msg = function(msg)
  msg.executionTime = msg.executionTime or {}
  msg.executionTime = Tools.MergeTables(msg.executionTime, Tools.net.getTimeStamp())
  Tools.net.sendJSON(msg)
end

Tools.net.server_send_msg = function(data)
  data.executionTime = Tools.net.getTimeStamp()
  data = net.lua2json(data)
  net.log("process_request --> " .. data)
  if TCP.server_client then
    local bytes, status, lastbyte = TCP.server_client:send(data .. "\r\n")
  -- net.log(bytes, status, lastbyte)
  end
end

-------------------------------------------  执行接收到的Lua脚本 -------------------------------------------
Tools.lua_str = function(request)
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
      msg.status = fettle
      msg.data = "执行成功"
    end
  elseif request.type == "api_loadstring" then
    local status, retval = Tools.dostring_api_env(request.content)
    msg.status = status
    msg.data = retval
    if status and retval == nil then
      msg.data = "执行成功"
    end
  end
  if request.from then
    msg.from = request.from
  end
  return msg
end
