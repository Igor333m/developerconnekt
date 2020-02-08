const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

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
], async (req, res) => {
  // express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }

  const { name, email, password } = req.body;

  try {
    // See if user exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({errors: [{ msg: `User with ${email} email already exists!` }]});
    }

    // Get users gravatar image
    const avatar = gravatar.url(email, {s: '200', r: 'pg', d: 'mm'});

    user = new User({
      name,
      email,
      password,
      avatar
    });
  
    // Encrypt password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);
    
    // Return jsonWebToken
    
    // Saves the user to database
    await user.save();
    
    res.send('User registered!');

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }

});

module.exports = router;