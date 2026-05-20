/**
 * SYNCRIG API Client Layer
 * Handles asynchronous communications with the Express Backend Server.
 */

const API_BASE_URL = 'http://localhost:5000/api/v1';

/**
 * Fetches matching optimization profiles for the user spec.
 * Converts spec parameters to query strings.
 */
export async function fetchRecommendations(userSpec, gameId = 'game_cyberpunk', threshold = 0.85) {
  try {
    const params = new URLSearchParams({
      cpu_model: userSpec.cpu_model,
      gpu_model: userSpec.gpu_model,
      ram_gb: userSpec.ram_gb.toString(),
      resolution: userSpec.resolution,
      game_id: gameId,
      threshold: threshold.toString()
    });

    const response = await fetch(`${API_BASE_URL}/profiles/recommendations?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`[SYNCRIG API HTTP Error] Status code: ${response.status}`);
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error('추천 데이터 패치 중 에러 발생:', error);
    
    // Fallback: If backend server is down during local practice, return client-side local matching results.
    console.log('[SYNCRIG API] 백엔드 오프라인으로 인한 클라이언트 측 대체 데이터 반환.');
    return getLocalMockRecommendations(userSpec);
  }
}

// Local Fallback simulation for offline frontend-only development
function getLocalMockRecommendations(userSpec) {
  const mockDatabase = [
    {
      id: "opt_local_01",
      hardware: { cpu: "AMD Ryzen 5 5600X", gpu: "NVIDIA GeForce RTX 3060", resolution: "FHD" },
      settings: { "텍스처": "높음", "레이트레이싱": "끄기", "그림자": "보통", "DLSS": "품질" },
      avg_fps: 63.4,
      game_version: "v2.12",
      likes: 12,
      similarity_score: 0.96
    },
    {
      id: "opt_local_02",
      hardware: { cpu: "Intel Core i5-13400", gpu: "NVIDIA GeForce RTX 3060", resolution: "FHD" },
      settings: { "텍스처": "높음", "레이트레이싱": "끄기", "그림자": "낮음", "DLSS": "균형" },
      avg_fps: 59.8,
      game_version: "v2.12",
      likes: 7,
      similarity_score: 0.90
    }
  ];
  
  return {
    userSpec,
    recommendations: mockDatabase.filter(item => {
      const gpuMatches = userSpec.gpu_model.toLowerCase().includes("3060");
      const resMatches = userSpec.resolution.toUpperCase() === item.hardware.resolution;
      return gpuMatches && resMatches;
    })
  };
}
