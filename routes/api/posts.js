const express = require('express');
const router = express.Router();

/**
 * @route GET api/posts
 * @access Public
 * @desc Test posts route
 */
router.get('/', (req, res) => res.send('Posts route'));

module.exports = router;