const event = require('../../middleware/event');
const gameEvent = require('../../controller/gameEvent')

/**
 * 监听事件
 */
//关联QQ
event.on('updateQQ', async (msg) => {
  if (msg.data.qq.split(' ')[1]) {
    const result1 = await userInfoModel.update({ qq: msg.data.qq.split(' ')[1] }, { where: { ucid: msg.data.ucid } })
    const result2 = await killsModel.update({ qq: msg.data.qq.split(' ')[1] }, { where: { ucid: msg.data.ucid } })
    if (result1 && result2) {
      sendMsg(Buffer.from(JSON.stringify('该账号已关联,可以在群进行查询')))
    }
  } else {
    sendMsg(Buffer.from(JSON.stringify('格式不正确')))
  }
});
//任务加载完毕
event.on('UpdateMission', async (msg) => {
  gameEvent.UpdateMission(msg)
});
event.on('UpdatePlayersData', async (msg) => {
  gameEvent.UpdatePlayersData(msg)
});
let msg = {
  "data": {
    "data": {
      "t": {
        "ucid": "t",
        "airfield_takeoffs": 1,
      },
      "a": {
        "ucid": "a",
        "airfield_takeoffs": 5,
      }
    },
    "theatre": "Caucasus",
    "count_players": 2
  }
}
// gameEvent.UpdatePlayersData(msg)
//每一帧渲染的hook
event.on('onSimulationFrame', (msg) => {
  // console.log(msg);
});
//开始渲染hook
event.on('onSimulationStart', (msg) => {
  // console.log(msg);
});
//停止渲染hook
event.on('onSimulationStop', (msg) => {
  // console.log(msg);
})

//玩家连接
event.on('playerLogin', async (msg) => {
  if (!msg.data.ucid) return;
  const [user, created] = await user_info_model.findOrCreate({
    raw: true, where: { ucid: msg.data.ucid }, defaults: msg.data
  });
  if (created) return;
  user_info_model.update(msg.data, { where: { ucid: msg.data.ucid } }).catch((err) => { });
});
//改变角色
event.on('change_slot', (msg) => {
  // console.log(msg);
});
//起飞
event.on('takeoff', async (msg) => {
  const model = await userInfoModel.findOne({ where: { ucid: msg.data.ucid } })
  const result = userInfoModel.update({ 'takeoff': model.dataValues.takeoff + 1 }, { where: { ucid: msg.data.ucid } })
  if (!result) return dbErrorLog.error(result)
});
//击杀
event.on('kill', async (msg) => {
  // killsModel
  const model = await userInfoModel.findOne({ where: { ucid: msg.data.ucid } })
  if (model && model.dataValues.qq) {
    msg.data.qq = model.dataValues.qq
  }
  msg.data.date = msg.executionTime.os
  killsModel.create(msg.data)
  // console.log("kill信息已更新");
  let sideCode = {
    0: '中立',
    1: '红方',
    2: '蓝方',
  }
  let killerSide = msg.data.killerSide in sideCode ? sideCode[msg.data.killerSide] : msg.data.killerSide
  let victimSide = msg.data.victimSide in sideCode ? sideCode[msg.data.victimSide] : msg.data.victimSide
  let killStats = '击杀敌军'
  let faceID = 67

  killerSide == victimSide ? killStats = '击杀友军' : faceID = 76
  // if (msg.data.victimAlias.match(/AI/ig) == null) {
  //   // 蓝方xx驾驶F15使用120c击杀红方xx驾驶的F16
  //   bot.sendGroupMsg(process.env.qq, `[CQ:face,id=${faceID}]${killerSide}${msg.data.killAlias}驾驶${msg.data.killerUnitType}使用${msg.data.weaponName}${killStats}${victimSide}${msg.data.victimAlias}驾驶的${msg.data.victimUnitType}`);
  // }
});

//误伤
event.on('friendly_fire', async (msg) => {
  const model = await userInfoModel.findOne({ where: { ucid: msg.data.ucid } })
  const result = userInfoModel.update({ 'friendly_fire': model.dataValues.friendly_fire + 1 }, { where: { ucid: msg.data.ucid } })
  if (!result) return dbErrorLog.error(result)
});

//自杀
event.on('self_kill', async (msg) => {
  const model = await userInfoModel.findOne({ where: { ucid: msg.data.ucid } })
  const result = userInfoModel.update({ 'pilot_death': model.dataValues.pilot_death + 1 }, { where: { ucid: msg.data.ucid } })
  if (!result) return dbErrorLog.error(result)
});

//坠毁
event.on('crash', async (msg) => {
  const model = await userInfoModel.findOne({ where: { ucid: msg.data.ucid } })
  const result = userInfoModel.update({ 'crash': model.dataValues.crash + 1 }, { where: { ucid: msg.data.ucid } })
  if (!result) return dbErrorLog.error(result)
});

//弹射
event.on('eject', async (msg) => {
  const model = await userInfoModel.findOne({ where: { ucid: msg.data.ucid } })
  const result = userInfoModel.update({ 'eject': model.dataValues.eject + 1 }, { where: { ucid: msg.data.ucid } })
  if (!result) return dbErrorLog.error(result)
});

//降落
event.on('landing', async (msg) => {
  const model = await userInfoModel.findOne({ where: { ucid: msg.data.ucid } })
  const result = userInfoModel.update({ 'landing': model.dataValues.landing + 1 }, { where: { ucid: msg.data.ucid } })
  if (!result) return dbErrorLog.error(result)
});
//飞行员死亡
event.on('pilot_death', async (msg) => {
  const model = await userInfoModel.findOne({ where: { ucid: msg.data.ucid } })
  const result = userInfoModel.update({ 'pilot_death': model.dataValues.pilot_death + 1 }, { where: { ucid: msg.data.ucid } })
  if (!result) return dbErrorLog.error(result)
});

//任务结束
event.on('mission_end', async (msg) => {
  // console.log(msg);
});