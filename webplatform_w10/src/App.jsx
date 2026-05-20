import React, { useState, useEffect } from 'react';
import { fetchRecommendations } from './api';
import HardwareProfileForm from './components/HardwareProfileForm';
import RecommendationList from './components/RecommendationList';
import DashboardCharts from './DashboardCharts';
import { Gamepad2, Settings, BarChart3, HelpCircle } from 'lucide-react';

// Stepped Loader to simulate progress for a premium UX matching experience (Guide #12)
function SteppedLoader() {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(33);

  useEffect(() => {
    const t1 = setTimeout(() => { setStep(2); setProgress(66); }, 800);
    const t2 = setTimeout(() => { setStep(3); setProgress(90); }, 1600);
    const t3 = setTimeout(() => { setProgress(100); }, 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="text-center py-20 glass-panel rounded-brand-lg max-w-xl mx-auto border border-white/5 shadow-brand-soft p-8">
      <div className="relative inline-flex mb-8">
        <div className="w-16 h-16 rounded-full border-4 border-[#00ff66]/10 border-t-[#00ff66] animate-spin"></div>
        <div className="absolute inset-0 rounded-full blur-md bg-[#00ff66]/10 animate-pulse"></div>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold text-white">{progress}%</span>
      </div>
      
      <div className="max-w-xs mx-auto space-y-4">
        <div className="flex justify-between text-xs text-gray-400 font-extrabold uppercase tracking-wider">
          <span>최적화 매칭 단계</span>
          <span className="text-[#00ff66]">{step} / 3 단계</span>
        </div>
        <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
          <div className="h-full bg-gradient-to-r from-[#00ff66] to-[#00b347] transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-sm font-bold text-gray-200 mt-3 transition-opacity duration-300">
          {step === 1 && "1단계: 사용자 하드웨어 규격 정보 매핑 중..."}
          {step === 2 && "2단계: 9주차 매칭 엔진 유사도 스코어 연산 중..."}
          {step === 3 && "3단계: 최고 유사도 최적 세팅 카드 정렬 중..."}
        </p>
      </div>
    </div>
  );
}

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
    <div className="min-h-screen bg-[#07090e] font-sans text-gray-200 pb-20 md:pb-0">
      {/* HUD Header */}
      <header className="glass-panel sticky top-0 z-10 px-6 py-4 flex items-center justify-between shadow-brand-soft">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-brand-md bg-gradient-to-br from-[#00ff66] to-[#00b347] flex items-center justify-center text-black font-extrabold shadow-brand-glow text-sm">
            SR
          </div>
          <span className="text-xl font-extrabold tracking-wider text-white">
            SYNCRIG <span className="text-[#00ff66] text-xs font-mono font-bold tracking-normal bg-[#00ff66]/10 px-2 py-0.5 rounded ml-1.5 border border-[#00ff66]/20">v1.0</span>
          </span>
        </div>

        {/* HUD Nav Tabs - Desktop Version */}
        <nav className="hidden md:flex space-x-1 bg-black/40 p-1 rounded-brand-md border border-white/5">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-5 py-2.5 text-xs font-bold rounded-brand-sm transition-all duration-200 flex items-center gap-2 border ${
              activeTab === 'dashboard'
                ? 'bg-[#00ff66]/10 text-[#00ff66] border-[#00ff66]/30 shadow-brand-glow-subtle'
                : 'text-gray-400 hover:text-white border-transparent'
            }`}
          >
            <BarChart3 size={14} /> 통합 대시보드
          </button>
          <button
            onClick={() => setActiveTab('hardware')}
            className={`px-5 py-2.5 text-xs font-bold rounded-brand-sm transition-all duration-200 flex items-center gap-2 border ${
              activeTab === 'hardware'
                ? 'bg-[#00ff66]/10 text-[#00ff66] border-[#00ff66]/30 shadow-brand-glow-subtle'
                : 'text-gray-400 hover:text-white border-transparent'
            }`}
          >
            <Settings size={14} /> 내 PC 관리
          </button>
          <button
            onClick={() => setActiveTab('recommend')}
            className={`px-5 py-2.5 text-xs font-bold rounded-brand-sm transition-all duration-200 flex items-center gap-2 border ${
              activeTab === 'recommend'
                ? 'bg-[#00ff66]/10 text-[#00ff66] border-[#00ff66]/30 shadow-brand-glow-subtle'
                : 'text-gray-400 hover:text-white border-transparent'
            }`}
          >
            <Gamepad2 size={14} /> 최적화 허브
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Dynamic Breadcrumbs for Route Clarity (Guide #13) */}
        <div className="text-xs text-gray-500 mb-6 flex items-center gap-1.5 font-mono select-none">
          <span className="hover:text-[#00ff66] transition-colors cursor-pointer" onClick={() => setActiveTab('dashboard')}>SYNCRIG</span>
          <span>/</span>
          {activeTab === 'dashboard' && <span className="text-[#00ff66] font-bold">통합 대시보드</span>}
          {activeTab === 'hardware' && (
            <>
              <span className="hover:text-gray-300 transition-colors cursor-pointer" onClick={() => setActiveTab('dashboard')}>내 PC 관리</span>
              <span>/</span>
              <span className="text-[#00ff66] font-bold">하드웨어 사양 등록</span>
            </>
          )}
          {activeTab === 'recommend' && (
            <>
              <span className="hover:text-gray-300 transition-colors cursor-pointer" onClick={() => setActiveTab('dashboard')}>최적화 허브</span>
              <span>/</span>
              <span className="text-[#00ff66] font-bold">그래픽 프리셋 추천</span>
            </>
          )}
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="glass-panel p-6 rounded-brand-lg shadow-brand-soft flex items-center justify-between border-l-4 border-l-[#00ff66]">
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  안녕하세요, 게이머님! <span className="animate-pulse inline-block w-2.5 h-2.5 rounded-full bg-[#00ff66]"></span>
                </h1>
                <p className="text-sm text-gray-400 mt-1">스팀과 라이엇 연동 데이터가 활성화되었습니다.</p>
              </div>
              <div className="text-right hidden sm:block bg-black/30 px-4 py-2.5 rounded-brand-md border border-white/5">
                <span className="text-[10px] text-gray-500 block uppercase tracking-wider font-bold">기본 하드웨어</span>
                <span className="text-sm font-bold font-mono text-[#00ff66]">{userSpec.gpu_model}</span>
              </div>
            </div>

            <DashboardCharts />
          </div>
        )}

        {activeTab === 'hardware' && (
          <div className="py-4">
            <HardwareProfileForm onSave={handleHardwareUpdate} />
          </div>
        )}

        {activeTab === 'recommend' && (
          <div className="space-y-8">
            <div className="glass-panel p-6 rounded-brand-lg shadow-brand-soft border-l-4 border-l-[#00ff66]">
              <h2 className="text-xl font-extrabold text-white tracking-tight">Cyberpunk 2077 추천 그래픽 최적화 세팅</h2>
              <p className="text-sm text-gray-400 mt-1.5">
                사용자의 <span className="font-bold text-[#00ff66] font-mono bg-[#00ff66]/10 px-2 py-0.5 rounded border border-[#00ff66]/20">{userSpec.gpu_model} / {userSpec.resolution}</span> 환경에서 가장 원활하게 60fps 이상 방어가 가능한 커뮤니티 데이터입니다.
              </p>
            </div>

            {isLoading ? (
              <SteppedLoader />
            ) : (
              <RecommendationList recommendations={recommendations} userSpec={userSpec} />
            )}
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Guide #6 - Mobile First Navigation) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#07090e]/95 backdrop-blur-lg border-t border-white/5 grid grid-cols-3 p-2 z-50 shadow-2xl">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center py-2 text-xs font-bold transition-all duration-200 gap-1 ${
            activeTab === 'dashboard' ? 'text-[#00ff66] font-extrabold' : 'text-gray-500'
          }`}
        >
          <BarChart3 size={18} />
          <span className="text-[10px]">대시보드</span>
        </button>
        <button
          onClick={() => setActiveTab('hardware')}
          className={`flex flex-col items-center justify-center py-2 text-xs font-bold transition-all duration-200 gap-1 ${
            activeTab === 'hardware' ? 'text-[#00ff66] font-extrabold' : 'text-gray-500'
          }`}
        >
          <Settings size={18} />
          <span className="text-[10px]">내 PC 관리</span>
        </button>
        <button
          onClick={() => setActiveTab('recommend')}
          className={`flex flex-col items-center justify-center py-2 text-xs font-bold transition-all duration-200 gap-1 ${
            activeTab === 'recommend' ? 'text-[#00ff66] font-extrabold' : 'text-gray-500'
          }`}
        >
          <Gamepad2 size={18} />
          <span className="text-[10px]">최적화 허브</span>
        </button>
      </nav>
    </div>
  );
}
