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
    { 
      id: user.id, 
      provider: user.provider, 
      provider_id: user.provider_id,
      subscription_status: user.subscription_status || 'free'
    },
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
      'INSERT INTO users (provider, provider_id, password_hash) VALUES ($1, $2, $3) RETURNING *',
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
    // 0. 동적 CLIENT_URL 추론 (Vercel Preview 등 대응)
    let CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
    
    // 세션에 저장해둔 redirectUrl이 있다면 최우선 사용
    if (req.session && req.session.redirectOrigin) {
      CLIENT_URL = req.session.redirectOrigin;
    }

    if (!req.user) {
      return res.redirect(`${CLIENT_URL}/?error=auth_failed`);
    }

    const { provider, provider_id } = req.user;

    // 1. 연동(Link) 모드 체크
    if (req.session && req.session.linkToken) {
      try {
        const decoded = jwt.verify(req.session.linkToken, JWT_SECRET);
        const userId = decoded.id;

        // 기존 유저 조회
        const userResult = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length > 0) {
          let targetUser = userResult.rows[0];
          let linked = targetUser.linked_providers || [];
          if (typeof linked === 'string') linked = JSON.parse(linked);
          
          if (!linked.includes(provider)) {
            linked.push(provider);
            // 업데이트
            await db.query('UPDATE users SET linked_providers = $1 WHERE id = $2', [JSON.stringify(linked), userId]);
          }
          
          // 사용 완료된 토큰 삭제
          delete req.session.linkToken;
          
          // 기존 유저로 토큰 발급 후 대시보드로 복귀
          targetUser.linked_providers = linked;
          const { accessToken, refreshToken } = generateTokenPair(targetUser);
          return res.redirect(`${CLIENT_URL}/auth/callback?access_token=${accessToken}&refresh_token=${refreshToken}`);
        }
      } catch (err) {
        console.error('Link token verification failed:', err.message);
        // 검증 실패 시 아래 신규 가입 로직으로 Fallback
      }
    }

    // 2. 일반 로그인/가입 모드
    let result = await db.query(
      'SELECT * FROM users WHERE provider = $1 AND provider_id = $2',
      [provider, provider_id]
    );

    let user = result.rows[0];
    if (!user) {
      const insertResult = await db.query(
        'INSERT INTO users (provider, provider_id, linked_providers) VALUES ($1, $2, $3) RETURNING *',
        [provider, provider_id, '[]']
      );
      user = insertResult.rows[0];
    }

    const { accessToken, refreshToken } = generateTokenPair(user);
    return res.redirect(`${CLIENT_URL}/auth/callback?access_token=${accessToken}&refresh_token=${refreshToken}`);
  } catch (err) {
    next(err);
  }
};

export const unlinkAccount = async (req, res, next) => {
  try {
    const { provider } = req.params;
    // 인증 처리를 위해 헤더에서 JWT 추출 (임시로 컨트롤러 내에서 직접 처리)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: 'error', message: '인증 토큰이 없습니다.' });
    }
    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ status: 'error', message: '유효하지 않은 토큰입니다.' });
    }

    const userId = decoded.id;
    const userResult = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: '사용자를 찾을 수 없습니다.' });
    }

    let user = userResult.rows[0];
    let linked = user.linked_providers || [];
    if (typeof linked === 'string') linked = JSON.parse(linked);

    if (linked.includes(provider)) {
      linked = linked.filter(p => p !== provider);
      await db.query('UPDATE users SET linked_providers = $1 WHERE id = $2', [JSON.stringify(linked), userId]);
      // 연동 해제 시 관련된 하드웨어나 최적화 정보 중 해당 프로바이더의 데이터(게임 등)를 삭제하는 로직도 가능
    }

    user.linked_providers = linked;
    const { accessToken, refreshToken } = generateTokenPair(user);

    res.json({
      status: 'success',
      data: { access_token: accessToken, refresh_token: refreshToken, user }
    });
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
