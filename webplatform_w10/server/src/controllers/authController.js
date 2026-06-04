import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';

// ── JWT 보안 설정 ──
const JWT_SECRET = process.env.JWT_SECRET || 'syncrig_dev_fallback_key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || JWT_SECRET + '_refresh';

if (!process.env.JWT_SECRET) {
  console.warn('⚠️ [SECURITY] JWT_SECRET 환경변수가 설정되지 않았습니다. 개발용 fallback을 사용합니다.');
  console.warn('⚠️ Vercel 배포 시 반드시 Environment Variables에 JWT_SECRET을 설정하세요.');
}

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

function generateTokenPair(user) {
  const accessToken = jwt.sign(
    { id: user.id, provider: user.provider, provider_id: user.provider_id },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    { id: user.id, type: 'refresh' },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  return { accessToken, refreshToken };
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
    const { accessToken, refreshToken } = generateTokenPair(user);

    res.status(201).json({
      status: 'success',
      data: { access_token: accessToken, refresh_token: refreshToken, user }
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

    const { accessToken, refreshToken } = generateTokenPair(user);
    res.json({
      status: 'success',
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: { id: user.id, provider: user.provider, provider_id: user.provider_id }
      }
    });
  } catch (err) {
    next(err);
  }
};

export const oauthCallback = async (req, res, next) => {
  try {
    const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

    // req.user는 Passport에서 왔거나 Fallback 미들웨어에서 생성됨
    if (!req.user) {
      return res.redirect(`${CLIENT_URL}/?error=auth_failed`);
    }

    const { provider, provider_id } = req.user;

    let result = await db.query(
      'SELECT * FROM users WHERE provider = $1 AND provider_id = $2',
      [provider, provider_id]
    );

    let user = result.rows[0];
    if (!user) {
      const insertResult = await db.query(
        'INSERT INTO users (provider, provider_id) VALUES ($1, $2) RETURNING id, provider, provider_id',
        [provider, provider_id]
      );
      user = insertResult.rows[0];
    }

    const { accessToken, refreshToken } = generateTokenPair(user);
    
    // 프론트엔드의 콜백 라우트로 토큰을 전달하며 리다이렉트
    return res.redirect(`${CLIENT_URL}/auth/callback?access_token=${accessToken}&refresh_token=${refreshToken}`);
  } catch (err) {
    next(err);
  }
};

// ── Refresh Token 엔드포인트 ──
export const refreshAccessToken = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      return res.status(400).json({ status: 'error', message: 'Refresh token이 필요합니다.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(refresh_token, JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({ status: 'error', message: 'Refresh token이 만료되었거나 유효하지 않습니다.' });
    }

    const result = await db.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ status: 'error', message: '사용자를 찾을 수 없습니다.' });
    }

    const { accessToken } = generateTokenPair(user);
    res.json({
      status: 'success',
      data: { access_token: accessToken }
    });
  } catch (err) {
    next(err);
  }
};
