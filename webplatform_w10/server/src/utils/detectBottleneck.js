// A simple mock utility for TDD demonstration.
// In reality, this would query a hardware performance DB.

const CPU_SCORES = {
  'i3-10100': 30,
  'i5-13600K': 85,
  'i9-13900K': 98
};

const GPU_SCORES = {
  'GTX 1050': 20,
  'RTX 3060': 60,
  'RTX 4090': 100
};

export const detectBottleneck = (hardware) => {
  const cpuScore = CPU_SCORES[hardware.cpu] || 50; // Default to mid-range
  const gpuScore = GPU_SCORES[hardware.gpu] || 50; // Default to mid-range

  // A bottleneck is when one component score is significantly lower than the other
  const difference = cpuScore - gpuScore;

  if (difference < -40) {
    // CPU score is way lower than GPU
    return {
      component: 'cpu',
      reason: `강력한 GPU(${hardware.gpu}) 성능을 CPU(${hardware.cpu})가 온전히 받쳐주지 못하는 병목이 예상됩니다.`
    };
  }

  if (difference > 40) {
    // GPU score is way lower than CPU
    return {
      component: 'gpu',
      reason: `고성능 CPU(${hardware.cpu}) 환경에서 현재 GPU(${hardware.gpu})가 병목 지점입니다.`
    };
  }

  return {
    component: 'none',
    reason: '부품 간 밸런스가 좋습니다.'
  };
};
