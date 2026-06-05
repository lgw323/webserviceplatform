import express from 'express';
import { getTopTierStats } from '../controllers/statsController.js';
import { authenticateToken, requirePremium } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/top-tier', authenticateToken, requirePremium, getTopTierStats);

export default router;
