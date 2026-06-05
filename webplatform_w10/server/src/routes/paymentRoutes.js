import express from 'express';
import { confirmPayment } from '../controllers/paymentController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 토스페이먼츠 결제 승인 요청 라우트
router.post('/confirm', authenticateToken, confirmPayment);

export default router;
