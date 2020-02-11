const jwt = require('jsonwebtoken');
const config = require('config');

/**
 * @desc Verifies the jwt token
 */
module.exports = function (req, res, next) {
  // Get token from the header

  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwt'));

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'token is not valid' });
  }
}