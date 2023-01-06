-- module name. All function in this file, if used outside, should be called "statistics.functionname"
module('Statistics', package.seeall)

base = _G
require = base.require
io = require('io')
lfs = require('lfs')
os = require('os')
minizip = require('minizip')
net = require('net')
DCS = require('DCS')

-- Returns the path of the DCS install folder
install_dir = lfs.currentdir()
-- Returns the path of the current 'Saved Games\DCS' folder.
saved_dir = lfs.writedir()
statistics_dir = lfs.writedir() .. 'Scripts/statistics/'

DCS_Multy = DCS.isMultiplayer()
DCS_Server = DCS.isServer()

-- 游戏状态栏的秒数,相对于游戏开始时间
-- 比如游戏开始时间是2031-1-1 9:10  状态栏时间是2031-1-1 9:16
-- DCS.getModelTime() 返回360(s)
ModelTime = DCS.getModelTime()

RealTime = DCS.getRealTime()

-- 初始化游戏数据
clients = {}
MissionData = {}

function send_data(data)
  local info = {
    id = '',
    type = 'serverStatus',
    payload = {
      result = data,
      time = Tools.getTimeStamp()
    },
    sent = os.time()
  }
  TCP.send_data(info)
end
---任务信息更新的主要功能
function UpdateMission()
  local mission = DCS.getCurrentMission()['mission']
  -- 日期转时间戳
  local date = os.time {
    year = mission['date'].Year,
    month = mission['date'].Month,
    day = mission['date'].Day
  }
  MissionData.date = os.date('%Y-%m-%d', date) .. Tools.getTimeString(mission['start_time'])
  MissionData.APP_VERSION = base._APP_VERSION
  MissionData.ED_FINAL_VERSION = base.ED_FINAL_VERSION
  MissionData.DCS_VERSION = base.__DCS_VERSION__
  MissionData.name = DCS.getMissionName() -- 返回当前任务的名称
  MissionData.theatre = mission['theatre']

  -- MissionData.map = mission['map']
  -- MissionData.result_red = DCS.getMissionResult('red')
  -- MissionData.result_blue = DCS.getMissionResult('blue')
  -- MissionData.filename = DCS.getMissionFilename() -- 返回当前任务的文件名
  -- MissionData.description = DCS.getMissionDescription() -- 任务描述

  send_data(MissionData)
  -- send_data(DCS.getCurrentMission())
  --[[
      --返回阵营可用插槽列表。
      DCS.getAvailableCoalitions()
      --获取指定阵营的可用插槽(注意:返回的unitID实际上是一个slotID,对于多座单位它是
      DCS.getAvailableSlots(coalitionID) 'unitID_seatID')
      --获取单位属性
      DCS.getUnitProperty(missionId, propertyId)
      --从配置状态读取一个值。
      DCS.getConfigValue(cfg_path_string)
      -> {{abstime,级别,子系统,消息},...},last_index 返回从给定索引开始的最新日志消息。
      DCS.getLogHistory(from)
      Usage:
      local result = {}
      local id_from = 0
      local logHistory = {}
      local logIndex = 0
      logHistory, logIndex = DCS.getLogHistory(id_from)
      result = {
        logHistory = logHistory,
        new_last_id = logIndex
      }
      return result
     --log.write('WebGUI', log.DEBUG, string.format('%s returned %s!', requestString, net.lua2json(result)))
  --]]
end

function getPlayerMaster(a_unitId)
  return MultySeatLAbyId[a_unitId]
end
