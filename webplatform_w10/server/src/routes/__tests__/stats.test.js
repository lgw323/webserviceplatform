import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import statsRoutes from '../statsRoutes.js';

// Mock authMiddleware
vi.mock('../../middlewares/authMiddleware.js', () => ({
  authenticateToken: (req, res, next) => {
    // Determine user status by a custom header for testing
    const role = req.headers['x-test-role'] || 'free';
    if (role === 'unauth') {
      return res.status(401).json({ status: 'error', message: '인증이 필요합니다.' });
    }
    req.user = { id: 'test-user', subscription_status: role };
    next();
  },
  requirePremium: (req, res, next) => {
    if (req.user.subscription_status !== 'premium') {
      return res.status(403).json({ status: 'error', message: '해당 기능은 PRO 구독자 전용입니다.' });
    }
    next();
  }
}));

const app = express();
app.use(express.json());
app.use('/api/stats', statsRoutes);

describe('Stats API', () => {
  it('should return 401 if unauthenticated', async () => {
    const res = await request(app)
      .get('/api/stats/top-tier')
      .set('x-test-role', 'unauth');
    
    expect(res.status).toBe(401);
  });

  it('should return 403 if user is free', async () => {
    const res = await request(app)
      .get('/api/stats/top-tier')
      .set('x-test-role', 'free');
    
    expect(res.status).toBe(403);
  });

  it('should return top tier stats if user is premium', async () => {
    const res = await request(app)
      .get('/api/stats/top-tier')
      .set('x-test-role', 'premium');
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('cpu_score');
    expect(res.body.data).toHaveProperty('gpu_score');
  });
});
