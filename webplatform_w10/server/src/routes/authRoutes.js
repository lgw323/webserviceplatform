import express from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { register, login, oauthCallback, refreshAccessToken } from '../controllers/authController.js';

const router = express.Router();

// 보안: 브루트포스 공격 대비 인증 라우트 제한 (15분당 10회 제한)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 10,
  message: { status: 'error', message: '너무 많은 인증 시도가 발생했습니다. 15분 후 다시 시도해주세요.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// 미들웨어: 유효성 검사 결과 확인
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'error', message: errors.array()[0].msg });
  }
  next();
};

// 파이프라인: 유효성 검사 룰 세트
const registerRules = [
  body('username').trim().isLength({ min: 4, max: 20 }).withMessage('아이디는 4자에서 20자 사이여야 합니다.'),
  body('password').isLength({ min: 6 }).withMessage('비밀번호는 최소 6자 이상이어야 합니다.')
    .matches(/\d/).withMessage('비밀번호에는 숫자가 포함되어야 합니다.')
];

const loginRules = [
  body('username').trim().notEmpty().withMessage('아이디를 입력해주세요.'),
  body('password').notEmpty().withMessage('비밀번호를 입력해주세요.')
];

router.post('/register', authLimiter, registerRules, validateRequest, register);
router.post('/login', authLimiter, loginRules, validateRequest, login);
router.post('/refresh', refreshAccessToken);
router.get('/:provider/callback', authLimiter, oauthCallback);

export default router;
