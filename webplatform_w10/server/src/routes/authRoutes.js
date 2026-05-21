import express from 'express';
import { register, login, oauthCallback } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/:provider/callback', oauthCallback);

export default router;
