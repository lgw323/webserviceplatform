import React, { useState, useEffect } from 'react';
import { fetchRecommendations } from './api';
import HardwareProfileForm from './components/HardwareProfileForm';
import RecommendationList from './components/RecommendationList';
import DashboardCharts from './DashboardCharts';
import { Gamepad2, Settings, BarChart3, HelpCircle } from 'lucide-react';

export default function App() {
  const [userSpec, setUserSpec] = useState({
    cpu_model: 'AMD Ryzen 5 5600X',
    gpu_model: 'NVIDIA GeForce RTX 3060',
    ram_gb: 16,
    resolution: 'FHD',
    refresh_rate: 144,
  });

  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'hardware' | 'recommend'

  const loadRecommendations = async (specs) => {
    setIsLoading(true);
    try {
      const data = await fetchRecommendations(specs);
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error('추천 데이터 로드 실패', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations(userSpec);
  }, [userSpec]);

  const handleHardwareUpdate = (newSpec) => {
    setUserSpec(newSpec);
    setActiveTab('recommend');
  };

  return (
    <div className="min-h-screen bg-neutral-offwhite font-sans text-brand-charcoal">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-brand-sm bg-brand-green flex items-center justify-center text-white font-bold">
            SR
          </div>
          <span className="text-lg font-bold tracking-tight text-brand-charcoal">
            SYNCRIG <span className="text-brand-green text-xs font-normal">v1.0</span>
          </span>
        </div>

        {/* Nav Tabs */}
        <nav className="flex space-x-1 bg-gray-100 p-1 rounded-brand-sm">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 text-xs font-semibold rounded-brand-sm transition-all flex items-center gap-1 ${
              activeTab === 'dashboard' ? 'bg-white text-brand-charcoal shadow-sm' : 'text-neutral-grayText hover:text-brand-charcoal'
            }`}
          >
            <BarChart3 size={14} /> 통합 대시보드
          </button>
          <button
            onClick={() => setActiveTab('hardware')}
            className={`px-4 py-2 text-xs font-semibold rounded-brand-sm transition-all flex items-center gap-1 ${
              activeTab === 'hardware' ? 'bg-white text-brand-charcoal shadow-sm' : 'text-neutral-grayText hover:text-brand-charcoal'
            }`}
          >
            <Settings size={14} /> 내 PC 관리
          </button>
          <button
            onClick={() => setActiveTab('recommend')}
            className={`px-4 py-2 text-xs font-semibold rounded-brand-sm transition-all flex items-center gap-1 ${
              activeTab === 'recommend' ? 'bg-white text-brand-charcoal shadow-sm' : 'text-neutral-grayText hover:text-brand-charcoal'
            }`}
          >
            <Gamepad2 size={14} /> 최적화 허브
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-brand-lg shadow-brand-soft border border-gray-100 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-brand-charcoal">안녕하세요, 게이머님!</h1>
                <p className="text-sm text-neutral-grayText mt-1">스팀과 라이엇 연동 데이터가 활성화되었습니다.</p>
              </div>
              <div className="text-right hidden sm:block">
                <span className="text-xs text-neutral-grayText block">기본 하드웨어</span>
                <span className="text-sm font-semibold font-mono text-brand-green">{userSpec.gpu_model}</span>
              </div>
            </div>

            <DashboardCharts />
          </div>
        )}

        {activeTab === 'hardware' && (
          <div className="py-6">
            <HardwareProfileForm onSave={handleHardwareUpdate} />
          </div>
        )}

        {activeTab === 'recommend' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-brand-lg shadow-brand-soft border border-gray-100">
              <h2 className="text-lg font-bold text-brand-charcoal">Cyberpunk 2077 추천 그래픽 최적화 세팅</h2>
              <p className="text-xs text-neutral-grayText mt-1">
                사용자의 <span className="font-semibold text-brand-green font-mono">{userSpec.gpu_model} / {userSpec.resolution}</span> 환경에서 가장 원활하게 60fps 이상 방어가 가능한 커뮤니티 데이터입니다.
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-20">
                <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-brand-green rounded-full" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
                <p className="text-sm text-neutral-grayText mt-3">매칭 알고리즘 실행 중...</p>
              </div>
            ) : (
              <RecommendationList recommendations={recommendations} userSpec={userSpec} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
