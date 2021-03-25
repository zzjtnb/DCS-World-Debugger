UDP_Debugger = UDP_Debugger or {}
--------------------------------    定义Debugger的callbacks  --------------------------------
UDP_Debugger.callbacks = {}
function UDP_Debugger.callbacks.onSimulationFrame()
  UDP.receive = UDP.udp:receive()
  if UDP.receive and UDP.receive ~= "timeout" then
    local success, request =
      pcall(
      function()
        return net.json2lua(UDP.receive)
      end
    )
    if success then -- is json string
      local result = Debugger.lua_str(request)
      Debugger.net.send_udp_msg({type = "debuggerLua", data = result})
    else -- normal string
      Debugger.net.send_udp_msg({type = "debuggerLua", data = {msg = "调试lua失败:" .. UDP.receive}})
    end
  end
end
DCS.setUserCallbacks(UDP_Debugger.callbacks)
