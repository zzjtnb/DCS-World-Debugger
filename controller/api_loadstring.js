class loadstringController {
  index(req, res, next) {
    res.render('lua/api_loadstring', { title: 'api_loadstring' });
  }
}
module.exports = new loadstringController();