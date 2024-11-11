// authMiddleware.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');

const authMiddleware = (req, res, next) => {
    // const token = localStorage.getItem('token')
  const token = req.headers.authorization?.split(" ")[1];
  
  
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId; // Attach userId to the request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = authMiddleware;
