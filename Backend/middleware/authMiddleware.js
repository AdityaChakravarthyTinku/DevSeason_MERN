const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure correct path to User model

module.exports = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.user._id);
    if (!req.user) {
      return res.status(401).json({ message: 'User not found, authorization denied' });
    }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
