import express from 'express';
import { updateNickname, getUserPosts, getUserComments } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.patch('/me/nickname', authenticateToken, updateNickname);
router.get('/me/posts', authenticateToken, getUserPosts);
router.get('/me/comments', authenticateToken, getUserComments);

export default router;

