import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

export default authMiddleware;
