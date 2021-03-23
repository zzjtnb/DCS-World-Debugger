const express = require('express');
const router = express.Router();
const str2null = require('../utils/str2null')

router.use(function (req, res, next) {
  if (req.body && Object.keys(req.body).length > 0) req.body = str2null(req.body)
  if (req.query && Object.keys(req.query).length > 0) req.query = str2null(req.query)
  next();
})

const errorRouter = require('./error');
const helloRouter = require('./hello');
const dostringRouter = require('./net_dostring');
const loadstringRouter = require('./api_loadstring');

router.use('/err', errorRouter);
router.use('/hello', helloRouter);
router.use('/api_loadstring', loadstringRouter);
router.use('/net_dostring', dostringRouter);


module.exports = router;
