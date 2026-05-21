/**
 * SYNCRIG API Client Layer
 * Handles asynchronous communications with the Express Backend Server.
 * Supports token injection and client-side mock fallback.
 */

// On Vercel, requests to /api/v1/... will automatically route to the same origin's serverless function.
// For local development, we fallback to localhost:5000 if not on the same origin.
const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';
const API_BASE_URL = isLocal ? 'http://localhost:5000/api/v1' : '/api/v1';

let cachedToken = typeof window !== 'undefined' ? localStorage.getItem('syncrig_token') : null;

export function setToken(token) {
  cachedToken = token;
  if (token) {
    localStorage.setItem('syncrig_token', token);
  } else {
    localStorage.removeItem('syncrig_token');
  }
}

export function getToken() {
  return cachedToken;
}

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (cachedToken) {
    headers['Authorization'] = `Bearer ${cachedToken}`;
  }
  return headers;
}

// ─── AUTHENTICATION ───
export async function login(username, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ username, password })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '로그인 실패');
    setToken(json.data.access_token);
    return json.data;
  } catch (err) {
    console.error('[API Login Error]:', err.message);
    // Fallback Mock Login
    if (username && password) {
      const mockUser = { id: 'user-mock-id', provider: 'local', provider_id: username };
      const mockToken = 'mock_jwt_token_for_' + username;
      setToken(mockToken);
      return { access_token: mockToken, user: mockUser };
    }
    throw err;
  }
}

export async function register(username, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ username, password })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '회원가입 실패');
    setToken(json.data.access_token);
    return json.data;
  } catch (err) {
    console.error('[API Register Error]:', err.message);
    // Fallback Mock Register
    const mockUser = { id: 'user-mock-id', provider: 'local', provider_id: username };
    const mockToken = 'mock_jwt_token_for_' + username;
    setToken(mockToken);
    return { access_token: mockToken, user: mockUser };
  }
}

export async function oauthCallback(provider, code) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/${provider}/callback?code=${code}`, {
      headers: getHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'OAuth 연동 실패');
    setToken(json.data.access_token);
    return json.data;
  } catch (err) {
    console.error('[API OAuth Callback Error]:', err.message);
    const mockUser = { id: 'user-mock-id', provider, provider_id: `external_${provider}_${code}` };
    const mockToken = 'mock_jwt_token_for_' + mockUser.provider_id;
    setToken(mockToken);
    return { access_token: mockToken, user: mockUser };
  }
}

// ─── HARDWARE PROFILES ───
export async function fetchHardwareProfiles() {
  try {
    const res = await fetch(`${API_BASE_URL}/users/hardware-profiles`, {
      headers: getHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '사양 조회 실패');
    return json.data;
  } catch (err) {
    console.error('[API fetchHardwareProfiles Fallback]:', err.message);
    const saved = localStorage.getItem('hardware_profiles');
    return saved ? JSON.parse(saved) : [
      { id: 'hw-1', name: 'Main Gaming Rig', isDefault: true, cpu: 'AMD Ryzen 5 5600X', gpu: 'NVIDIA GeForce RTX 3060', ram: '16', resolution: 'FHD', refreshRate: '144' }
    ];
  }
}

export async function saveHardwareProfile(profile) {
  try {
    const body = {
      cpu_model: profile.cpu || profile.cpu_model,
      gpu_model: profile.gpu || profile.gpu_model,
      ram_gb: parseInt(profile.ram || profile.ram_gb),
      resolution: profile.resolution,
      refresh_rate: parseInt(profile.refreshRate || profile.refresh_rate),
      is_default: profile.isDefault || profile.is_default
    };

    const res = await fetch(`${API_BASE_URL}/users/hardware-profiles`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '사양 저장 실패');
    return json.data;
  } catch (err) {
    console.error('[API saveHardwareProfile Fallback]:', err.message);
    return { id: `hw-${Date.now()}`, ...profile };
  }
}

export async function setDefaultHardwareProfile(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/users/hardware-profiles/${id}/default`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '기본 설정 변경 실패');
    return json;
  } catch (err) {
    console.error('[API setDefaultHardwareProfile Fallback]:', err.message);
    return { status: 'success' };
  }
}

export async function deleteHardwareProfile(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/users/hardware-profiles/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '사양 삭제 실패');
    return json;
  } catch (err) {
    console.error('[API deleteHardwareProfile Fallback]:', err.message);
    return { status: 'success' };
  }
}

// ─── OPTIMIZATION RECOMMENDATIONS ───
export async function fetchRecommendations(userSpec, gameId = 'game_cyberpunk', threshold = 0.8) {
  try {
    const params = new URLSearchParams({
      cpu_model: userSpec.cpu_model || userSpec.cpu,
      gpu_model: userSpec.gpu_model || userSpec.gpu,
      ram_gb: (userSpec.ram_gb || userSpec.ram || 16).toString(),
      resolution: userSpec.resolution,
      game_id: gameId,
      threshold: threshold.toString()
    });

    const res = await fetch(`${API_BASE_URL}/profiles/recommendations?${params.toString()}`, {
      headers: getHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '추천 데이터 실패');
    return json.data;
  } catch (err) {
    console.error('[API fetchRecommendations Fallback]:', err.message);
    return getLocalMockRecommendations(userSpec);
  }
}

// ─── GAME LIBRARY SYNC ───
export async function syncGameLibrary() {
  try {
    const res = await fetch(`${API_BASE_URL}/games/library`, {
      headers: getHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '게임 동기화 실패');
    return json.data.games;
  } catch (err) {
    console.error('[API syncGameLibrary Fallback]:', err.message);
    return [
      { id: 1, title: 'Cyberpunk 2077', playtime: 124, lastPlayed: '2 hours ago', platform: 'Steam' },
      { id: 2, title: 'Valorant', playtime: 450, lastPlayed: 'Yesterday', platform: 'Riot Games' },
      { id: 3, title: 'Elden Ring', playtime: 89, lastPlayed: '3 days ago', platform: 'Steam' },
      { id: 4, title: 'The Witcher 3: Wild Hunt', playtime: 310, lastPlayed: '1 week ago', platform: 'Steam' }
    ];
  }
}

// Local mock data when backend is down
function getLocalMockRecommendations(userSpec) {
  const mockDatabase = [
    {
      id: 'opt_local_01',
      hardware: { cpu_model: 'AMD Ryzen 5 5600X', gpu_model: 'NVIDIA GeForce RTX 3060', resolution: 'FHD', ram_gb: 16 },
      settings: { '텍스처': '높음', '레이트레이싱': '끄기', '그림자': '보통', 'DLSS': '품질' },
      avg_fps: 63.4,
      game_version: 'v2.12',
      likes: 12,
      similarity_score: 0.96
    },
    {
      id: 'opt_local_02',
      hardware: { cpu_model: 'Intel Core i5-13400', gpu_model: 'NVIDIA GeForce RTX 3060', resolution: 'FHD', ram_gb: 16 },
      settings: { '텍스처': '높음', '레이트레이싱': '끄기', '그림자': '낮음', 'DLSS': '균형' },
      avg_fps: 59.8,
      game_version: 'v2.12',
      likes: 7,
      similarity_score: 0.90
    }
  ];
  
  const targetGpu = (userSpec.gpu_model || userSpec.gpu || '').toLowerCase();

  return {
    userSpec,
    recommendations: mockDatabase.filter(item => {
      const gpuMatches = targetGpu.includes('3060');
      const resMatches = userSpec.resolution.toUpperCase() === item.hardware.resolution;
      return gpuMatches && resMatches;
    })
  };
}
