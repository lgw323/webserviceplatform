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

    let dbProfiles = [];
    if (db.isPgActive()) {
      const profilesResult = await db.query(`
        SELECT op.*, 
               json_build_object(
                 'id', g.id,
                 'title', g.title,
                 'external_app_id', g.external_app_id
               ) as game,
               json_build_object(
                 'cpu_model', hp.cpu_model,
                 'gpu_model', hp.gpu_model,
                 'ram_gb', hp.ram_gb,
                 'resolution', hp.resolution,
                 'refresh_rate', hp.refresh_rate
               ) as hardware
        FROM optimization_profiles op
        LEFT JOIN hardware_profiles hp ON op.hardware_id = hp.id
        LEFT JOIN games g ON op.game_id = g.id
      `);
      dbProfiles = profilesResult.rows;
    } else {
      const profilesResult = await db.query('SELECT * FROM optimization_profiles');
      dbProfiles = profilesResult.rows;
    }

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
