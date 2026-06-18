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
      email: user.email,
      nickname: user.nickname,
      provider: user.provider, 
      provider_id: user.provider_id,
      role: user.role || 'user',
      subscription_status: user.subscription_status || 'free',
      linked_providers: user.linked_providers || []
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
    const { email, nickname, password } = req.body;
    if (!email || !nickname || !password) {
      return res.status(400).json({ status: 'error', message: '이메일, 닉네임, 비밀번호를 입력해주세요.' });
    }

    const userCheck = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ status: 'error', message: '이미 가입된 이메일입니다.' });
    }

    const passwordHash = hashPassword(password);
    const result = await db.query(
      'INSERT INTO users (email, nickname, provider, provider_id, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, nickname, role, provider, provider_id, subscription_status, linked_providers',
      [email, nickname, 'local', email, passwordHash]
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
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: '이메일과 비밀번호를 입력해주세요.' });
    }

    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];
    if (!user || !user.password_hash || !verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ status: 'error', message: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    const { accessToken, refreshToken } = generateTokenPair(user);
    res.json({
      status: 'success',
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: { 
          id: user.id, 
          email: user.email,
          nickname: user.nickname,
          role: user.role || 'user',
          provider: user.provider, 
          provider_id: user.provider_id,
          subscription_status: user.subscription_status,
          linked_providers: user.linked_providers
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

export const sendVerificationCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ status: 'error', message: '이메일을 입력해주세요.' });
    
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60000); // 5 mins
    
    await db.query(
      'INSERT INTO email_verification_codes (email, code, expires_at) VALUES ($1, $2, $3)',
      [email, code, expiresAt]
    );

    console.log(`[Email Mock] ${email}로 인증 코드가 발송되었습니다: ${code}`);

    res.json({ status: 'success', message: `인증 코드가 발송되었습니다. (테스트용 코드: ${code})` });
  } catch (err) {
    next(err);
  }
};

export const verifyEmailCode = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ status: 'error', message: '이메일과 인증 코드를 입력해주세요.' });

    const result = await db.query(
      'SELECT * FROM email_verification_codes WHERE email = $1 AND used = false ORDER BY expires_at DESC LIMIT 1',
      [email]
    );

    const record = result.rows[0];
    if (!record) {
      return res.status(400).json({ status: 'error', message: '인증 요청을 찾을 수 없습니다.' });
    }
    if (new Date() > new Date(record.expires_at)) {
      return res.status(400).json({ status: 'error', message: '인증 코드가 만료되었습니다.' });
    }
    if (record.code !== code) {
      return res.status(400).json({ status: 'error', message: '인증 코드가 일치하지 않습니다.' });
    }

    await db.query('UPDATE email_verification_codes SET used = true WHERE id = $1', [record.id]);
    await db.query('UPDATE users SET email_verified = true WHERE email = $1', [email]);

    res.json({ status: 'success', message: '이메일 인증이 완료되었습니다.' });
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
        'INSERT INTO users (provider, provider_id, linked_providers) VALUES ($1, $2, $3) RETURNING id, provider, provider_id, linked_providers, subscription_status',
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

export const updateNickname = async (req, res, next) => {
  try {
    const { nickname } = req.body;
    const userId = req.user.id;

    if (!nickname || nickname.trim().length < 2 || nickname.trim().length > 20) {
      return res.status(400).json({ status: 'error', message: '닉네임은 2자에서 20자 사이여야 합니다.' });
    }

    const updateResult = await db.query(
      'UPDATE users SET nickname = $1 WHERE id = $2 RETURNING id, email, nickname, role, provider, provider_id, subscription_status, linked_providers',
      [nickname.trim(), userId]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: '사용자를 찾을 수 없습니다.' });
    }

    const user = updateResult.rows[0];
    if (user.linked_providers && typeof user.linked_providers === 'string') {
      try {
        user.linked_providers = JSON.parse(user.linked_providers);
      } catch (e) {
        user.linked_providers = [];
      }
    }

    const { accessToken, refreshToken } = generateTokenPair(user);

    res.json({
      status: 'success',
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
        user
      }
    });
  } catch (err) {
    next(err);
  }
};

const IS_UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isValidUuid(uuid) {
  if (!uuid) return false;
  return IS_UUID_REGEX.test(uuid);
}

export const getUserPosts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!isValidUuid(userId)) {
      return res.json({
        status: 'success',
        data: []
      });
    }
    const result = await db.query(
      'SELECT p.*, u.nickname as author_nickname, u.email as author_email FROM posts p LEFT JOIN users u ON p.user_id = u.id WHERE p.user_id = $1 ORDER BY p.created_at DESC',
      [userId]
    );
    res.json({
      status: 'success',
      data: result.rows
    });
  } catch (err) {
    next(err);
  }
};

export const getUserComments = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!isValidUuid(userId)) {
      return res.json({
        status: 'success',
        data: []
      });
    }
    const result = await db.query(
      'SELECT c.*, p.title as post_title FROM comments c LEFT JOIN posts p ON c.post_id = p.id WHERE c.user_id = $1 ORDER BY c.created_at DESC',
      [userId]
    );
    res.json({
      status: 'success',
      data: result.rows
    });
  } catch (err) {
    next(err);
  }
};


