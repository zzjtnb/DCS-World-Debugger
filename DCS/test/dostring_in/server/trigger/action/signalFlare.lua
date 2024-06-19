-- 获取群组名称为Mi-8-1的群组
local groupName = "Mi-8-1"
local group = Group.getByName(groupName)

if group then
    -- 获取群组中的所有单位
    local units = group:getUnits()

    if #units > 0 then
        -- 获取第一个单位
        local unit = units[1]

        -- 定义一个函数来发射信号弹
        local function fireSignalFlare()
            if unit and unit:isExist() then
                -- 获取该单位的位置
                local unitPosition = unit:getPosition().p
                -- 发射信号弹
                -- 参数说明：unitPosition, 颜色(0-绿, 1-红, 2-白, 3-黄), 方位角（0-360度）
                trigger.action.signalFlare(unitPosition, 1, 0) -- 红色信号弹，方位角为0（向北）

                -- 调度该函数在10秒后再次执行
                timer.scheduleFunction(fireSignalFlare, {}, timer.getTime() + 10)
            else
                env.info("单位已不存在。")
            end
        end

        -- 立即发射一次信号弹并启动循环
        fireSignalFlare()
    else
        env.info("群组 " .. groupName .. " 中没有找到单位。")
    end
else
    env.info("没有找到群组 " .. groupName .. "。")
end
