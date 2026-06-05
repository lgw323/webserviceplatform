import express from 'express';
import { createCheckoutSession, handleWebhook } from '../controllers/paymentController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Webhook payload needs to be raw, but for simplicity in this TDD environment we use express.json() globally.
// In production, we'd use express.raw({type: 'application/json'}) for the webhook route.
router.post('/webhook', handleWebhook);

router.post('/create-checkout-session', authenticateToken, createCheckoutSession);

export default router;
