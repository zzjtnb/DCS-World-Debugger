const { server_info_model, user_info_model } = require('../../models');
class apiController {
  index(req, res, next) {
    console.log(req);
    res.json({ code: 200, message: "Hello World" })
  }
  async killRanking(req, res, next) {
    const model = await user_info_model.findAll({
      raw: true,
      limit: 5,
      order: [['kills_planes', 'DESC']],
      attributes: ['name', 'kills_planes']
    })

    res.json({ code: 200, data: model, message: "success" })
  }

}
module.exports = new apiController();