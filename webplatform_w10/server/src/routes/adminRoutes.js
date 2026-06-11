import express from 'express';
import { getStats, getUsers, deletePost, deleteComment } from '../controllers/adminController.js';
import { authenticateToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken, isAdmin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.delete('/posts/:id', deletePost);
router.delete('/comments/:id', deleteComment);

export default router;
