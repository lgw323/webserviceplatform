import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db, initDb } from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import profileRoutes from './src/routes/profileRoutes.js';
import recommendationRoutes from './src/routes/recommendationRoutes.js';
import gameRoutes from './src/routes/gameRoutes.js';
import postRoutes from './src/routes/postRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import catalogRoutes from './src/routes/catalogRoutes.js';
import helmet from 'helmet';
import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';
import { errorHandler, logger } from './src/middlewares/errorMiddleware.js';
import { authenticateToken, isAdmin } from './src/middlewares/authMiddleware.js';

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

// Initialize DB schema — ensure tables exist before handling any request
let dbInitPromise = null;
function ensureDbInit() {
  if (!dbInitPromise) {
    dbInitPromise = initDb().catch(err => {
      console.error('[SYNCRIG DB] initDb failed, will retry on next request:', err.message);
      dbInitPromise = null; // Allow retry on next request
    });
  }
  return dbInitPromise;
}

// Middleware: block requests until DB is ready
app.use(async (req, res, next) => {
  try {
    await ensureDbInit();
    next();
  } catch (err) {
    next(err);
  }
});

// ─── Health Check ───
app.get('/api/health', (req, res) => {
  res.json({
    status: 'up',
    timestamp: new Date().toISOString(),
    db_mode: db.isPgActive() ? 'PostgreSQL' : 'In-Memory Fallback',
    service: 'SYNCRIG API Server'
  });
});

// ─── Danger: Force DB Reset ───
app.get('/api/admin/force-reset-db', authenticateToken, isAdmin, async (req, res) => {
  try {
    if (!db.isPgActive()) {
      return res.status(400).json({ error: 'PostgreSQL is not active' });
    }
    const client = await db.getClient();
    if (!client) throw new Error('Could not get DB client');
    
    await client.query(`DROP TABLE IF EXISTS post_likes CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS comments CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS posts CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS optimization_profiles CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS games CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS hardware_profiles CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS email_verification_codes CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS users CASCADE;`);
    
    client.release();
    
    // 테이블을 방금 드랍했으므로, 다음 요청이 오면 테이블을 다시 만들도록 프로미스 초기화
    dbInitPromise = null;
    await ensureDbInit();
    
    res.json({ status: 'success', message: '모든 테이블이 삭제되고 성공적으로 재생성(초기화) 되었습니다.' });
  } catch (err) {
    console.error('Force DB Reset Error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

import paymentRoutes from './src/routes/paymentRoutes.js';
import statsRoutes from './src/routes/statsRoutes.js';

// ─── Routes ───
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/users/hardware-profiles', profileRoutes);
app.use('/api/v1/catalog', catalogRoutes);
app.use('/api/v1/profiles/recommendations', recommendationRoutes);
app.use('/api/v1/games', gameRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/stats', statsRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/admin', adminRoutes);

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
