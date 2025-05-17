// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('[AUTH MIDDLEWARE] Token header bulunamadı');
    return res.status(401).json({ message: 'Token gerekli' });
  }

  const token = authHeader.split(' ')[1];
  req.token = token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    const [rows] = await db.execute(
      'SELECT * FROM revoked_tokens WHERE token = ?',
      [token]
    );

    if (rows.length > 0) {
      console.warn('[AUTH MIDDLEWARE] Token iptal edilmiş');
      return res.status(403).json({ message: 'Token iptal edilmiş' });
    }

    next();
  } catch (error) {
    console.error('[AUTH MIDDLEWARE] Token doğrulanamadı:', error.message);
    return res.status(403).json({ message: 'Token geçersiz veya süresi dolmuş' });
  }
};

module.exports = verifyToken;
