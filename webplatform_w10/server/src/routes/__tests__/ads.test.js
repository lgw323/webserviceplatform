import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import recommendationRoutes from '../recommendationRoutes.js';
import * as authMiddleware from '../../middlewares/authMiddleware.js';

// Mock the auth middleware so we don't need a real JWT for the test
vi.mock('../../middlewares/authMiddleware.js', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { id: 'test-user', hardware: { cpu: 'i3-10100', gpu: 'RTX 4090', ram: '16GB' } };
    next();
  }
}));

const app = express();
app.use(express.json());
app.use('/api/recommendations', recommendationRoutes);

describe('GET /api/recommendations/ads', () => {
  it('should return a targeted ad based on user hardware bottleneck', async () => {
    const res = await request(app).get('/api/recommendations/ads');
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('ad');
    expect(res.body.ad).toHaveProperty('type', 'cpu');
    expect(res.body.ad.title).toContain('CPU 업그레이드');
  });
});
