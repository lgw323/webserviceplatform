import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'syncrig_secret_key_129847129487';

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, originalHash] = storedHash.split(':');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === originalHash;
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, provider: user.provider, provider_id: user.provider_id },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ status: 'error', message: '아이디와 비밀번호를 입력해주세요.' });
    }

    const userCheck = await db.query(
      'SELECT * FROM users WHERE provider = $1 AND provider_id = $2',
      ['local', username]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ status: 'error', message: '이미 가입된 아이디입니다.' });
    }

    const passwordHash = hashPassword(password);
    const result = await db.query(
      'INSERT INTO users (provider, provider_id, password_hash) VALUES ($1, $2, $3) RETURNING id, provider, provider_id',
      ['local', username, passwordHash]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    res.status(201).json({
      status: 'success',
      data: { access_token: token, user }
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ status: 'error', message: '아이디와 비밀번호를 입력해주세요.' });
    }

    const result = await db.query(
      'SELECT * FROM users WHERE provider = $1 AND provider_id = $2',
      ['local', username]
    );

    const user = result.rows[0];
    if (!user || !user.password_hash || !verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ status: 'error', message: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }

    const token = generateToken(user);
    res.json({
      status: 'success',
      data: {
        access_token: token,
        user: { id: user.id, provider: user.provider, provider_id: user.provider_id }
      }
    });
  } catch (err) {
    next(err);
  }
};

export const oauthCallback = async (req, res, next) => {
  try {
    const { provider } = req.params;
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ status: 'error', message: 'Authorization Code가 필요합니다.' });
    }

    const mockId = `external_${provider}_${code}`;
    
    let result = await db.query(
      'SELECT * FROM users WHERE provider = $1 AND provider_id = $2',
      [provider, mockId]
    );

    let user = result.rows[0];
    if (!user) {
      const insertResult = await db.query(
        'INSERT INTO users (provider, provider_id) VALUES ($1, $2) RETURNING id, provider, provider_id',
        [provider, mockId]
      );
      user = insertResult.rows[0];
    }

    const token = generateToken(user);
    res.json({
      status: 'success',
      data: { access_token: token, user }
    });
  } catch (err) {
    next(err);
  }
};
