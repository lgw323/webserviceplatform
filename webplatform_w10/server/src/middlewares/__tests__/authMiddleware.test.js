import { describe, it, expect, vi } from 'vitest';
import { requirePremium } from '../authMiddleware.js';

describe('requirePremium Middleware', () => {
  it('should return 401 if user is not authenticated', () => {
    const req = {};
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    const next = vi.fn();

    requirePremium(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: '인증이 필요합니다.'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if user is not premium', () => {
    const req = { user: { subscription_status: 'free' } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    const next = vi.fn();

    requirePremium(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: '해당 기능은 PRO 구독자 전용입니다.'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if user is premium', () => {
    const req = { user: { subscription_status: 'premium' } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    const next = vi.fn();

    requirePremium(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
