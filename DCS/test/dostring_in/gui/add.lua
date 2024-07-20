-- 获取触发区信息
local triggerZone = trigger.misc.getZone('Red_Spawn_Base')
if triggerZone then
    local zonePosition = triggerZone.point
    -- 定义船只组信息
    local shipGroup = {
        ["visible"] = false,
        ["groupId"] = 1,
        ["hidden"] = false,
        ["units"] = {
            [1] = {
                ["type"] = "CV_1143_5",  -- 船只类型，可以根据需要更改
                ["transportable"] = {
                    ["randomTransportable"] = false,
                },
                ["skill"] = "Average",
                ["y"] = zonePosition.z,
                ["x"] = zonePosition.x,
                ["name"] = "MyShip",  -- 船只名称
                ["heading"] = 0,
                ["playerCanDrive"] = false,
            },
        },
        ["y"] = zonePosition.z,
        ["x"] = zonePosition.x,
        ["name"] = "MyShipGroup",  -- 船只组名称
        ["start_time"] = 0,
        ["task"] = "Ground Nothing",
    }

    -- 创建船只组
    coalition.addGroup(country.id.RUSSIA, Group.Category.SHIP, shipGroup)
    trigger.action.outText("Ship created at trigger zone!", 10)
else
    trigger.action.outText("Trigger zone not found!", 10)
end
