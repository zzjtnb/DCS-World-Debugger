const { server_info_model, user_info_model } = require('../../models');
const { json2string } = require('../../utils/jon2str');
class eventController {
  async UpdatePlayersData(msg) {
    const data = msg.data.data
    const ucidArr = Object.keys(data)
    const model = await user_info_model.findAll({ raw: true, where: { ucid: ucidArr }, attributes: { exclude: ['id'] } })
    let result = []
    for (const key in data) {
      const item2 = data[key];
      const findIndex = model.findIndex(item => {
        if (item.ucid === item2.ucid) {
          item.name = item2.name
          item.lang = item2.lang
          item.ping = item2.ping
          item.ipaddr = item2.ipaddr
          item.subslot = item2.subslot
          item.subtype = item2.subtype
          item.masterslot = item2.masterslot
          item.ship_takeoffs += item2.ship_takeoffs || null
          item.airfield_takeoffs += item2.airfield_takeoffs || null
          item.farp_takeoffs += item2.farp_takeoffs || null
          item.other_takeoffs += item2.other_takeoffs || null
          item.teamkills += item2.teamkills || null
          item.kills_infantry += item2.kills_infantry || null
          item.kills_fortification += item2.kills_fortification || null
          item.kills_armor += item2.kills_armor || null
          item.kills_air_defense += item2.kills_air_defense || null
          item.kills_artillery += item2.kills_artillery || null
          item.kills_ships += item2.kills_ships || null
          item.kills_planes += item2.kills_planes || null
          item.kills_helicopters += item2.kills_helicopters || null
          item.kills_unarmed += item2.kills_unarmed || null
          item.kills_other += item2.kills_other || null
          item.deaths += item2.deaths || null
          item.ejections += item2.ejections || null
          item.crashes += item2.crashes || null
          item.airfield_landings += item2.airfield_landings || null
          item.ship_landings += item2.ship_landings || null
          item.farp_landings += item2.farp_landings || null
          item.other_landings += item2.other_landings || null
          item.pvp = item2.pvp
          item.missionhash = msg.data.missionhash
          item.createdAt = item2.loginTime
          item.updatedAt = item2.loginTime
          return true
        }
      })
      findIndex < 0 ? result.push(item2) : result.push(model[findIndex])
    }
    user_info_model.bulkCreate(result,
      {
        updateOnDuplicate: ['name', 'ucid', 'lang', 'ping', 'ipaddr', 'ship_takeoffs', 'airfield_takeoffs', 'farp_takeoffs', 'other_takeoffs', 'subslot', 'subtype', 'masterslot', 'teamkills', 'kills_infantry', 'kills_fortification', 'kills_armor', 'kills_air_defense', 'kills_artillery', 'kills_ships', 'kills_planes', 'kills_helicopters', 'kills_unarmed', 'kills_other', 'deaths', 'ejections', 'crashes', 'airfield_landings', 'ship_landings', 'farp_landings', 'other_landings', 'pvp', 'missionhash', 'qq', 'createdAt', 'updatedAt']
      }
    )

  }
  async UpdateMission(msg) {
    const data = await json2string(msg.data);
    server_info_model.create(data, { logQueryParameters: false }).catch((err) => { });
  }
}


module.exports = new eventController();