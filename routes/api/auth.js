const express = require('express');
const router = express.Router();

/**
 * @route GET api/auth
 * @access Public
 * @desc Test auth route
 */
router.get('/', (req, res) => res.send('Auth route'));

module.exports = router;