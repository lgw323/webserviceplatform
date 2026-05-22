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
    console.error('[API Login Error]:', err.message);
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
    console.error('[API Register Error]:', err.message);
    throw err;
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
    console.error('[API OAuth Callback Error]:', err.message);
    throw err;
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
    console.error('[API fetchHardwareProfiles Error]:', err.message);
    throw err;
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
    console.error('[API saveHardwareProfile Error]:', err.message);
    throw err;
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
    console.error('[API setDefaultHardwareProfile Error]:', err.message);
    throw err;
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
    console.error('[API deleteHardwareProfile Error]:', err.message);
    throw err;
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
    console.error('[API fetchRecommendations Error]:', err.message);
    throw err;
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
    console.error('[API syncGameLibrary Error]:', err.message);
    throw err;
  }
}

