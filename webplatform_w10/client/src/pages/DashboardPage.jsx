import React from 'react';
import { Check } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import DashboardCharts from '../features/dashboard/DashboardCharts';
import useSEO from '../hooks/useSEO';

import ProfileSummaryWidget from '../components/widgets/ProfileSummaryWidget';
import PremiumBannerWidget from '../components/widgets/PremiumBannerWidget';
import TrendingProfilesWidget from '../components/widgets/TrendingProfilesWidget';
import TargetedAdWidget from '../components/widgets/TargetedAdWidget';

function LinkedBadge({ linkedProviders }) {
  if (!linkedProviders || linkedProviders.length === 0) {
    return (
      <span className="text-xs font-semibold bg-gray-800 border border-gray-700 text-a11y-muted px-3 py-1.5 rounded-full flex items-center gap-1.5" role="status">
        미연동
      </span>
    );
  }

  const hasSteam = linkedProviders.includes('steam');
  const hasRiot = linkedProviders.includes('riot');

  let label = '';
  if (hasSteam && hasRiot) label = 'Steam + Riot 활성됨';
  else if (hasSteam) label = 'Steam 활성됨';
  else if (hasRiot) label = 'Riot 활성됨';
  else label = linkedProviders.join(', ') + ' 활성됨';

  return (
    <span className="text-xs font-semibold bg-cyber-success/10 border border-cyber-success/20 text-cyber-success px-3 py-1.5 rounded-full flex items-center gap-1.5" role="status">
      <Check className="w-3 h-3" aria-hidden="true" /> {label}
    </span>
  );
}

export default function DashboardPage() {
  useSEO('dashboard');
  const { user, userSpec, gameLibrary, achievementsCount, syncAccount } = useAuthStore();

  if (!user) return null;

  const linkedProviders = user.linked_providers || [];

  return (
    <section className="animation-fade-in" aria-labelledby="heading-dashboard">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 id="heading-dashboard" className="text-2xl font-bold text-gray-100 mb-2">대시보드</h1>
          <p className="text-a11y-muted">통합 하드웨어 분석 및 게이밍 허브</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-a11y-muted">계정 연동 상태:</span>
          <LinkedBadge linkedProviders={linkedProviders} />
        </div>
      </div>

      {/* 3-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar (25%) */}
        <div className="lg:col-span-3 space-y-6">
          <ProfileSummaryWidget />
          <PremiumBannerWidget />
        </div>

        {/* Center Main Area (50%) */}
        <div className="lg:col-span-6 space-y-6">
          <DashboardCharts
            userSpec={userSpec}
            gameLibrary={gameLibrary}
            achievementsCount={achievementsCount}
            onSyncAccount={syncAccount}
            linkedProviders={linkedProviders}
          />
        </div>

        {/* Right Sidebar (25%) */}
        <div className="lg:col-span-3 space-y-6">
          <TargetedAdWidget />
          <TrendingProfilesWidget />
        </div>

      </div>
    </section>
  );
}
