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
