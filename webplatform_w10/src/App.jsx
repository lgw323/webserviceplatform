import React, { useState, useEffect } from 'react';
import { fetchRecommendations } from './api';
import HardwareProfileForm from './components/HardwareProfileForm';
import RecommendationList from './components/RecommendationList';
import DashboardCharts from './DashboardCharts';
import { Gamepad2, Settings, BarChart3, Zap, ChevronRight, Loader2 } from 'lucide-react';

/* ─── Stepped Loading Animation ─── */
function MatchingLoader() {
  const [step, setStep] = useState(0);
  const steps = [
    { label: '하드웨어 사양 데이터 분석', icon: '📡' },
    { label: '9주차 매칭 엔진 유사도 연산', icon: '⚙️' },
    { label: '최적 그래픽 프리셋 산출 완료', icon: '✨' },
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 600);
    const t2 = setTimeout(() => setStep(2), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="surface-card p-10 max-w-md mx-auto animate-fade-in">
      <div className="flex justify-center mb-8">
        <div className="relative">
          <Loader2 size={40} className="text-accent animate-spin" />
          <div className="absolute inset-0 rounded-full bg-accent/10 blur-xl" />
        </div>
      </div>
      <div className="space-y-3">
        {steps.map((s, i) => (
          <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 ${
            i <= step ? 'bg-surface-3 border border-accent/20' : 'bg-surface-1 border border-transparent opacity-40'
          }`}>
            <span className="text-base">{s.icon}</span>
            <span className="text-sm font-medium flex-1">{s.label}</span>
            {i < step && <span className="text-accent text-xs font-bold">완료</span>}
            {i === step && <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Tab Configuration ─── */
const TABS = [
  { id: 'dashboard', label: '대시보드', icon: BarChart3 },
  { id: 'hardware', label: '내 PC', icon: Settings },
  { id: 'recommend', label: '최적화', icon: Gamepad2 },
];

const BREADCRUMBS = {
  dashboard: ['대시보드'],
  hardware: ['내 PC 관리', '하드웨어 사양 등록'],
  recommend: ['최적화 허브', '그래픽 프리셋 추천'],
};

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
  const [activeTab, setActiveTab] = useState('dashboard');

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
    <div className="min-h-screen bg-surface-0 font-sans pb-20 md:pb-0">

      {/* ─── Top Bar ─── */}
      <header className="sticky top-0 z-50 bg-surface-0/80 backdrop-blur-xl border-b border-surface-3/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-light flex items-center justify-center shadow-glow-sm">
              <Zap size={16} className="text-white" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold tracking-tight text-txt-primary">SYNCRIG</span>
              <span className="tag-accent text-[9px] py-0.5 px-1.5">BETA</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-surface-2 p-1 rounded-xl border border-surface-3/50">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-accent text-white shadow-glow-sm'
                      : 'text-txt-muted hover:text-txt-secondary hover:bg-surface-3'
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="max-w-6xl mx-auto px-6 py-6">

        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-txt-muted font-mono mb-6 select-none">
          <span className="cursor-pointer hover:text-accent transition-colors" onClick={() => setActiveTab('dashboard')}>
            SYNCRIG
          </span>
          {BREADCRUMBS[activeTab].map((crumb, i) => (
            <React.Fragment key={i}>
              <ChevronRight size={10} className="text-surface-4" />
              <span className={i === BREADCRUMBS[activeTab].length - 1 ? 'text-accent font-semibold' : 'text-txt-muted'}>
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            {/* Hero Card */}
            <div className="surface-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-txt-primary tracking-tight">
                  안녕하세요, 게이머님 👋
                </h1>
                <p className="text-sm text-txt-secondary mt-2 leading-relaxed">
                  스팀과 라이엇 연동 데이터를 기반으로 최적의 그래픽 세팅을 추천합니다.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="surface-raised px-4 py-3 text-center min-w-[120px]">
                  <div className="text-[10px] font-semibold text-txt-muted uppercase tracking-widest mb-1">현재 GPU</div>
                  <div className="text-sm font-bold font-mono text-accent">{userSpec.gpu_model.split(' ').slice(-2).join(' ')}</div>
                </div>
                <div className="surface-raised px-4 py-3 text-center min-w-[80px]">
                  <div className="text-[10px] font-semibold text-txt-muted uppercase tracking-widest mb-1">해상도</div>
                  <div className="text-sm font-bold font-mono text-mint">{userSpec.resolution}</div>
                </div>
              </div>
            </div>

            <DashboardCharts />
          </div>
        )}

        {/* Hardware Form */}
        {activeTab === 'hardware' && (
          <div className="animate-slide-up">
            <HardwareProfileForm onSave={handleHardwareUpdate} />
          </div>
        )}

        {/* Recommendations */}
        {activeTab === 'recommend' && (
          <div className="space-y-6 animate-fade-in">
            <div className="surface-card p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-accent/10">
                  <Gamepad2 size={20} className="text-accent" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-txt-primary">Cyberpunk 2077 추천 그래픽 세팅</h2>
                  <p className="text-sm text-txt-secondary mt-1">
                    <span className="font-mono text-accent bg-accent/5 px-2 py-0.5 rounded-lg border border-accent/10">
                      {userSpec.gpu_model}
                    </span>
                    {' '}환경에서 60fps 이상을 방어하는 커뮤니티 검증 데이터입니다.
                  </p>
                </div>
              </div>
            </div>

            {isLoading ? (
              <MatchingLoader />
            ) : (
              <RecommendationList recommendations={recommendations} userSpec={userSpec} />
            )}
          </div>
        )}
      </main>

      {/* ─── Mobile Bottom Nav ─── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-surface-0/90 backdrop-blur-xl border-t border-surface-3/50 z-50">
        <div className="grid grid-cols-3 h-16">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center gap-1 transition-colors duration-200 ${
                  isActive ? 'text-accent' : 'text-txt-muted'
                }`}
              >
                <Icon size={18} />
                <span className="text-[10px] font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
