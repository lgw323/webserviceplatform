import express from 'express';
import { getPosts, getPostById, createPost, updatePost, deletePost, toggleLike, createComment, deleteComment, togglePinPost } from '../controllers/postController.js';
import { authenticateToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 공개 라우트
router.get('/', getPosts);
router.get('/:id', getPostById);

// 인증 필수 라우트
router.post('/', authenticateToken, createPost);
router.put('/:id', authenticateToken, updatePost);
router.delete('/:id', authenticateToken, deletePost);
router.post('/:id/like', authenticateToken, toggleLike);
router.post('/:id/comments', authenticateToken, createComment);
router.delete('/comments/:commentId', authenticateToken, deleteComment);
router.patch('/:id/pin', authenticateToken, isAdmin, togglePinPost);

export default router;
