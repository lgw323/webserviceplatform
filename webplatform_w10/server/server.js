import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db, initDb } from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import profileRoutes from './src/routes/profileRoutes.js';
import recommendationRoutes from './src/routes/recommendationRoutes.js';
import gameRoutes from './src/routes/gameRoutes.js';
import helmet from 'helmet';
import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';
import { errorHandler, logger } from './src/middlewares/errorMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());

import session from 'express-session';
import passport from './src/config/passport.js';

app.use(session({
  secret: process.env.JWT_SECRET || 'syncrig_fallback_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use(passport.initialize());
app.use(passport.session());

// Add Trace ID to request
app.use((req, res, next) => {
  req.traceId = uuidv4();
  res.setHeader('X-Trace-Id', req.traceId);
  next();
});

// Configure Morgan to use Winston and log traceId
morgan.token('trace-id', (req) => req.traceId);
const morganFormat = ':trace-id :method :url :status :res[content-length] - :response-time ms';
app.use(morgan(morganFormat, {
  stream: { write: (message) => logger.info(message.trim()) }
}));

// Initialize DB schema asynchronously
initDb();

// ─── Health Check ───
app.get('/api/health', (req, res) => {
  res.json({
    status: 'up',
    timestamp: new Date().toISOString(),
    db_mode: db.isPgActive() ? 'PostgreSQL' : 'In-Memory Fallback',
    service: 'SYNCRIG API Server'
  });
});

// ─── TEMPORARY SYSTEM RESET ENDPOINT ───
// TODO: Vercel 환경에서 초기화 완료 후 이 라우트를 반드시 삭제하세요.
app.get('/api/system/reset-db', async (req, res) => {
  if (!db.isPgActive()) {
    return res.status(400).json({ error: 'PostgreSQL is not active.' });
  }
  
  try {
    const client = await db.getClient();
    await client.query("DROP TABLE IF EXISTS optimization_profiles CASCADE;");
    await client.query("DROP TABLE IF EXISTS hardware_profiles CASCADE;");
    await client.query("DROP TABLE IF EXISTS games CASCADE;");
    await client.query("DROP TABLE IF EXISTS users CASCADE;");
    client.release();
    
    res.json({ 
      message: '✅ All tables dropped successfully in Vercel DB.',
      instruction: '새로고침을 하거나 앱에 다시 접근하면 db.js가 깨끗한 테이블을 새로 생성합니다. 초기화가 완료되었으므로 이 코드는 삭제해 주세요.'
    });
  } catch (err) {
    console.error('Reset DB Error:', err);
    res.status(500).json({ error: 'Failed to reset DB', details: err.message });
  }
});

import paymentRoutes from './src/routes/paymentRoutes.js';
import statsRoutes from './src/routes/statsRoutes.js';

// ─── Routes ───
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users/hardware-profiles', profileRoutes);
app.use('/api/v1/profiles/recommendations', recommendationRoutes);
app.use('/api/v1/games', gameRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/stats', statsRoutes);

// ─── Global Error Handler ───
app.use(errorHandler);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`[SYNCRIG Local Server] Running on http://localhost:${PORT}`);
    console.log(`[SYNCRIG Local Server] Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`[SYNCRIG Local Server] DB mode: ${process.env.DATABASE_URL ? 'PostgreSQL (Active)' : 'In-Memory Mock Fallback (Active)'}`);
  });
}

export default app;
