const router = require('express').Router();
const api = require('../../controller/api')
router.get('/', api.index);
router.get('/killRanking', api.killRanking);
module.exports = router;
