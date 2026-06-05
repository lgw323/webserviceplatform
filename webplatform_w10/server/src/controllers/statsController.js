export const getTopTierStats = async (req, res, next) => {
  try {
    // Mock top 1% stats data for premium users
    const statsData = {
      cpu_score: {
        user: 8500,
        top_1_percent: 12000,
        average: 7000
      },
      gpu_score: {
        user: 11000,
        top_1_percent: 18000,
        average: 8500
      },
      insights: [
        "상위 1% 유저들은 주로 NVIDIA RTX 4090을 사용합니다.",
        "현재 CPU 성능이 전체 상위 25% 이내에 속합니다."
      ]
    };

    res.json({
      success: true,
      data: statsData
    });
  } catch (err) {
    next(err);
  }
};
