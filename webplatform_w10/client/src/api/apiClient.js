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
      setToken(null);
      setRefreshToken(null);
      localStorage.removeItem('syncrig_linked_providers');
      window.location.href = '/';
      return Promise.reject(error.response?.data || error);
    }

    if (isRefreshing) {
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

export async function updateNickname(nickname) {
  const { data } = await apiClient.patch('/users/me/nickname', { nickname });
  return data.data;
}

// ─── COMMUNITY POSTS ───
export async function getPosts(category = 'all', page = 1, sort = 'latest') {
  const params = new URLSearchParams({ page: page.toString(), sort });
  if (category && category !== 'all') params.append('category', category);
  const { data } = await apiClient.get(`/posts?${params.toString()}`);
  return data;
}

export async function getPostById(id) {
  const { data } = await apiClient.get(`/posts/${id}`);
  return data.data;
}

export async function createPost(title, content, category = 'free') {
  const { data } = await apiClient.post('/posts', { title, content, category });
  return data.data;
}

export async function updatePost(id, title, content, category) {
  const { data } = await apiClient.put(`/posts/${id}`, { title, content, category });
  return data.data;
}

export async function deletePost(id) {
  const { data } = await apiClient.delete(`/posts/${id}`);
  return data;
}

export async function togglePostLike(id) {
  const { data } = await apiClient.post(`/posts/${id}/like`);
  return data.data;
}

export async function createComment(postId, content) {
  const { data } = await apiClient.post(`/posts/${postId}/comments`, { content });
  return data.data;
}

export async function deleteComment(commentId) {
  const { data } = await apiClient.delete(`/posts/comments/${commentId}`);
  return data;
}

// ─── ADMIN ───
export async function getStats() {
  const { data } = await apiClient.get('/stats');
  return data.data;
}

export async function getAdminStats() {
  const { data } = await apiClient.get('/admin/stats');
  return data.data;
}

export async function getAdminPosts() {
  const { data } = await apiClient.get('/admin/posts');
  return data;
}

export async function getAdminUsers(search = '', filter = '') {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (filter) params.append('filter', filter);
  const { data } = await apiClient.get(`/admin/users?${params.toString()}`);
  return data.data;
}

export async function updateUserRole(userId, role) {
  const { data } = await apiClient.patch(`/admin/users/${userId}/role`, { role });
  return data;
}

export async function toggleUserBan(userId, is_banned) {
  const { data } = await apiClient.patch(`/admin/users/${userId}/ban`, { is_banned });
  return data;
}

export async function togglePostVisibility(postId, is_hidden) {
  const { data } = await apiClient.patch(`/admin/posts/${postId}/hide`, { is_hidden });
  return data;
}

export async function deletePostByAdmin(id) {
  const { data } = await apiClient.delete(`/admin/posts/${id}`);
  return data;
}

export async function deleteCommentByAdmin(id) {
  const { data } = await apiClient.delete(`/admin/comments/${id}`);
  return data;
}

export async function getBusinessMetrics() {
  const { data } = await apiClient.get('/admin/metrics');
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

export async function searchCatalog(type, q) {
  const { data } = await apiClient.get(`/catalog/search?type=${type}&q=${q}`);
  return data.data;
}

// ─── OPTIMIZATION RECOMMENDATIONS ───
export async function fetchRecommendations(userSpec, gameId = '550e8400-e29b-41d4-a716-446655440001', threshold = 0.8) {
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
