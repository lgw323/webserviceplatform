import React from 'react';
import SettingsView from '../features/settings/SettingsView';
import useAuthStore from '../store/useAuthStore';
import useSEO from '../hooks/useSEO';
import * as api from '../api/apiClient';

export default function SettingsPage() {
  useSEO('settings');
  const { user, setUser } = useAuthStore();

  const handleUpdateNickname = async (name) => {
    try {
      const data = await api.updateNickname(name);
      api.setToken(data.access_token);
      if (data.refresh_token) {
        api.setRefreshToken(data.refresh_token);
      }
      setUser(data.user);
    } catch (err) {
      console.error('Failed to update nickname:', err);
      throw err;
    }
  };

  return (
    <section className="animation-fade-in" aria-labelledby="heading-settings">
      <h1 id="heading-settings" className="sr-only">환경 설정</h1>
      <SettingsView user={user} onUpdateNickname={handleUpdateNickname} />
    </section>
  );
}
