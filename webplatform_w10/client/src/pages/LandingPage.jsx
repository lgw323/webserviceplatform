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
      
      {/* ── Feature Highlights (3-Column Grid) ── */}
      <section className="w-full max-w-7xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8 pb-24 animation-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="p-8 bg-cyber-card border border-gray-800 rounded-2xl hover:border-gray-600 transition-colors">
          <div className="w-12 h-12 bg-cyber-dark rounded-xl flex items-center justify-center mb-6">
            <Cpu className="w-6 h-6 text-cyber-accent" />
          </div>
          <h3 className="text-xl font-bold mb-3">초정밀 하드웨어 분석</h3>
          <p className="text-a11y-muted leading-relaxed">
            내 PC의 스펙을 정확히 진단하고 병목 구간을 파악하여 쾌적한 플레이 환경을 위한 인사이트를 제공합니다.
          </p>
        </div>

        <div className="p-8 bg-cyber-card border border-gray-800 rounded-2xl hover:border-gray-600 transition-colors relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-purple/10 blur-3xl rounded-full" />
          <div className="w-12 h-12 bg-cyber-dark rounded-xl flex items-center justify-center mb-6 relative z-10">
            <Crosshair className="w-6 h-6 text-cyber-purple" />
          </div>
          <h3 className="text-xl font-bold mb-3 relative z-10">스팀 & 라이엇 연동</h3>
          <p className="text-a11y-muted leading-relaxed relative z-10">
            보유한 게임의 플레이 타임을 분석하고 각 게임에 최적화된 프로필을 대시보드에 즉시 동기화합니다.
          </p>
        </div>

        <div className="p-8 bg-cyber-card border border-gray-800 rounded-2xl hover:border-gray-600 transition-colors">
          <div className="w-12 h-12 bg-cyber-dark rounded-xl flex items-center justify-center mb-6">
            <Zap className="w-6 h-6 text-cyber-success" />
          </div>
          <h3 className="text-xl font-bold mb-3">AI 그래픽 세팅 추천</h3>
          <p className="text-a11y-muted leading-relaxed">
            가장 비슷한 하드웨어를 사용하는 전 세계 상위권 유저들의 그래픽 설정값을 찾아 클릭 한 번에 적용합니다.
          </p>
        </div>
      </section>
    </div>
  );
}
