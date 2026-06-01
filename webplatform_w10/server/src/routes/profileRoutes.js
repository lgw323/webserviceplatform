import express from 'express';
import { body, validationResult } from 'express-validator';
import { getHardwareProfiles, createHardwareProfile, setDefaultProfile, deleteProfile } from '../controllers/profileController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'error', message: errors.array()[0].msg });
  }
  next();
};

const profileRules = [
  body('cpu_model').trim().notEmpty().withMessage('CPU 모델명을 입력해주세요.'),
  body('gpu_model').trim().notEmpty().withMessage('GPU 모델명을 입력해주세요.'),
  body('ram_gb').isInt({ min: 4, max: 256 }).withMessage('유효한 RAM 용량을 입력해주세요 (4~256).'),
  body('resolution').isIn(['FHD', 'QHD', '4K']).withMessage('해상도는 FHD, QHD, 4K 중 하나여야 합니다.'),
  body('refresh_rate').isInt({ min: 30, max: 500 }).withMessage('유효한 주사율을 입력해주세요 (30~500).')
];

router.get('/', getHardwareProfiles);
router.post('/', profileRules, validateRequest, createHardwareProfile);
router.patch('/:id/default', setDefaultProfile);
router.delete('/:id', deleteProfile);

export default router;
