-- net_dostring(server)
local JSON = require("JSON")
local res_paste = {}
for coa_name, coa_data in pairs(env.mission.coalition) do -- parse coalition table, then generate new table
  if (coa_name == "red" or coa_name == "blue") and type(coa_data) == "table" then
    if coa_data.country then --there is a country table
      for cntry_id, cntry_data in pairs(coa_data.country) do
        local countryName = string.lower(cntry_data.name)
        if type(cntry_data) == "table" then --just making sure
          for obj_type_name, obj_type_data in pairs(cntry_data) do
            if obj_type_name == "helicopter" or obj_type_name == "ship" or obj_type_name == "plane" or obj_type_name == "vehicle" or obj_type_name == "static" then --should be an unncessary check
              local category = obj_type_name
              if ((type(obj_type_data) == "table") and obj_type_data.group and (type(obj_type_data.group) == "table") and (#obj_type_data.group > 0)) then --there's a group!
                for group_num, group_data in pairs(obj_type_data.group) do
                  if group_data and group_data.units and type(group_data.units) == "table" then --making sure again- this is a valid group
                    local groupName = env.getValueDictByKey(group_data.name) -- -> group_name
                    for unit_num, unit_data in pairs(group_data.units) do
                      if unit_data.skill == "Client" then -- is a playable unit, add to res_paste
                        local unit_name_idx = env.getValueDictByKey(unit_data.name)
                        res_paste[unit_name_idx] = {
                          ["unit_name"] = env.getValueDictByKey(unit_data.name), -- -> unit_name
                          ["group_name"] = groupName,
                          ["group_id"] = group_data.groupId,
                          ["unit_id"] = unit_data.unitId,
                          ["type"] = unit_data.type, -- -> type
                          ["x"] = unit_data.x,
                          ["y"] = unit_data.y,
                          ["heading"] = unit_data.heading,
                          ["country"] = countryName,
                          ["country_id"] = cntry_id,
                          ["category"] = category,
                          ["onboard_num"] = unit_data.onboard_num,
                          ["livery_id"] = unit_data.livery_id,
                          ["start_type"] = group_data.route.points[1].type, -- -> TakeOffGround
                          ["airdromeId"] = group_data.route.points[1].airdromeId,
                          ["parking_id"] = unit_data.parking_id, --> string
                          ["parking"] = unit_data.parking --> number
                        }
                      end
                    end --for unit_num, unit_data in pairs(group_data.units) do
                  end --if group_data and group_data.units then
                end --for group_num, group_data in pairs(obj_type_data.group) do
              end --if ((type(obj_type_data) == 'table') and obj_type_data.group and (type(obj_type_data.group) == 'table') and (#obj_type_data.group > 0)) then
            end --if obj_type_name == "helicopter" or obj_type_name == "ship" or obj_type_name == "plane" or obj_type_name == "vehicle" or obj_type_name == "static" then
          end --for obj_type_name, obj_type_data in pairs(cntry_data) do
        end --if type(cntry_data) == 'table' then
      end --for cntry_id, cntry_data in pairs(coa_data.country) do
    end --if coa_data.country then --there is a country table
  end --if coa_name == 'red' or coa_name == 'blue' and type(coa_data) == 'table' then
end --for coa_name, coa_data in pairs(mission.coalition) do

return JSON:encode(res_paste)
