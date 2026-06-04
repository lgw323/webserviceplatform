import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Gamepad2, Cpu, Zap, Crosshair } from 'lucide-react';
import useSEO from '../hooks/useSEO';
import useAuthStore from '../store/useAuthStore';

export default function LandingPage() {
  useSEO('landing');
  const navigate = useNavigate();
  const { user } = useAuthStore();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-cyber-darker text-gray-100 flex flex-col items-center overflow-x-hidden">
      {/* ── Header ── */}
      <header className="w-full max-w-7xl px-6 py-6 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-3">
          <Gamepad2 className="w-8 h-8 text-cyber-accent" />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyber-accent to-cyber-purple tracking-wider">
            SYNCRIG
          </span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 bg-cyber-dark border border-gray-700 hover:border-cyber-accent hover:text-cyber-accent rounded-lg text-sm font-semibold transition-all"
        >
          로그인
        </button>
      </header>

      {/* ── Hero Section (2-Column) ── */}
      <main className="flex-1 w-full max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-8 mb-24 relative z-10">
        
        {/* Left: Copy & Call to Action */}
        <div className="flex flex-col items-start text-left">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-success/10 border border-cyber-success/30 text-cyber-success text-sm font-medium animation-fade-in">
            <Zap size={16} className="animate-pulse" />
            <span>머신러닝 기반 하드웨어 매칭 엔진</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight leading-tight animation-slide-up">
            진짜 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-accent to-cyber-purple">잠재력</span>을<br />
            끌어내세요
          </h1>

          <p className="text-lg md:text-xl text-a11y-muted max-w-lg mb-10 animation-slide-up" style={{ animationDelay: '0.1s' }}>
            스팀 연동 한 번으로, 내 PC 사양에 완벽하게 맞는 인게임 최적화 세팅을 찾아냅니다. 프레임 드랍 없는 완벽한 게이밍을 경험하세요.
          </p>

          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-cyber-accent hover:bg-cyber-accent/90 text-black font-bold rounded-lg text-lg transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,255,157,0.3)] animation-slide-up" style={{ animationDelay: '0.2s' }}
          >
            무료로 시작하기
          </button>
        </div>

        {/* Right: Visual Showcase (Mock UI) */}
        <div className="relative w-full h-[500px] hidden sm:flex items-center justify-center animation-fade-in" style={{ animationDelay: '0.3s' }}>
          {/* 배경 글로우 효과 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-cyber-accent/5 blur-[100px] rounded-full pointer-events-none" />

          {/* 메인 대시보드 Mockup */}
          <div className="absolute top-4 left-4 w-72 bg-cyber-card border border-gray-800 rounded-xl p-4 shadow-2xl z-10 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-cyber-purple/20 rounded-lg flex items-center justify-center">
                <Crosshair className="w-5 h-5 text-cyber-purple" />
              </div>
              <div>
                <p className="text-xs text-a11y-muted">연동 완료</p>
                <p className="font-bold text-sm">Steam Library Sync</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-gray-800 rounded-full w-full overflow-hidden">
                 <div className="h-full bg-cyber-purple w-[85%] animate-pulse" />
              </div>
              <p className="text-[10px] text-right text-gray-400">142 Games Found</p>
            </div>
          </div>

          {/* 내 스펙 & 분석 카드 Mockup */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-80 bg-cyber-card border border-gray-700/50 rounded-xl p-5 shadow-2xl z-20 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyber-accent" />
                <span className="font-bold text-sm">내 PC 분석 결과</span>
              </div>
              <span className="text-xs bg-cyber-success/20 text-cyber-success px-2 py-0.5 rounded">최상위 8%</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">GPU</span>
                <span className="font-medium">RTX 4070 SUPER</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">CPU</span>
                <span className="font-medium">Ryzen 5 7600</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">예상 프레임 (사이버펑크 2077)</span>
                <span className="font-bold text-cyber-accent">114 FPS</span>
              </div>
            </div>
          </div>

          {/* 팝업 알림 Mockup */}
          <div className="absolute top-24 -right-4 w-64 bg-gray-900 border border-cyber-accent/30 rounded-xl p-3 shadow-2xl z-30 transform rotate-3 animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyber-accent/20 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-cyber-accent" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-100">최적화 프로필 발견!</p>
                <p className="text-[10px] text-gray-400">나와 동일한 하드웨어 유저의 세팅 적용</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* ── Feature Highlights (Bento Grid) ── */}
      <section className="w-full max-w-7xl px-6 pb-24 animation-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
          
          {/* 1번 카드: 넓은 카드 (2칸 차지) */}
          <div className="md:col-span-2 group relative p-8 bg-cyber-card border border-gray-800 rounded-3xl overflow-hidden hover:border-cyber-accent/50 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-12 h-12 bg-cyber-dark/80 backdrop-blur rounded-2xl flex items-center justify-center mb-auto border border-gray-700/50">
                <Cpu className="w-6 h-6 text-cyber-accent" />
              </div>
              <div className="mt-8">
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-cyber-accent transition-colors">초정밀 하드웨어 분석</h3>
                <p className="text-a11y-muted leading-relaxed max-w-md">
                  내 PC의 스펙을 정확히 진단하고 병목 구간(Bottleneck)을 파악하여 쾌적한 플레이 환경을 위한 데이터 인사이트를 제공합니다.
                </p>
              </div>
            </div>
            {/* 배경 데코레이션 */}
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-cyber-accent/10 rounded-full blur-3xl group-hover:bg-cyber-accent/20 transition-colors duration-700" />
          </div>

          {/* 2번 카드: 길쭉한 카드 (1칸) */}
          <div className="md:row-span-2 group relative p-8 bg-cyber-card border border-gray-800 rounded-3xl overflow-hidden hover:border-cyber-purple/50 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-b from-cyber-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-12 h-12 bg-cyber-dark/80 backdrop-blur rounded-2xl flex items-center justify-center mb-8 border border-gray-700/50 shadow-[0_0_15px_rgba(180,100,255,0.2)]">
                <Crosshair className="w-6 h-6 text-cyber-purple" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-cyber-purple transition-colors">스팀 & 라이엇 완벽 연동</h3>
                <p className="text-a11y-muted leading-relaxed mb-8">
                  클릭 한 번으로 내가 보유한 게임의 플레이 타임을 분석하고, 각 게임에 최적화된 맞춤형 프로필을 대시보드에 즉시 동기화합니다.
                </p>
              </div>
              {/* 카드 내부 미니 UI 장식 */}
              <div className="mt-auto space-y-3">
                <div className="h-12 w-full bg-gray-900/50 rounded-xl border border-gray-800 flex items-center px-4 gap-3">
                   <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center"><Gamepad2 className="w-3 h-3 text-blue-400" /></div>
                   <div className="h-2 w-20 bg-gray-700 rounded-full" />
                </div>
                <div className="h-12 w-full bg-gray-900/50 rounded-xl border border-gray-800 flex items-center px-4 gap-3 opacity-50">
                   <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center"><Zap className="w-3 h-3 text-red-400" /></div>
                   <div className="h-2 w-16 bg-gray-700 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* 3번 카드: 가로형 카드 (2칸 차지) */}
          <div className="md:col-span-2 group relative p-8 bg-cyber-card border border-gray-800 rounded-3xl overflow-hidden hover:border-cyber-success/50 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-cyber-success/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col sm:flex-row gap-8 items-center h-full">
              <div className="flex-1">
                <div className="w-12 h-12 bg-cyber-dark/80 backdrop-blur rounded-2xl flex items-center justify-center mb-6 border border-gray-700/50">
                  <Zap className="w-6 h-6 text-cyber-success" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-cyber-success transition-colors">AI 그래픽 세팅 추천</h3>
                <p className="text-a11y-muted leading-relaxed max-w-md">
                  가장 비슷한 하드웨어를 사용하는 전 세계 상위권 랭커들의 그래픽 설정값을 찾습니다. 게임 내 옵션 타협 없이 최적의 프레임을 경험하세요.
                </p>
              </div>
              {/* 우측 시각적 포인트 */}
              <div className="hidden sm:flex flex-col gap-2 w-48 shrink-0">
                 <div className="w-full flex justify-between items-end">
                    <span className="text-xs text-gray-500">FPS Gain</span>
                    <span className="text-cyber-success font-bold">+42%</span>
                 </div>
                 <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="w-[85%] h-full bg-gradient-to-r from-cyber-dark to-cyber-success" />
                 </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
