import React from 'react';
import { Check } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import DashboardCharts from '../features/dashboard/DashboardCharts';
import useSEO from '../hooks/useSEO';

export default function DashboardPage() {
  useSEO('dashboard');
  const { user, userSpec, gameLibrary, achievementsCount, syncAccount } = useAuthStore();

  if (!user) return null;

  return (
    <section className="space-y-6 animation-fade-in" aria-labelledby="heading-dashboard">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 id="heading-dashboard" className="text-2xl font-bold text-gray-100 mb-2">환영합니다, {user.provider_id}님</h1>
          <p className="text-a11y-muted">오늘의 게임 및 하드웨어 요약입니다.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-a11y-muted">계정 연동 상태:</span>
          {gameLibrary.length > 0 ? (
            <span className="text-xs font-semibold bg-cyber-success/10 border border-cyber-success/20 text-cyber-success px-3 py-1.5 rounded-full flex items-center gap-1.5" role="status">
              <Check className="w-3 h-3" aria-hidden="true" /> Steam/Riot 활성됨
            </span>
          ) : (
            <span className="text-xs font-semibold bg-gray-800 border border-gray-700 text-a11y-muted px-3 py-1.5 rounded-full flex items-center gap-1.5" role="status">
              미연동
            </span>
          )}
        </div>
      </div>
      <DashboardCharts
        userSpec={userSpec}
        gameLibrary={gameLibrary}
        achievementsCount={achievementsCount}
        onSyncAccount={syncAccount}
      />
    </section>
  );
}
