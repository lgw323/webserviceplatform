import axios from 'axios';

const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';
const API_BASE_URL = isLocal ? 'http://localhost:5000/api/v1' : '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

let cachedToken = typeof window !== 'undefined' ? localStorage.getItem('syncrig_token') : null;

export function setToken(token) {
  cachedToken = token;
  if (token) {
    localStorage.setItem('syncrig_token', token);
  } else {
    localStorage.removeItem('syncrig_token');
  }
}

export function setRefreshToken(token) {
  if (token) {
    localStorage.setItem('syncrig_refresh_token', token);
  } else {
    localStorage.removeItem('syncrig_refresh_token');
  }
}

export function getToken() {
  return cachedToken;
}

// Request Interceptor
apiClient.interceptors.request.use((config) => {
  if (cachedToken) {
    config.headers['Authorization'] = `Bearer ${cachedToken}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response Interceptor — Refresh Token 자동 갱신
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use((response) => response, async (error) => {
  const originalRequest = error.config;

  if (error.response && error.response.status === 401 && cachedToken && !originalRequest._retry) {
    const refreshToken = localStorage.getItem('syncrig_refresh_token');

    if (!refreshToken) {
      // Refresh token 없음 → 완전 로그아웃
      setToken(null);
      setRefreshToken(null);
      localStorage.removeItem('syncrig_linked_providers');
      window.location.href = '/';
      return Promise.reject(error.response?.data || error);
    }

    if (isRefreshing) {
      // 이미 갱신 중이면 큐에 추가
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return apiClient(originalRequest);
      }).catch(err => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refresh_token: refreshToken });
      const newAccessToken = data.data.access_token;
      setToken(newAccessToken);
      processQueue(null, newAccessToken);
      originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      setToken(null);
      setRefreshToken(null);
      localStorage.removeItem('syncrig_linked_providers');
      window.location.href = '/';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  // 토큰이 없는 상태(로그인 시도 실패 등) — 에러를 그대로 throw
  if (error.response && error.response.status === 401 && !cachedToken) {
    return Promise.reject(error.response?.data || error);
  }

  return Promise.reject(error.response?.data || error);
});

// ─── AUTHENTICATION ───
export async function login(email, password) {
  const { data } = await apiClient.post('/auth/login', { email, password });
  setToken(data.data.access_token);
  if (data.data.refresh_token) setRefreshToken(data.data.refresh_token);
  return data.data;
}

export async function register(email, nickname, password) {
  const { data } = await apiClient.post('/auth/register', { email, nickname, password });
  setToken(data.data.access_token);
  if (data.data.refresh_token) setRefreshToken(data.data.refresh_token);
  return data.data;
}

export async function sendVerificationCode(email) {
  const { data } = await apiClient.post('/auth/send-code', { email });
  return data;
}

export async function verifyEmailCode(email, code) {
  const { data } = await apiClient.post('/auth/verify-code', { email, code });
  return data;
}

export async function oauthCallback(provider, code) {
  const { data } = await apiClient.get(`/auth/${provider}/callback?code=${code}`);
  setToken(data.data.access_token);
  return data.data;
}

// ─── ADMIN ───
export async function getStats() {
  const { data } = await apiClient.get('/stats');
  return data.data;
}

// ─── COMMUNITY ───
export async function getPosts() {
  const { data } = await apiClient.get('/posts');
  return data.data;
}

export async function getPostById(id) {
  const { data } = await apiClient.get(`/posts/${id}`);
  return data.data;
}

export async function createPost(title, content) {
  const { data } = await apiClient.post('/posts', { title, content });
  return data.data;
}

export async function createComment(postId, content) {
  const { data } = await apiClient.post(`/posts/${postId}/comments`, { content });
  return data.data;
}

// ─── HARDWARE PROFILES ───
export async function fetchHardwareProfiles() {
  const { data } = await apiClient.get('/users/hardware-profiles');
  return data.data;
}

export async function saveHardwareProfile(profile) {
  const body = {
    cpu_model: profile.cpu || profile.cpu_model,
    gpu_model: profile.gpu || profile.gpu_model,
    ram_gb: parseInt(profile.ram || profile.ram_gb),
    resolution: profile.resolution,
    refresh_rate: parseInt(profile.refreshRate || profile.refresh_rate),
    is_default: profile.isDefault || profile.is_default
  };
  const { data } = await apiClient.post('/users/hardware-profiles', body);
  return data.data;
}

export async function setDefaultHardwareProfile(id) {
  const { data } = await apiClient.patch(`/users/hardware-profiles/${id}/default`);
  return data;
}

export async function deleteHardwareProfile(id) {
  const { data } = await apiClient.delete(`/users/hardware-profiles/${id}`);
  return data;
}

// ─── OPTIMIZATION RECOMMENDATIONS ───
export async function fetchRecommendations(userSpec, gameId = 'game_cyberpunk', threshold = 0.8) {
  const params = new URLSearchParams({
    cpu_model: userSpec.cpu_model || userSpec.cpu,
    gpu_model: userSpec.gpu_model || userSpec.gpu,
    ram_gb: (userSpec.ram_gb || userSpec.ram || 16).toString(),
    resolution: userSpec.resolution,
    game_id: gameId,
    threshold: threshold.toString()
  });

  const { data } = await apiClient.get(`/profiles/recommendations?${params.toString()}`);
  return data.data;
}

// ─── GAME LIBRARY SYNC ───
export async function syncGameLibrary(providers = []) {
  const params = providers.length > 0 ? `?providers=${providers.join(',')}` : '';
  const { data } = await apiClient.get(`/games/library${params}`);
  return data.data.games;
}

export async function unlinkAccount(provider) {
  const { data } = await apiClient.delete(`/auth/unlink/${provider}`);
  setToken(data.data.access_token);
  if (data.data.refresh_token) setRefreshToken(data.data.refresh_token);
  return data.data;
}

export default apiClient;
