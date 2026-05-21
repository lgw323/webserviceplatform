import express from 'express';
import { getHardwareProfiles, createHardwareProfile, setDefaultProfile, deleteProfile } from '../controllers/profileController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getHardwareProfiles);
router.post('/', createHardwareProfile);
router.patch('/:id/default', setDefaultProfile);
router.delete('/:id', deleteProfile);

export default router;
