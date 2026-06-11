import express from 'express';
import { getPosts, getPostById, createPost, createComment } from '../controllers/postController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', authenticateToken, createPost);
router.post('/:id/comments', authenticateToken, createComment);

export default router;
