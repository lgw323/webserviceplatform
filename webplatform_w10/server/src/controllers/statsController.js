import { db } from '../config/db.js';
import { parseCpuScore, parseGpuScore } from '../services/matchingEngine.js';

export const getTopTierStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 1. Fetch user's default hardware profile
    const userProfileRes = await db.query(
      'SELECT cpu_model, gpu_model FROM hardware_profiles WHERE user_id = $1 AND is_default = true LIMIT 1',
      [userId]
    );
    const userProfile = userProfileRes.rows[0];

    // 2. Fetch all hardware profiles in the system
    const allProfilesRes = await db.query('SELECT cpu_model, gpu_model FROM hardware_profiles');
    const allProfiles = allProfilesRes.rows || [];

    // 3. Compute baseline tier scores (0 - 100 scale)
    const cpuScores = allProfiles.map(p => parseCpuScore(p.cpu_model || ''));
    const gpuScores = allProfiles.map(p => parseGpuScore(p.gpu_model || ''));

    // Fallbacks if database is empty
    const totalCpuCount = cpuScores.length || 1;
    const totalGpuCount = gpuScores.length || 1;

    const userCpuScore = userProfile ? parseCpuScore(userProfile.cpu_model || '') : 0;
    const userGpuScore = userProfile ? parseGpuScore(userProfile.gpu_model || '') : 0;

    // 4. Translate to Geekbench / 3DMark scale (CPU * 120, GPU * 180)
    const cpuUser = userCpuScore * 120;
    const gpuUser = userGpuScore * 180;

    // Determine top 1% (maximum score in catalog) and average
    const cpuTop1Percent = Math.max(...cpuScores, 100) * 120;
    const gpuTop1Percent = Math.max(...gpuScores, 100) * 180;

    const cpuAverage = Math.round((cpuScores.reduce((sum, s) => sum + s, 0) / totalCpuCount) * 120);
    const gpuAverage = Math.round((gpuScores.reduce((sum, s) => sum + s, 0) / totalGpuCount) * 180);

    // 5. Compute dynamic insights
    const insights = [];
    if (!userProfile) {
      insights.push("분석을 위해 하드웨어 프로필을 등록해주세요.");
    } else {
      // Find top GPU model among high-end configurations (score >= 80)
      const highEndGpus = allProfiles
        .filter(p => parseGpuScore(p.gpu_model || '') >= 80)
        .map(p => p.gpu_model);
      
      let topGpuName = "NVIDIA GeForce RTX 4090";
      if (highEndGpus.length > 0) {
        const counts = {};
        highEndGpus.forEach(g => counts[g] = (counts[g] || 0) + 1);
        topGpuName = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
      }
      
      // Calculate user's CPU percentile rank
      const betterCpuCount = cpuScores.filter(s => s > userCpuScore).length;
      const cpuPercentile = Math.max(1, Math.round((betterCpuCount / totalCpuCount) * 100));

      insights.push(`상위 1% 유저들은 주로 ${topGpuName}을 사용합니다.`);
      insights.push(`현재 CPU 성능이 전체 상위 ${cpuPercentile}% 이내에 속합니다.`);
    }

    const statsData = {
      cpu_score: {
        user: cpuUser,
        top_1_percent: cpuTop1Percent,
        average: cpuAverage
      },
      gpu_score: {
        user: gpuUser,
        top_1_percent: gpuTop1Percent,
        average: gpuAverage
      },
      insights
    };

    res.json({
      success: true,
      data: statsData
    });
  } catch (err) {
    next(err);
  }
};
