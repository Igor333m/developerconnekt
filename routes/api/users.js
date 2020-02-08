const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

/**
 * @route POST api/users
 * @access Public
 * @desc Register users
 */
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please add a valid email').isEmail(),
  check('password', 'Please add a password with 6 or more characters').isLength({
    min: 6
  }),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  res.send('Users route');
});

module.exports = router;