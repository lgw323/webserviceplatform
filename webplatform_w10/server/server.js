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

// ─── Routes ───
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users/hardware-profiles', profileRoutes);
app.use('/api/v1/profiles/recommendations', recommendationRoutes);
app.use('/api/v1/games', gameRoutes);

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
