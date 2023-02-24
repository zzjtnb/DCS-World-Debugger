-- module name. All function in this file, if used outside, should be called "statistics.functionname"
module('Statistics', package.seeall)
base = _G
require = base.require
lfs = require('lfs')
io = require('io')
os = require('os')
local i18n = require('i18n')
i18n.setup(_M)
-- Returns the path of the DCS install folder
install_dir = lfs.currentdir()
-- Returns the path of the current 'Saved Games\DCS' folder.
saved_dir = lfs.writedir()
function send_data(data)
  local info = {
    id = '',
    type = 'serverStatus',
    payload = {
      result = data,
      time = ZZJT.getTimeStamp(),
    },
    sent = os.time(),
  }
  TCP.send_data(info)
end
