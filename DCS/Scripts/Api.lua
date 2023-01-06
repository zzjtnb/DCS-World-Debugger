-- available APIs:
--[[
DCS.setPause(bool)
DCS.getPause() -> bool
--DCS.startMission(string filename) -- NOT IMPLEMENTED YET
DCS.stopMission()
DCS.exitProcess()

DCS.isMultiplayer() -> bool
DCS.isServer() -> bool
DCS.isTrackPlaying() -> bool
DCS.takeTrackControl()

DCS.getModelTime() -> number
DCS.getRealTime() -> number


DCS.setMouseCapture(bool)
DCS.setKeyboardCapture(bool)

DCS.getManualPath() -> string

DCS.getMissionOptions() -> table
DCS.getMissionDescription() -> string
DCS.getPlayerCoalition() -> string
DCS.getPlayerUnitType() -> string
DCS.getPlayerBriefing() -> table { text = string, images = { array of strings } }

DCS.spawnPlayer()

DCS.hasMultipleSlots() -> boolean
DCS.getAvailableCoalitions() -> table {
 [coalition_id] = { name = "coalition name", hasPassword = <bool> }
 ...
}
DCS.getAvailableSlots() -> array of {unitId, type, role, callsign, groupName, country}


--FIXME: these are temporary, for single-player only
DCS.getPlayerUnit() -> string

DCS.setPlayerCoalition(coalition_id)
DCS.setPlayerUnit(misId) -> sets the unit and spawns the player

]] -- functions called by the sim
--[[
onMissionLoadBegin()
onMissionLoadProgress(progress_0_1, message)
onMissionLoadEnd()

onTriggerMessage(message, duration)
onRadioMessage(message, duration)
onRadioCommand(command_message)

onSimulationStart()
onSimulationFrame()
onSimulationStop()
onSimulationPause()
onSimulationResume()

onShowMainInterface()
onShowIntermission()
onShowGameMenu()
onShowBriefing()
onShowChatAll()
onShowChatTeam()
onShowScores()
onShowResources()
onShowGameInfo(a_text, a_duration)
onShowMessage(text, type)
onShowChatPanel()
onHideChatPanel()
onGameEvent(eventName, args...)
onPlayerDisconnect(id)
onPlayerStart(id)
onPlayerConnect(id, name)
onNetMissionChanged(mizName)
onServerRegistrationFail(code)

onShowRadioMenu(size) --вызывается при изменении размеров радио меню
]] 
