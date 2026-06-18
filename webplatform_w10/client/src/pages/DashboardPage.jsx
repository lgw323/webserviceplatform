import React from 'react';
import { Check } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import DashboardCharts from '../features/dashboard/DashboardCharts';
import useSEO from '../hooks/useSEO';
import UpgradeRecommendationWidget from '../components/ads/UpgradeRecommendationWidget';
import PremiumStatsWidget from '../components/dashboard/PremiumStatsWidget';
import apiClient from '../api/apiClient';

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
  const [adData, setAdData] = React.useState(null);

  React.useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await apiClient.get('/profiles/recommendations/ads');
        if (response.data?.success && response.data?.ad) {
          setAdData(response.data.ad);
        }
      } catch (err) {
        console.error('Failed to fetch ad:', err);
      }
    };
    if (user) {
      fetchAd();
    }
  }, [user]);

  if (!user) return null;

  const linkedProviders = user.linked_providers || [];

  return (
    <section className="space-y-6 animation-fade-in" aria-labelledby="heading-dashboard">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 id="heading-dashboard" className="text-2xl font-bold text-gray-100 mb-2">환영합니다, {user.nickname || user.provider_id}님</h1>
          <p className="text-a11y-muted">오늘의 게임 및 하드웨어 요약입니다.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-a11y-muted">계정 연동 상태:</span>
          <LinkedBadge linkedProviders={linkedProviders} />
        </div>
      </div>
      <DashboardCharts
        userSpec={userSpec}
        gameLibrary={gameLibrary}
        achievementsCount={achievementsCount}
        onSyncAccount={syncAccount}
        linkedProviders={linkedProviders}
      />
      
      {adData && <UpgradeRecommendationWidget ad={adData} />}

      {user?.subscription_status === 'premium' && (
        <PremiumStatsWidget isPremium={true} />
      )}
    </section>
  );
}
