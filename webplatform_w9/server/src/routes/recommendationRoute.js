import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getRecommendedProfiles } from './matchingEngine.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load mock dataset helper
const getMockProfiles = () => {
  const filePath = path.join(__dirname, 'mockData.json');
  const fileData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileData);
};

/**
 * GET /api/v1/profiles/recommendations
 * Query Parameters: cpu_model, gpu_model, ram_gb, resolution, game_id, threshold
 */
router.get('/recommendations', (req, res) => {
  try {
    const { cpu_model, gpu_model, ram_gb, resolution, game_id, threshold } = req.query;

    if (!cpu_model || !gpu_model || !ram_gb || !resolution) {
      return res.status(400).json({
        status: 'error',
        message: '유사도를 계산하기 위해 사용자의 하드웨어 세부 정보(cpu_model, gpu_model, ram_gb, resolution)가 필수로 필요합니다.'
      });
    }

    const userSpec = {
      cpu_model,
      gpu_model,
      ram_gb: parseInt(ram_gb, 10),
      resolution
    };

    const allProfiles = getMockProfiles();
    
    // Filter profiles by game_id if provided
    const targetProfiles = game_id 
      ? allProfiles.filter(p => p.game_id === game_id)
      : allProfiles;

    const thresholdVal = threshold ? parseFloat(threshold) : 0.85;
    const recommendations = getRecommendedProfiles(userSpec, targetProfiles, thresholdVal);

    res.json({
      status: 'success',
      data: {
        userSpec,
        recommendations
      }
    });
  } catch (error) {
    console.error('[SYNCRIG Engine Error]', error);
    res.status(500).json({
      status: 'error',
      message: '유사도 추천 결과를 산출하는 도중 에러가 발생했습니다.'
    });
  }
});

export default router;
