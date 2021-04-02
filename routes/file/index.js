const router = require('express').Router();
const dostringRouter = require('./net_dostring');
const loadstringRouter = require('./api_loadstring');
router.use('/net_dostring', dostringRouter);
router.use('/api_loadstring', loadstringRouter);
module.exports = router
