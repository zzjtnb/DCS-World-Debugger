const express = require('express');
const router = express.Router();
const err = require('../../controller/error')
/* GET users listing. */
router.get('/', err.index);
router.get('/1', err.cuntom1);
router.get('/2', err.cuntom2);
router.get('/3', err.cuntom3);
router.get('/4', err.cuntom4);


module.exports = router;
