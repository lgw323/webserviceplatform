import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'syncrig_dev_fallback_key';
if (!process.env.JWT_SECRET) {
  console.warn('⚠️ [authMiddleware] JWT_SECRET 환경변수 미설정. 개발용 fallback 사용.');
}

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

export function requirePremium(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: '인증이 필요합니다.'
    });
  }
  
  if (req.user.subscription_status !== 'premium') {
    return res.status(403).json({
      status: 'error',
      message: '해당 기능은 PRO 구독자 전용입니다.'
    });
  }
  
  next();
}
