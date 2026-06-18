import { create } from 'zustand';
import * as api from '../api/apiClient';

const useAuthStore = create((set, get) => ({
  user: null,
  userSpec: null,
  gameLibrary: [],
  achievementsCount: 0,
  isLoading: true, // initial loading state

  // Initialize session from token
  initialize: async () => {
    const token = api.getToken();
    if (!token) {
      set({ user: null, isLoading: false });
      return;
    }

    let sessionUser = { id: 'user-mock-id', provider: 'local', provider_id: 'User' };
    try {
      // Decode JWT token payload safely with UTF-8 support
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      sessionUser = { 
        id: payload.id, 
        email: payload.email,
        nickname: payload.nickname,
        role: payload.role || 'user',
        provider: payload.provider, 
        provider_id: payload.provider_id,
        steam_id: payload.steam_id || null,
        riot_id: payload.riot_id || null,
        subscription_status: payload.subscription_status || 'free',
        linked_providers: payload.linked_providers || []
      };
    } catch(e) {
      console.error('Failed to parse token payload, falling back to mock user:', e);
      const isSteam = token.includes('steam');
      const isRiot = token.includes('riot');
      const provider = isSteam ? 'steam' : isRiot ? 'riot' : 'local';
      const providerId = token.replace('mock_jwt_token_for_', '');
      sessionUser = { id: 'user-mock-id', email: null, nickname: 'MockUser', role: 'user', provider, provider_id: providerId, steam_id: null, riot_id: null, linked_providers: [] };
    }
    
    // JWT 페이로드에 연동 정보가 있으면 사용하고, localStorage와 동기화합니다.
    const finalLinked = sessionUser.linked_providers || [];
      
    localStorage.setItem('syncrig_linked_providers', JSON.stringify(finalLinked));
    sessionUser.linked_providers = finalLinked;
    
    set({ user: sessionUser, isLoading: false });
    await get().fetchUserData();
  },

  fetchUserData: async () => {
    const { user } = get();
    if (!user) return;

    // 1. Fetch hardware profile
    try {
      const profiles = await api.fetchHardwareProfiles();
      const defaultProfile = profiles.find(p => p.is_default || p.isDefault) || profiles[0];
      if (defaultProfile) {
        set({
          userSpec: {
            cpu_model: defaultProfile.cpu_model || defaultProfile.cpu,
            gpu_model: defaultProfile.gpu_model || defaultProfile.gpu,
            ram_gb: parseInt(defaultProfile.ram_gb || defaultProfile.ram) || 16,
            resolution: defaultProfile.resolution,
            refresh_rate: parseInt(defaultProfile.refresh_rate || defaultProfile.refreshRate) || 144
          }
        });
      } else {
        set({ userSpec: null });
      }
    } catch (e) {
      console.error('Failed to load hardware profiles', e);
      set({ userSpec: null });
    }

    // 2. Fetch game library based on linked providers
    const linkedProviders = user.linked_providers || [];
    const providersList = [...linkedProviders];
    // Include the login provider if it's a social one
    if ((user.provider === 'steam' || user.provider === 'riot') && !providersList.includes(user.provider)) {
      providersList.push(user.provider);
    }

    const manualGames = JSON.parse(localStorage.getItem('syncrig_manual_games') || '[]');

    if (providersList.length > 0) {
      try {
        const games = await api.syncGameLibrary(providersList);
        const mergedGames = [...games];
        manualGames.forEach(mg => {
          if (!mergedGames.some(g => String(g.id) === String(mg.id) || g.title === mg.title)) {
            mergedGames.push(mg);
          }
        });
        
        const totalAchievements = mergedGames.reduce((sum, g) => sum + (g.achievementsCount !== undefined ? g.achievementsCount : Math.round((g.playtime || g.hours || 0) * 0.88)), 0);
        set({ gameLibrary: mergedGames, achievementsCount: totalAchievements });
      } catch (e) {
        console.error('Failed to sync games', e);
        const totalAchievements = manualGames.reduce((sum, g) => sum + (g.achievementsCount !== undefined ? g.achievementsCount : Math.round((g.playtime || g.hours || 0) * 0.88)), 0);
        set({ gameLibrary: manualGames, achievementsCount: totalAchievements });
      }
    } else {
      const totalAchievements = manualGames.reduce((sum, g) => sum + (g.achievementsCount !== undefined ? g.achievementsCount : Math.round((g.playtime || g.hours || 0) * 0.88)), 0);
      set({ gameLibrary: manualGames, achievementsCount: totalAchievements });
    }
  },

  setUser: (user) => set({ user }),
  
  setUserSpec: (userSpec) => set({ userSpec }),
  
  logout: () => {
    api.setToken(null);
    localStorage.removeItem('syncrig_linked_providers');
    localStorage.removeItem('syncrig_manual_games');
    set({ user: null, userSpec: null, gameLibrary: [], achievementsCount: 0 });
  },

  syncAccount: async (provider) => {
    const { user } = get();
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newLinked = Array.from(new Set([...(user.linked_providers || []), provider]));
    localStorage.setItem('syncrig_linked_providers', JSON.stringify(newLinked));
    
    set(state => ({
      user: { ...state.user, linked_providers: newLinked }
    }));
    
    // Re-fetch games with updated provider list
    try {
      const games = await api.syncGameLibrary(newLinked);
      const manualGames = JSON.parse(localStorage.getItem('syncrig_manual_games') || '[]');
      const mergedGames = [...games];
      manualGames.forEach(mg => {
        if (!mergedGames.some(g => String(g.id) === String(mg.id) || g.title === mg.title)) {
          mergedGames.push(mg);
        }
      });
      const totalAchievements = mergedGames.reduce((sum, g) => sum + (g.achievementsCount !== undefined ? g.achievementsCount : Math.round((g.playtime || g.hours || 0) * 0.88)), 0);
      set({ gameLibrary: mergedGames, achievementsCount: totalAchievements });
    } catch (err) {
      console.error('Sync failed', err);
      throw err;
    }
  },

  unlinkAccount: async (provider) => {
    try {
      const data = await api.unlinkAccount(provider);
      set({ user: data.user });
      
      const newLinked = data.user.linked_providers || [];
      localStorage.setItem('syncrig_linked_providers', JSON.stringify(newLinked));

      const manualGames = JSON.parse(localStorage.getItem('syncrig_manual_games') || '[]');
      if (newLinked.length > 0 || data.user.provider === 'steam' || data.user.provider === 'riot') {
        const games = await api.syncGameLibrary(newLinked);
        const mergedGames = [...games];
        manualGames.forEach(mg => {
          if (!mergedGames.some(g => String(g.id) === String(mg.id) || g.title === mg.title)) {
            mergedGames.push(mg);
          }
        });
        const totalAchievements = mergedGames.reduce((sum, g) => sum + (g.achievementsCount !== undefined ? g.achievementsCount : Math.round((g.playtime || g.hours || 0) * 0.88)), 0);
        set({ gameLibrary: mergedGames, achievementsCount: totalAchievements });
      } else {
        const totalAchievements = manualGames.reduce((sum, g) => sum + (g.achievementsCount !== undefined ? g.achievementsCount : Math.round((g.playtime || g.hours || 0) * 0.88)), 0);
        set({ gameLibrary: manualGames, achievementsCount: totalAchievements });
      }
    } catch (err) {
      console.error('Unlink failed', err);
      throw err;
    }
  },

  addManualGame: async (game) => {
    const manualGames = JSON.parse(localStorage.getItem('syncrig_manual_games') || '[]');
    if (!manualGames.some(mg => String(mg.id) === String(game.id))) {
      manualGames.push(game);
      localStorage.setItem('syncrig_manual_games', JSON.stringify(manualGames));
    }
    await get().fetchUserData();
  },

  removeManualGame: async (gameId) => {
    const manualGames = JSON.parse(localStorage.getItem('syncrig_manual_games') || '[]');
    const filtered = manualGames.filter(mg => String(mg.id) !== String(gameId));
    localStorage.setItem('syncrig_manual_games', JSON.stringify(filtered));
    await get().fetchUserData();
  }
}));

export default useAuthStore;
