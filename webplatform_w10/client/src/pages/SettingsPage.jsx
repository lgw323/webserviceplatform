import React from 'react';
import SettingsView from '../features/settings/SettingsView';
import useSEO from '../hooks/useSEO';

export default function SettingsPage() {
  useSEO('settings');

  return (
    <section className="animation-fade-in" aria-labelledby="heading-settings">
      <h1 id="heading-settings" className="sr-only">환경 설정</h1>
      <SettingsView />
    </section>
  );
}

