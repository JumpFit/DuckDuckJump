const router = require('express').Router();
module.exports = router;

router.use('/games', require('./games'));
router.use('/users', require('./users'));
