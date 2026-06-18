import express from 'express';
import { updateNickname } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.patch('/me/nickname', authenticateToken, updateNickname);

export default router;
