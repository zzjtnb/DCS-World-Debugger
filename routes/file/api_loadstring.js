const router = require('express').Router();
const api_loadstring = require('../../controller/api_loadstring')
router.get('/', api_loadstring.index);
module.exports = router;
