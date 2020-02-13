const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User.js');

/**
 * @route GET api/auth
 * @access Public
 * @desc Test auth route
 */
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route POST api/auth
 * @access Public
 * @desc Authenticate user and get jwt
 */
router.post('/', [
  check('email', 'Please add a valid email').isEmail(),
  check('password', 'Passport is required').exists(),
], async (req, res) => {
  // express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }

  const { email, password } = req.body;

  try {
    // See if user exists
    let user = await User.findOne({ email });
console.log(user);
    if (!user) {
      return res.status(400).json({errors: [{ msg: 'Invalid Credentials!' }]});
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({errors: [{ msg: 'Invalid Credentials!' }]});  
    }
  
    // Return jsonWebToken
    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(
      payload,
      config.get('jwt'),
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
      );

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }

});

module.exports = router;