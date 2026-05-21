import express from 'express';
import { getRecommendations } from '../controllers/recommendationController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);
router.get('/', getRecommendations);

export default router;
