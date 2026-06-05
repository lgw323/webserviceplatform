import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import paymentRoutes from '../paymentRoutes.js';
import * as authMiddleware from '../../middlewares/authMiddleware.js';

vi.mock('../../middlewares/authMiddleware.js', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { id: 'test-user', subscription_status: 'free' };
    next();
  }
}));

// Mock Stripe
vi.mock('stripe', () => {
  const StripeMock = function() {
    this.checkout = {
      sessions: {
        create: vi.fn().mockResolvedValue({ url: 'https://checkout.stripe.com/test-url' })
      }
    };
  };
  return { default: StripeMock };
});

const app = express();
app.use(express.json());
app.use('/api/payments', paymentRoutes);

describe('Payment API', () => {
  it('should create a checkout session', async () => {
    const res = await request(app).post('/api/payments/create-checkout-session');
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('url', 'https://checkout.stripe.com/test-url');
  });
});
