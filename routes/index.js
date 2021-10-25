const router = require('express').Router();

router.get('/', (req, res, next) => {
  res.render('index', { title: '首页' });
});

const fileRoutes = require('./file');
const testRoutes = require('./test');

router.use('/file', fileRoutes);
router.use('/test', testRoutes);

module.exports = router;
