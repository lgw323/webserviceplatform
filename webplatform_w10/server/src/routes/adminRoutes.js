import express from 'express';
import { getStats, getUsers, updateUserRole, banUser, hidePost, deletePost, deleteComment, getBusinessMetrics } from '../controllers/adminController.js';
import { authenticateToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken, isAdmin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/ban', banUser);
router.get('/metrics', getBusinessMetrics);
router.patch('/posts/:id/hide', hidePost);
router.delete('/posts/:id', deletePost);
router.delete('/comments/:id', deleteComment);

export default router;
