import express from 'express';
import { getPosts, getPostById, createPost, createComment } from '../controllers/postController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', verifyToken, createPost);
router.post('/:id/comments', verifyToken, createComment);

export default router;
