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
      
      {/* ── Feature Highlights (Glassmorphism Bento 2.0) ── */}
      <section className="w-full max-w-7xl px-6 pb-24 animation-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
          
          {/* Card 1: Radar (Span 2) */}
          <div className="md:col-span-2 relative rounded-3xl p-[1px] overflow-hidden group">
            {/* 1px Gradient Border */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-accent/30 via-transparent to-cyber-purple/30 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Inner Content (Glassmorphism) */}
            <div className="relative h-full bg-cyber-darker/60 backdrop-blur-xl rounded-[23px] p-8 flex flex-col justify-between overflow-hidden">
                {/* Glow Background */}
                <div className="absolute -left-20 -top-20 w-64 h-64 bg-cyber-accent/10 rounded-full blur-3xl group-hover:bg-cyber-accent/20 transition-colors duration-700 pointer-events-none" />
                
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-4 border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                            <Cpu className="w-5 h-5 text-cyber-accent" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">초정밀 스탯 레이더</h3>
                        <p className="text-gray-400 text-sm max-w-xs">병목 구간을 투명하게 스캔하여 최적의 환경을 분석합니다.</p>
                    </div>
                </div>

                {/* Abstract Graph UI */}
                <div className="relative z-10 mt-auto h-24 w-full max-w-md">
                    <div className="absolute inset-0 bg-gradient-to-t from-cyber-accent/20 to-transparent opacity-30 rounded-t-xl" />
                    <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                        <path d="M0,40 L0,20 Q10,35 20,20 T40,15 T60,25 T80,10 L100,20 L100,40 Z" fill="rgba(59, 130, 246, 0.1)" />
                        <path d="M0,20 Q10,35 20,20 T40,15 T60,25 T80,10 L100,20" fill="none" stroke="#00ffcc" strokeWidth="1" className="drop-shadow-[0_0_8px_rgba(0,255,204,0.8)]" />
                    </svg>
                </div>
            </div>
          </div>

          {/* Card 2: Vertical Flow (Span 2 rows) */}
          <div className="md:row-span-2 relative rounded-3xl p-[1px] overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-cyber-purple/30 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative h-full bg-cyber-darker/60 backdrop-blur-xl rounded-[23px] p-8 flex flex-col overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-purple/10 rounded-full blur-3xl group-hover:bg-cyber-purple/20 transition-colors duration-700 pointer-events-none" />
                
                <div className="relative z-10">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-4 border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                        <Crosshair className="w-5 h-5 text-cyber-purple" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">계정 연동</h3>
                    <p className="text-gray-400 text-sm mb-8">Steam & Riot 라이브러리를 동기화합니다.</p>
                </div>

                {/* Abstract Nodes UI */}
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-6 mt-auto">
                     <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative shadow-[0_0_30px_rgba(180,100,255,0.15)] group-hover:shadow-[0_0_40px_rgba(180,100,255,0.3)] transition-shadow duration-500">
                         <div className="absolute inset-0 rounded-full border border-cyber-purple/50 animate-ping opacity-20" />
                         <Gamepad2 className="w-6 h-6 text-cyber-purple" />
                     </div>
                     <div className="h-16 w-[1px] bg-gradient-to-b from-cyber-purple/50 to-transparent" />
                     <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                         <Zap className="w-6 h-6 text-gray-500 group-hover:text-cyber-accent transition-colors duration-500" />
                     </div>
                </div>
            </div>
          </div>

          {/* Card 3: Horizontal (Span 2) */}
          <div className="md:col-span-2 relative rounded-3xl p-[1px] overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-cyber-success/30 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative h-full bg-cyber-darker/60 backdrop-blur-xl rounded-[23px] p-8 flex flex-col sm:flex-row gap-8 items-center overflow-hidden">
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-cyber-success/10 rounded-full blur-3xl group-hover:bg-cyber-success/20 transition-colors duration-700 pointer-events-none" />
                
                <div className="relative z-10 flex-1">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-4 border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                        <Zap className="w-5 h-5 text-cyber-success" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">AI 프로필 매칭</h3>
                    <p className="text-gray-400 text-sm max-w-sm">수만 명의 상위 랭커 데이터베이스를 기반으로 최적의 프레임을 뽑아낼 수 있는 프로필을 추천합니다.</p>
                </div>

                {/* Abstract Bar UI */}
                <div className="relative z-10 hidden sm:flex flex-col gap-3 w-56 shrink-0">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs text-gray-400 font-medium">FPS Gain</span>
                            <span className="text-cyber-success text-sm font-bold">+42%</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="w-[85%] h-full bg-gradient-to-r from-transparent to-cyber-success shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                        </div>
                    </div>
                </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
