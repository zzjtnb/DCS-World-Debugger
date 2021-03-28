const express = require('express');
const router = express.Router();
const net_dostring = require('../../controller/net_dostring')
/* GET users listing. */
router.get('/', net_dostring.index);
module.exports = router;
