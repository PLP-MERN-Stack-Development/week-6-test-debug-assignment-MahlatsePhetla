
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, username: user.username },
    SECRET,
    { expiresIn: '1d' }
  );
}

module.exports = { authenticateToken, generateToken };
