// GPU Generation and tier mapping for simplified matching
const GPU_TIERS = {
  '4090': 100, '7900 xtx': 98, '4080': 90, '7900 xt': 88, '4070 ti': 85, '4070': 80, 
  '6800 xt': 78, '4060': 70, '3090': 85, '3080': 75, '6700 xt': 70, '3070': 65, 
  '3060': 55, '4050': 50, '3050': 45, '2080': 50, '2070': 45, '2060': 35, 
  '1660': 30, '1050': 15, '570': 15
};

const CPU_TIERS = {
  '7950x': 100, '14900k': 100, '13900k': 95, '7800x': 95, '14700k': 90, '13700k': 85, 
  '7700x': 85, '14600k': 80, '13600k': 75, '7600x': 75, '12400f': 65, '5800x': 70, 
  '5600x': 60, '12100f': 50, '3600': 45, '10400f': 40, '3100': 25
};

export function parseGpuScore(gpuName) {
  const nameLower = gpuName.toLowerCase();
  for (const [key, val] of Object.entries(GPU_TIERS)) {
    if (nameLower.includes(key)) return val;
  }
  return 50; // default medium score
}

export function parseCpuScore(cpuName) {
  const nameLower = cpuName.toLowerCase();
  for (const [key, val] of Object.entries(CPU_TIERS)) {
    if (nameLower.includes(key)) return val;
  }
  return 50; // default medium score
}

export function calculateSimilarity(userSpec, dbSpec) {
  let score = 0;

  // 1. GPU (50% weight)
  const userGpuScore = parseGpuScore(userSpec.gpu_model || '');
  const dbGpuScore = parseGpuScore(dbSpec.gpu_model || dbSpec.gpu || '');
  const gpuDiff = Math.abs(userGpuScore - dbGpuScore);
  const gpuSimilarity = Math.max(0, 1 - gpuDiff / 100);
  score += gpuSimilarity * 0.5;

  // 2. CPU (30% weight)
  const userCpuScore = parseCpuScore(userSpec.cpu_model || '');
  const dbCpuScore = parseCpuScore(dbSpec.cpu_model || dbSpec.cpu || '');
  const cpuDiff = Math.abs(userCpuScore - dbCpuScore);
  const cpuSimilarity = Math.max(0, 1 - cpuDiff / 100);
  score += cpuSimilarity * 0.3;

  // 3. RAM (10% weight)
  const userRam = parseInt(userSpec.ram_gb) || 16;
  const dbRam = parseInt(dbSpec.ram_gb || dbSpec.ram) || 16;
  const ramDiff = Math.abs(userRam - dbRam);
  const ramSimilarity = ramDiff === 0 ? 1.0 : Math.max(0, 1 - ramDiff / 32);
  score += ramSimilarity * 0.1;

  // 4. Resolution (10% weight)
  const userRes = (userSpec.resolution || '').toUpperCase();
  const dbRes = (dbSpec.resolution || '').toUpperCase();
  const resMatches = userRes === dbRes;
  score += (resMatches ? 1.0 : 0.5) * 0.1;

  return Number(score.toFixed(4));
}

export function getRecommendedProfiles(userSpec, dbProfiles, threshold = 0.8) {
  return dbProfiles
    .map(profile => {
      const similarity_score = calculateSimilarity(userSpec, profile.hardware);
      return {
        ...profile,
        settings: profile.settings || profile.settings_json || {},
        similarity_score
      };
    })
    .filter(profile => profile.similarity_score >= threshold)
    .sort((a, b) => b.similarity_score - a.similarity_score || b.likes - a.likes);
}
