import express from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { register, login, oauthCallback, refreshAccessToken, unlinkAccount, sendVerificationCode, verifyEmailCode } from '../controllers/authController.js';
import passport from 'passport';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { status: 'error', message: '너무 많은 인증 시도가 발생했습니다. 15분 후 다시 시도해주세요.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'error', message: errors.array()[0].msg });
  }
  next();
};

const registerRules = [
  body('email').trim().isEmail().withMessage('유효한 이메일 주소를 입력해주세요.'),
  body('nickname').trim().isLength({ min: 2, max: 20 }).withMessage('닉네임은 2자에서 20자 사이여야 합니다.'),
  body('password').isLength({ min: 6 }).withMessage('비밀번호는 최소 6자 이상이어야 합니다.')
    .matches(/\d/).withMessage('비밀번호에는 숫자가 포함되어야 합니다.')
];

const loginRules = [
  body('email').trim().notEmpty().withMessage('이메일을 입력해주세요.'),
  body('password').notEmpty().withMessage('비밀번호를 입력해주세요.')
];

// ── 토큰 임시 저장 미들웨어 (연동 시 사용) ──
const saveAuthContext = (req, res, next) => {
  if (req.query.token) {
    // 세션에 토큰 저장 (연동 시 기존 로그인 유저를 식별하기 위함)
    req.session.linkToken = req.query.token;
  }
  
  // Vercel Preview 대응: 클라이언트에서 넘어올 때의 도메인을 기억해둠
  const referer = req.headers.referer;
  if (referer) {
    try {
      const url = new URL(referer);
      req.session.redirectOrigin = url.origin;
    } catch (e) {
      console.error('Invalid referer:', referer);
    }
  }
  
  next();
};

// ── 일반 계정 인증 ──
router.post('/register', authLimiter, registerRules, validateRequest, register);
router.post('/login', authLimiter, loginRules, validateRequest, login);
router.post('/refresh', refreshAccessToken);
router.delete('/unlink/:provider', authLimiter, unlinkAccount);
router.post('/send-code', authLimiter, sendVerificationCode);
router.post('/verify-code', authLimiter, verifyEmailCode);

// ── 소셜 인증 미들웨어 (Fallback) ──
const checkSteamAuth = (req, res, next) => {
  const host = req.headers['x-forwarded-host'] || req.headers.host || '';
  const protocol = req.headers['x-forwarded-proto'] || 'http';

  if (!process.env.STEAM_API_KEY) {
    // Fallback: 가짜 프로필 리턴
    req.user = { provider: 'steam', provider_id: 'steam_mock_' + Math.floor(Math.random() * 900000) };
    return oauthCallback(req, res, next);
  }

  // Vercel Preview/Prod 등 동적 도메인 대응을 위해 callbackURL 및 realm을 동적 지정
  const isProdOrPreview = host && !host.includes('localhost:5000');
  const steamStrategy = passport._strategies && passport._strategies.steam;

  // Stateless 대응: 세션 유실에 대비해 JWT 토큰을 returnURL의 쿼리 스트링으로 실어 보냄
  const linkToken = req.query.token || req.query.linkToken || (req.session && req.session.linkToken);

  if (isProdOrPreview) {
    const callbackBase = `${protocol}://${host}/api/v1/auth/steam/callback`;
    const dynamicReturnURL = linkToken
      ? `${callbackBase}?linkToken=${linkToken}`
      : callbackBase;
    const dynamicRealm = `${protocol}://${host}/`;

    if (steamStrategy && steamStrategy._relyingParty) {
      steamStrategy._relyingParty.returnUrl = dynamicReturnURL;
      steamStrategy._relyingParty.realm = dynamicRealm;
    }
  } else {
    // 로컬 개발 환경인 경우 기본값으로 원복
    if (steamStrategy && steamStrategy._relyingParty) {
      const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';
      const callbackBase = `${SERVER_URL}/api/v1/auth/steam/callback`;
      const dynamicReturnURL = linkToken
        ? `${callbackBase}?linkToken=${linkToken}`
        : callbackBase;

      steamStrategy._relyingParty.returnUrl = dynamicReturnURL;
      steamStrategy._relyingParty.realm = SERVER_URL;
    }
  }

  passport.authenticate('steam', { 
    failureRedirect: '/' 
  })(req, res, next);
};

const checkRiotAuth = (req, res, next) => {
  const host = req.headers['x-forwarded-host'] || req.headers.host || '';
  const protocol = req.headers['x-forwarded-proto'] || 'http';

  if (!process.env.RIOT_CLIENT_ID || !process.env.RIOT_CLIENT_SECRET) {
    req.user = { provider: 'riot', provider_id: 'riot_mock_' + Math.floor(Math.random() * 900000) };
    return oauthCallback(req, res, next);
  }

  // Vercel Preview 등 동적 도메인 대응을 위해 callbackURL을 동적 지정
  const dynamicCallbackURL = host && !host.includes('localhost:5000')
    ? `${protocol}://${host}/api/v1/auth/riot/callback`
    : undefined;

  // Stateless 대응: Riot OAuth2.0의 state 파라미터로 JWT 토큰 전달
  const linkToken = req.query.token || req.query.state || (req.session && req.session.linkToken);

  passport.authenticate('riot', { 
    callbackURL: dynamicCallbackURL,
    state: linkToken, // OAuth2 state 파라미터에 토큰 지정
    failureRedirect: '/' 
  })(req, res, next);
};

// ── Steam 인증 ──
router.get('/steam', authLimiter, saveAuthContext, checkSteamAuth);
router.get('/steam/callback', authLimiter, checkSteamAuth, oauthCallback);

// ── Riot 인증 ──
router.get('/riot', authLimiter, saveAuthContext, checkRiotAuth);
router.get('/riot/callback', authLimiter, checkRiotAuth, oauthCallback);

export default router;
