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
      
      {/* ── Feature Highlights (Before & After) ── */}
      <section className="w-full max-w-7xl px-6 pb-24 animation-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="flex flex-col md:flex-row gap-4 items-stretch">
            {/* Before (Bad) */}
            <div className="flex-1 bg-[#1a0f0f] border border-red-900/50 rounded-3xl p-10 flex flex-col items-center justify-center min-h-[350px] hover:animate-glitch cursor-crosshair">
                <div className="text-red-500 font-mono text-7xl font-bold mb-4 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">45<span className="text-3xl ml-2 text-red-500/70">FPS</span></div>
                <div className="bg-red-950 px-4 py-2 rounded text-red-400 text-sm font-bold border border-red-900">심각한 병목 현상 및 스터터링</div>
                <div className="mt-10 w-full max-w-xs h-2 bg-red-900/30 rounded-full overflow-hidden">
                    <div className="w-[30%] h-full bg-red-500" />
                </div>
            </div>
            
            {/* Middle Arrow */}
            <div className="flex items-center justify-center md:-mx-8 z-10 py-4">
                <div className="bg-gray-800 border-2 border-gray-700 px-6 py-3 rounded-full text-sm font-bold text-cyber-accent shadow-xl backdrop-blur-md">
                    SYNCRIG ON ⚡
                </div>
            </div>

            {/* After (Good) */}
            <div className="flex-1 bg-cyber-success/5 border border-cyber-success/30 rounded-3xl p-10 flex flex-col items-center justify-center min-h-[350px] hover:border-cyber-success transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.05)] hover:shadow-[0_0_60px_rgba(16,185,129,0.15)] group cursor-pointer">
                <div className="text-cyber-success font-mono text-8xl font-bold mb-4 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_20px_rgba(16,185,129,0.8)]">144<span className="text-3xl ml-2 text-cyber-success/70">FPS</span></div>
                <div className="bg-cyber-success/10 px-4 py-2 rounded text-cyber-success text-sm font-bold border border-cyber-success/20">완벽한 프로필 최적화 적용됨</div>
                <div className="mt-10 w-full max-w-xs h-2 bg-cyber-success/20 rounded-full overflow-hidden">
                    <div className="w-[95%] h-full bg-cyber-success shadow-[0_0_10px_#10b981]" />
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
