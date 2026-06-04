import express from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { register, login, oauthCallback, refreshAccessToken, unlinkAccount } from '../controllers/authController.js';
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
  body('username').trim().isLength({ min: 4, max: 20 }).withMessage('아이디는 4자에서 20자 사이여야 합니다.'),
  body('password').isLength({ min: 6 }).withMessage('비밀번호는 최소 6자 이상이어야 합니다.')
    .matches(/\d/).withMessage('비밀번호에는 숫자가 포함되어야 합니다.')
];

const loginRules = [
  body('username').trim().notEmpty().withMessage('아이디를 입력해주세요.'),
  body('password').notEmpty().withMessage('비밀번호를 입력해주세요.')
];

// ── 토큰 임시 저장 미들웨어 (연동 시 사용) ──
const saveLinkToken = (req, res, next) => {
  if (req.query.token) {
    // 세션에 토큰 저장 (연동 시 기존 로그인 유저를 식별하기 위함)
    req.session.linkToken = req.query.token;
  }
  next();
};

// ── 일반 계정 인증 ──
router.post('/register', authLimiter, registerRules, validateRequest, register);
router.post('/login', authLimiter, loginRules, validateRequest, login);
router.post('/refresh', refreshAccessToken);
router.delete('/unlink/:provider', authLimiter, unlinkAccount);

// ── 소셜 인증 미들웨어 (Fallback) ──
const checkSteamAuth = (req, res, next) => {
  if (!process.env.STEAM_API_KEY) {
    // Fallback: 가짜 프로필 리턴
    req.user = { provider: 'steam', provider_id: 'steam_mock_' + Math.floor(Math.random() * 900000) };
    return oauthCallback(req, res, next);
  }
  passport.authenticate('steam', { failureRedirect: '/' })(req, res, next);
};

const checkRiotAuth = (req, res, next) => {
  if (!process.env.RIOT_CLIENT_ID || !process.env.RIOT_CLIENT_SECRET) {
    req.user = { provider: 'riot', provider_id: 'riot_mock_' + Math.floor(Math.random() * 900000) };
    return oauthCallback(req, res, next);
  }
  passport.authenticate('riot', { failureRedirect: '/' })(req, res, next);
};

// ── Steam 인증 ──
router.get('/steam', authLimiter, saveLinkToken, checkSteamAuth);
router.get('/steam/callback', authLimiter, checkSteamAuth, oauthCallback);

// ── Riot 인증 ──
router.get('/riot', authLimiter, saveLinkToken, checkRiotAuth);
router.get('/riot/callback', authLimiter, checkRiotAuth, oauthCallback);

export default router;
