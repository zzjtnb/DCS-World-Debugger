-- map slot and id and things
NetSlotInfo = {} -- reset NetSlotInfo
-- local coals = DCS.getAvailableCoalitions() --> table { [coalition_id] = { name = "coalition name", } ... }
local slots = DCS.getAvailableSlots("blue")
net.log(net.lua2json(slots))
for slot_id, slot_info in ipairs(slots) do
  NetSlotInfo[slot_id] = {
    ["action"] = slot_info.action,
    ["countryName"] = slot_info.countryName,
    ["groupName"] = slot_info.groupName,
    ["groupSize"] = slot_info.groupSize,
    ["onboard_num"] = slot_info.onboard_num,
    ["role"] = slot_info.role,
    ["type"] = slot_info.type,
    ["task"] = slot_info.task,
    ["unitId"] = slot_info.unitId
  }
end
