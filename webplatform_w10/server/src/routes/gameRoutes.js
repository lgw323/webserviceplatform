import express from 'express';
import { getGameLibrary } from '../controllers/gameController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);
router.get('/library', getGameLibrary);

export default router;
