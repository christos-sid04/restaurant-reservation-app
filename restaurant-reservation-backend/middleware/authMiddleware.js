const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key_here';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  // Expected format: "Bearer token"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }

    req.user = user; // contains user_id and email from the token
    next();
  });
}

module.exports = authenticateToken;


