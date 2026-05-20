import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'syncrig_secret_key_129847129487';

// ─── Cryptographically Secure Hash ───
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedHash) {
  const [salt, originalHash] = storedHash.split(':');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === originalHash;
}

// ─── JWT Generation ───
export function generateToken(user) {
  return jwt.sign(
    { id: user.id, provider: user.provider, provider_id: user.provider_id },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// ─── Express Verification Middleware ───
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: '인증 토큰이 누락되었습니다.'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        status: 'error',
        message: '유효하지 않거나 만료된 인증 토큰입니다.'
      });
    }
    req.user = user;
    next();
  });
}
