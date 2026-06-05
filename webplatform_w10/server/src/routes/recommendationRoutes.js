import express from 'express';
import { getRecommendations, getAds } from '../controllers/recommendationController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);
router.get('/', getRecommendations);
router.get('/ads', getAds);

export default router;
