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
      const payload = JSON.parse(atob(token.split('.')[1]));
      sessionUser = { 
        id: payload.id, 
        provider: payload.provider, 
        provider_id: payload.provider_id,
        subscription_status: payload.subscription_status || 'free',
        linked_providers: payload.linked_providers || []
      };
    } catch(e) {
      const isSteam = token.includes('steam');
      const isRiot = token.includes('riot');
      const provider = isSteam ? 'steam' : isRiot ? 'riot' : 'local';
      const providerId = token.replace('mock_jwt_token_for_', '');
      sessionUser = { id: 'user-mock-id', provider, provider_id: providerId, linked_providers: [] };
    }
    
    // JWT 페이로드에 연동 정보가 있으면 localStorage 동기화, 없으면 기존 캐시 사용
    const cachedLinked = JSON.parse(localStorage.getItem('syncrig_linked_providers') || '[]');
    const finalLinked = sessionUser.linked_providers && sessionUser.linked_providers.length > 0 
      ? sessionUser.linked_providers 
      : cachedLinked;
      
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

    if (providersList.length > 0) {
      try {
        const games = await api.syncGameLibrary(providersList);
        // Calculate achievements based on actual game data
        const totalPlaytime = games.reduce((sum, g) => sum + (g.playtime || g.hours || 0), 0);
        const estimatedAchievements = Math.round(totalPlaytime * 0.88); // rough estimate based on playtime
        set({ gameLibrary: games, achievementsCount: estimatedAchievements });
      } catch (e) {
        console.error('Failed to sync games', e);
      }
    } else {
      set({ gameLibrary: [], achievementsCount: 0 });
    }
  },

  setUser: (user) => set({ user }),
  
  setUserSpec: (userSpec) => set({ userSpec }),
  
  logout: () => {
    api.setToken(null);
    localStorage.removeItem('syncrig_linked_providers');
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
      const totalPlaytime = games.reduce((sum, g) => sum + (g.playtime || g.hours || 0), 0);
      const estimatedAchievements = Math.round(totalPlaytime * 0.88);
      set({ gameLibrary: games, achievementsCount: estimatedAchievements });
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

      if (newLinked.length > 0 || data.user.provider === 'steam' || data.user.provider === 'riot') {
        const games = await api.syncGameLibrary(newLinked);
        const totalPlaytime = games.reduce((sum, g) => sum + (g.playtime || g.hours || 0), 0);
        const estimatedAchievements = Math.round(totalPlaytime * 0.88);
        set({ gameLibrary: games, achievementsCount: estimatedAchievements });
      } else {
        set({ gameLibrary: [], achievementsCount: 0 });
      }
    } catch (err) {
      console.error('Unlink failed', err);
      throw err;
    }
  }
}));

export default useAuthStore;
