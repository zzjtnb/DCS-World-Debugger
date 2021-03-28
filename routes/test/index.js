const router = require('express').Router();
const errorRouter = require('./error');
const helloRouter = require('./hello');
router.use('/err', errorRouter);
router.use('/hello', helloRouter);

module.exports = router
