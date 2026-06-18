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
      let queryText = `
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
      `;
      let queryParams = [];
      if (game_id) {
        // game_id가 UUID 형식인지 확인하여 다르게 쿼리 구성 (PostgreSQL 타입 변환 에러 방지)
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(game_id);
        if (isUuid) {
          queryText += ' WHERE op.game_id = $1 OR g.external_app_id = $1';
        } else {
          queryText += ' WHERE g.external_app_id = $1';
        }
        queryParams.push(game_id);
      }
      const profilesResult = await db.query(queryText, queryParams);
      dbProfiles = profilesResult.rows;
    } else {
      let filtered = [...MOCK_DB.optimization_profiles];
      if (game_id) {
        const game = MOCK_DB.games.find(g => g.id === game_id || g.external_app_id === game_id.toString());
        if (game) {
          filtered = filtered.filter(op => op.game_id === game.id);
        } else {
          filtered = filtered.filter(op => op.game_id === game_id);
        }
      }
      dbProfiles = filtered.map(op => {
        const game = MOCK_DB.games.find(g => g.id === op.game_id);
        const hp = MOCK_DB.hardware_profiles.find(h => h.id === op.hardware_id);
        return {
          ...op,
          game: game ? { id: game.id, title: game.title, external_app_id: game.external_app_id } : null,
          hardware: hp ? { cpu_model: hp.cpu_model, gpu_model: hp.gpu_model, ram_gb: hp.ram_gb, resolution: hp.resolution, refresh_rate: hp.refresh_rate } : op.hardware
        };
      });
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
