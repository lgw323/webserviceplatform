import { db } from '../config/db.js';
import { getRecommendedProfiles as getRecProfiles } from '../services/matchingEngine.js';

export const getRecommendations = async (req, res, next) => {
  try {
    const { cpu_model, gpu_model, ram_gb, resolution, game_id, threshold } = req.query;

    const userSpec = {
      cpu_model: cpu_model || '',
      gpu_model: gpu_model || '',
      ram_gb: parseInt(ram_gb) || 16,
      resolution: resolution || 'FHD'
    };

    const targetThreshold = parseFloat(threshold) || 0.8;

    const profilesResult = await db.query('SELECT * FROM optimization_profiles');
    const dbProfiles = profilesResult.rows;

    const recommendations = getRecProfiles(userSpec, dbProfiles, targetThreshold);

    res.json({
      status: 'success',
      data: {
        userSpec,
        recommendations
      }
    });
  } catch (err) {
    next(err);
  }
};

import { detectBottleneck } from '../utils/detectBottleneck.js';

export const getAds = async (req, res, next) => {
  try {
    // In reality, hardware info should come from req.user or req.query
    // For TDD, let's assume it comes from req.user.hardware
    const hardware = req.user?.hardware || { cpu: 'i5-13600K', gpu: 'RTX 3060', ram: '16GB' };
    
    const bottleneck = detectBottleneck(hardware);
    
    let ad = null;
    
    if (bottleneck.component === 'cpu') {
      ad = {
        type: 'cpu',
        title: '성능 병목 해결! CPU 업그레이드 추천',
        description: bottleneck.reason,
        link: 'https://example.com/cpu-upgrade',
        imageUrl: '/images/ads/cpu.png'
      };
    } else if (bottleneck.component === 'gpu') {
      ad = {
        type: 'gpu',
        title: '프레임 드랍 해결! 최신 GPU 추천',
        description: bottleneck.reason,
        link: 'https://example.com/gpu-upgrade',
        imageUrl: '/images/ads/gpu.png'
      };
    } else {
      ad = {
        type: 'general',
        title: '게이밍 기어 업그레이드 추천',
        description: '더 나은 게이밍 환경을 위한 모니터/키보드를 확인해보세요.',
        link: 'https://example.com/gear',
        imageUrl: '/images/ads/gear.png'
      };
    }

    res.json({
      success: true,
      ad
    });
  } catch (err) {
    next(err);
  }
};
