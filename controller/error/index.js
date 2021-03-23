class errorController {
  index(req, res, next) {
    res.json({ code: 200, message: "错误页" })
  }
  cuntom1(req, res, next) {
    next({ status: 500, message: "自定义错误" });
  }
  cuntom2(req, res, next) {
    throw new Error("BROKEN");
  }
  cuntom3(req, res) {
    try {
      const fs = require('fs');
      let data = fs.readFileSync('ddd.x')
      res.send(data)
    } catch (error) {
      throw new Error('你要找的文件丢失了')
    }
  }
  cuntom4(req, res, next) {
    return next(getError('cuntom4'));
  }
}
function getError(at) {
  return {
    message: "服务器出错,请稍后再试",
    at: 'controller/eerror/index.js-->' + at
  }
}
module.exports = new errorController();