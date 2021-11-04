local base = world.getAirbases()
local myBaseTbl = {}
local info = {}
for i = 1, #base do
  if base[i]['id_'] == 5000002 then
    info.desc = Airbase.getDesc(base[i])
    info.callsign = Airbase.getCallsign(base[i])
    info.id = Airbase.getID(base[i])
    info.cat = Airbase.getCategory(base[i])
    info.point = Airbase.getPoint(base[i])
    info.park = Airbase.getParking(base[i], 104)
    if Airbase.getUnit(base[i]) then
      info.unitId = Airbase.getUnit(base[i]):getID()
    end
    myBaseTbl[base[i]['id_']] = info
  end
end
local plane = {
  ['modulation'] = 0,
  ['tasks'] = {}, -- end of ["tasks"]
  ['radioSet'] = false,
  ['task'] = 'Runway Attack',
  ['uncontrolled'] = false,
  ['taskSelected'] = true,
  ['route'] = {
    ['points'] = {
      [1] = {
        ['alt'] = 43,
        ['action'] = 'From Parking Area',
        ['alt_type'] = 'BARO',
        ['speed'] = 138.88888888889,
        ['task'] = {
          ['id'] = 'ComboTask',
          ['params'] = {
            ['tasks'] = {
              [1] = {
                ['number'] = 1,
                ['auto'] = true,
                ['id'] = 'WrappedAction',
                ['enabled'] = true,
                ['params'] = {
                  ['action'] = {
                    ['id'] = 'Option',
                    ['params'] = {
                      ['value'] = 1,
                      ['name'] = 1
                    } -- end of ["params"]
                  } -- end of ["action"]
                } -- end of ["params"]
              }, -- end of [1]
              [2] = {
                ['number'] = 2,
                ['auto'] = true,
                ['id'] = 'WrappedAction',
                ['enabled'] = true,
                ['params'] = {
                  ['action'] = {
                    ['id'] = 'Option',
                    ['params'] = {
                      ['value'] = 1,
                      ['name'] = 3
                    } -- end of ["params"]
                  } -- end of ["action"]
                } -- end of ["params"]
              }, -- end of [2]
              [3] = {
                ['number'] = 3,
                ['auto'] = true,
                ['id'] = 'WrappedAction',
                ['enabled'] = true,
                ['params'] = {
                  ['action'] = {
                    ['id'] = 'Option',
                    ['params'] = {
                      ['variantIndex'] = 2,
                      ['name'] = 5,
                      ['formationIndex'] = 2,
                      ['value'] = 131074
                    } -- end of ["params"]
                  } -- end of ["action"]
                } -- end of ["params"]
              }, -- end of [3]
              [4] = {
                ['number'] = 4,
                ['auto'] = true,
                ['id'] = 'WrappedAction',
                ['enabled'] = true,
                ['params'] = {
                  ['action'] = {
                    ['id'] = 'Option',
                    ['params'] = {
                      ['value'] = true,
                      ['name'] = 15
                    } -- end of ["params"]
                  } -- end of ["action"]
                } -- end of ["params"]
              }, -- end of [4]
              [5] = {
                ['number'] = 5,
                ['auto'] = true,
                ['id'] = 'WrappedAction',
                ['enabled'] = true,
                ['params'] = {
                  ['action'] = {
                    ['id'] = 'Option',
                    ['params'] = {
                      ['targetTypes'] = {}, -- end of ["targetTypes"]
                      ['name'] = 21,
                      ['value'] = 'none;',
                      ['noTargetTypes'] = {
                        [1] = 'Fighters',
                        [2] = 'Multirole fighters',
                        [3] = 'Bombers',
                        [4] = 'Helicopters',
                        [5] = 'Infantry',
                        [6] = 'Fortifications',
                        [7] = 'Tanks',
                        [8] = 'IFV',
                        [9] = 'APC',
                        [10] = 'Artillery',
                        [11] = 'Unarmed vehicles',
                        [12] = 'AAA',
                        [13] = 'SR SAM',
                        [14] = 'MR SAM',
                        [15] = 'LR SAM',
                        [16] = 'Aircraft Carriers',
                        [17] = 'Cruisers',
                        [18] = 'Destroyers',
                        [19] = 'Frigates',
                        [20] = 'Corvettes',
                        [21] = 'Light armed ships',
                        [22] = 'Unarmed ships',
                        [23] = 'Submarines',
                        [24] = 'Cruise missiles',
                        [25] = 'Antiship Missiles',
                        [26] = 'AA Missiles',
                        [27] = 'AG Missiles',
                        [28] = 'SA Missiles'
                      } -- end of ["noTargetTypes"]
                    } -- end of ["params"]
                  } -- end of ["action"]
                } -- end of ["params"]
              }, -- end of [5]
              [6] = {
                ['number'] = 6,
                ['auto'] = true,
                ['id'] = 'WrappedAction',
                ['enabled'] = true,
                ['params'] = {
                  ['action'] = {
                    ['id'] = 'EPLRS',
                    ['params'] = {
                      ['value'] = true,
                      ['groupId'] = 1
                    } -- end of ["params"]
                  } -- end of ["action"]
                } -- end of ["params"]
              } -- end of [6]
            } -- end of ["tasks"]
          } -- end of ["params"]
        }, -- end of ["task"]
        ['type'] = 'TakeOffParking',
        ['ETA'] = 0,
        ['ETA_locked'] = true,
        ['y'] = 243154.56565978,
        ['x'] = -4830.7929460868,
        ['formation_template'] = '',
        ['airdromeId'] = 12,
        ['speed_locked'] = true
      }, -- end of [1]
      [2] = {
        ['alt'] = 3000,
        ['action'] = 'Turning Point',
        ['alt_type'] = 'BARO',
        ['speed'] = 61.944444444444,
        ['task'] = {
          ['id'] = 'ComboTask',
          ['params'] = {
            ['tasks'] = {
              [1] = {
                ['enabled'] = true,
                ['auto'] = false,
                ['id'] = 'BombingRunway',
                ['number'] = 1,
                ['params'] = {
                  ['runwayId'] = 14,
                  ['attackQtyLimit'] = false,
                  ['attackQty'] = 1,
                  ['expend'] = 'Auto',
                  ['altitude'] = 5000,
                  ['directionEnabled'] = false,
                  ['groupAttack'] = false,
                  ['direction'] = 0,
                  ['weaponType'] = 1073741822,
                  ['altitudeEnabled'] = false
                } -- end of ["params"]
              } -- end of [1]
            } -- end of ["tasks"]
          } -- end of ["params"]
        }, -- end of ["task"]
        ['type'] = 'Turning Point',
        ['ETA'] = 830.75307234427,
        ['ETA_locked'] = false,
        ['y'] = 276194.93656883,
        ['x'] = -44283.559817082,
        ['formation_template'] = '',
        ['speed_locked'] = true
      }, -- end of [2]
      [3] = {
        ['alt'] = 3000,
        ['action'] = 'Turning Point',
        ['alt_type'] = 'BARO',
        ['speed'] = 61.944444444444,
        ['task'] = {
          ['id'] = 'ComboTask',
          ['params'] = {
            ['tasks'] = {
              [1] = {
                ['enabled'] = true,
                ['auto'] = false,
                ['id'] = 'WrappedAction',
                ['number'] = 1,
                ['params'] = {
                  ['action'] = {
                    ['id'] = 'SwitchWaypoint',
                    ['params'] = {
                      ['goToWaypointIndex'] = 2,
                      ['fromWaypointIndex'] = 3
                    } -- end of ["params"]
                  } -- end of ["action"]
                } -- end of ["params"]
              }, -- end of [1]
              [2] = {
                ['enabled'] = true,
                ['auto'] = false,
                ['id'] = 'WrappedAction',
                ['number'] = 2,
                ['params'] = {
                  ['action'] = {
                    ['id'] = 'Option',
                    ['params'] = {
                      ['variantIndex'] = 3,
                      ['name'] = 5,
                      ['formationIndex'] = 6,
                      ['value'] = 393219
                    } -- end of ["params"]
                  } -- end of ["action"]
                } -- end of ["params"]
              } -- end of [2]
            } -- end of ["tasks"]
          } -- end of ["params"]
        }, -- end of ["task"]
        ['type'] = 'Turning Point',
        ['ETA'] = 881.4992360075,
        ['ETA_locked'] = false,
        ['y'] = 274084.12424361,
        ['x'] = -46612.874027881,
        ['formation_template'] = '',
        ['speed_locked'] = true
      } -- end of [3]
    } -- end of ["points"]
  }, -- end of ["route"]
  -- ['groupId'] = 4,
  ['hidden'] = false,
  ['units'] = {
    [1] = {
      ['alt'] = 43,
      ['hardpoint_racks'] = true,
      ['alt_type'] = 'BARO',
      ['livery_id'] = 'PLANAF Standard',
      ['skill'] = 'High',
      ['parking'] = '31',
      ['speed'] = 138.88888888889,
      ['AddPropAircraft'] = {
        ['Belly Bay Door'] = false
      }, -- end of ["AddPropAircraft"]
      ['type'] = 'H-6J',
      -- ['unitId'] = 13,
      ['psi'] = -2.4444200797074,
      ['parking_id'] = '29',
      ['x'] = -4830.7929460868,
      -- ['name'] = 'FPD-MER',
      ['payload'] = {
        ['pylons'] = {
          [7] = {
            ['CLSID'] = 'DIS_AKG_DLPOD'
          }, -- end of [7]
          [8] = {
            ['CLSID'] = 'DIS_H6_250_2_N24'
          } -- end of [8]
        }, -- end of ["pylons"]
        ['fuel'] = 25000,
        ['flare'] = 120,
        ['chaff'] = 120,
        ['gun'] = 100
      }, -- end of ["payload"]
      ['y'] = 243154.56565978,
      ['heading'] = 2.4444200797074,
      ['callsign'] = 104,
      ['onboard_num'] = '014'
    }, -- end of [1]
    [2] = {
      ['alt'] = 43,
      ['alt_type'] = 'BARO',
      ['livery_id'] = 'PLANAF Standard',
      ['skill'] = 'High',
      ['parking'] = '32',
      ['speed'] = 138.88888888889,
      ['AddPropAircraft'] = {
        ['Belly Bay Door'] = false
      }, -- end of ["AddPropAircraft"]
      ['type'] = 'H-6J',
      -- ['unitId'] = 75,
      ['psi'] = -2.4444200797074,
      ['parking_id'] = '30',
      ['x'] = -4785.9355242118,
      -- ['name'] = 'FPD-MER-1',
      ['payload'] = {
        ['pylons'] = {
          [7] = {
            ['CLSID'] = 'DIS_AKG_DLPOD'
          }, -- end of [7]
          [8] = {
            ['CLSID'] = 'DIS_H6_250_2_N24'
          } -- end of [8]
        }, -- end of ["pylons"]
        ['fuel'] = 25000,
        ['flare'] = 120,
        ['chaff'] = 120,
        ['gun'] = 100
      }, -- end of ["payload"]
      ['y'] = 243194.33128478,
      ['heading'] = 2.4444200797074,
      ['callsign'] = 105,
      ['onboard_num'] = '015'
    }, -- end of [2]
    [3] = {
      ['alt'] = 43,
      ['alt_type'] = 'BARO',
      ['livery_id'] = 'PLANAF Standard',
      ['skill'] = 'High',
      ['parking'] = '34',
      ['speed'] = 138.88888888889,
      ['AddPropAircraft'] = {
        ['Belly Bay Door'] = false
      }, -- end of ["AddPropAircraft"]
      ['type'] = 'H-6J',
      -- ['unitId'] = 76,
      ['psi'] = -2.4444200797074,
      ['parking_id'] = '28',
      ['x'] = -4875.5019304618,
      -- ['name'] = 'FPD-MER-2',
      ['payload'] = {
        ['pylons'] = {
          [7] = {
            ['CLSID'] = 'DIS_AKG_DLPOD'
          }, -- end of [7]
          [8] = {
            ['CLSID'] = 'DIS_H6_250_2_N24'
          } -- end of [8]
        }, -- end of ["pylons"]
        ['fuel'] = 25000,
        ['flare'] = 120,
        ['chaff'] = 120,
        ['gun'] = 100
      }, -- end of ["payload"]
      ['y'] = 243114.48753478,
      ['heading'] = 2.4444200797074,
      ['callsign'] = 106,
      ['onboard_num'] = '016'
    } -- end of [3]
  }, -- end of ["units"]
  ['y'] = 243154.56565978,
  ['x'] = -4830.7929460868,
  ['name'] = 'FPD-MER1',
  ['communication'] = true,
  ['start_time'] = 0,
  ['frequency'] = 251
} -- end of ["plane"]
local function addGroup(countryId, groupCategory, groupName)
  -- for i, data in pairs(info.park) do
  --   local point = data.vTerminalPos
  --   plane.name = plane.name .. tostring(i)
  -- end
  coalition.addGroup(countryId, groupCategory, plane)
end

addGroup(country.id.CHINA, Group.Category.AIRPLANE, 'p-test')
return info.park
