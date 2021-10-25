Mission = Mission or {}
Mission.eventHandler = {}

function Mission.eventHandler.onEvent(handler, event)
  local status, error =
    pcall(
    function(event)
      Tools.net.udp_send_msg({id = '', type = 'event', date = os.date('%Y-%m-%d %H:%M:%S'), payload = event})
    end,
    event
  )
  if (not status) then
    Tools.env.err(string.format('Mission Event处理出错:%s', error))
  end
end

world.addEventHandler(Mission.eventHandler)
