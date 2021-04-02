const router = require('express').Router();
const str2null = require('../utils/str2null')
router.get('/', (req, res, next) => {
  res.render('index', { title: '首页' });
});
router.use(function (req, res, next) {
  if (req.body && Object.keys(req.body).length > 0) req.body = str2null(req.body)
  if (req.query && Object.keys(req.query).length > 0) req.query = str2null(req.query)
  next();
})
const fileRoutes = require('./file');
const testRoutes = require('./test');
const apiRoutes = require('./api');
router.use('/file', fileRoutes);
router.use('/test', testRoutes);
router.use('/api/v1', apiRoutes);
module.exports = router
