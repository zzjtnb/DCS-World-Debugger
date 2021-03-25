

class dostringController {
  index(req, res, next) {
    res.render('lua/net_dostring', { title: 'net_dostring' });
  }
}

module.exports = new dostringController();