import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Gamepad2, Cpu, Zap, Crosshair } from 'lucide-react';
import { motion } from 'framer-motion';
import useSEO from '../hooks/useSEO';
import useAuthStore from '../store/useAuthStore';

// Famous Game Splash Arts for the Vortex
const GAMES = [
  "https://image.api.playstation.com/vulcan/ap/rnd/202311/2812/28d0eb5f34bc481cc8ccddb2a6a68cd1ffeb63990263f9eb.jpg", // Cyberpunk 2077
  "https://image.api.playstation.com/vulcan/ap/rnd/202211/1511/V1xKSTq28bC1O4Vd4x0eF040.png", // Rainbow Six Siege
  "https://cdn.dribbble.com/users/2348/screenshots/10696082/media/4a24583ea649f9df1415775a37c84ae5.jpg", // Valorant
  "https://media.contentapi.ea.com/content/dam/apex-legends/images/2019/01/apex-featured-image-16x9.jpg.adapt.crop16x9.1023w.jpg", // Apex Legends
  "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg", // League of Legends
  "https://blz-contentstack-images.akamaized.net/v3/assets/blt9c12f249ac15c7ec/bltc18a0eb1d2b77a7b/632cfb53e346b9112a1f28b4/Overwatch2_Secondary_KeyArt.jpg" // Overwatch 2
];

export default function LandingPage() {
  useSEO('landing');
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isConverging, setIsConverging] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLoginBtnClick = () => {
    setIsConverging(true);
    // Wait for vortex animation to finish converging before navigating
    setTimeout(() => {
      navigate('/login');
    }, 800); 
  };

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
          onClick={handleLoginBtnClick}
          className="px-6 py-2.5 bg-cyber-dark border border-gray-700 hover:border-cyber-accent hover:text-cyber-accent rounded-lg text-sm font-semibold transition-all"
        >
          로그인
        </button>
      </header>

      {/* ── Hero Section (2-Column) ── */}
      <main className="flex-1 w-full max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-8 mb-24 relative z-10">
        
        {/* Left: Copy & Call to Action */}
        <div className="flex flex-col items-start text-left relative z-10">
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
            onClick={handleLoginBtnClick}
            className="px-8 py-4 bg-cyber-accent hover:bg-cyber-accent/90 text-black font-bold rounded-lg text-lg transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,255,157,0.3)] animation-slide-up" style={{ animationDelay: '0.2s' }}
          >
            무료로 시작하기
          </button>
        </div>

        {/* Right: Visual Showcase (Cosmos Vortex) */}
        <div className="relative w-full h-[500px] flex items-center justify-center animation-fade-in" style={{ animationDelay: '0.3s' }}>
          {/* 배경 글로우 효과 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-cyber-accent/5 blur-[100px] rounded-full pointer-events-none" />

          {/* Vortex Container */}
          <div className="relative w-full h-full flex items-center justify-center pointer-events-none perspective-[1200px]">
            {/* Center black hole glow */}
            <div className="absolute w-4 h-4 bg-black rounded-full shadow-[0_0_40px_20px_rgba(0,255,157,0.4)] z-20" />

            {GAMES.map((game, i) => {
              // Calculate Hexagon Points (Radius 280)
              const angle = (i * 60) * (Math.PI / 180);
              const radius = 280;
              const startX = Math.cos(angle) * radius;
              const startY = Math.sin(angle) * radius;

              // Tilt elements to point towards center or follow orbit
              const rotateZ = angle * (180 / Math.PI) + 90;

              return (
                <motion.div
                  key={i}
                  className="absolute w-36 h-24 md:w-48 md:h-32 rounded-xl overflow-hidden border border-white/20 shadow-2xl bg-black"
                  style={{ transformStyle: 'preserve-3d', zIndex: 10 - i }}
                  initial={{ 
                    x: startX, 
                    y: startY, 
                    scale: 0, 
                    opacity: 0, 
                    rotateZ 
                  }}
                  animate={
                    isConverging
                      ? { 
                          x: 0, 
                          y: 0, 
                          scale: 0, 
                          opacity: 0, 
                          transition: { duration: 0.8, ease: "anticipate" } 
                        }
                      : { 
                          x: [startX, 0],
                          y: [startY, 0],
                          scale: [1, 0.1],
                          opacity: [0, 0.8, 0],
                          // slight spin as it falls in
                          rotateZ: [rotateZ, rotateZ + 45]
                        }
                  }
                  transition={
                    isConverging
                      ? undefined
                      : {
                          duration: 6, // Continuous loop duration
                          ease: "easeIn", // Accelerates as it approaches center
                          repeat: Infinity,
                          delay: i * (6 / 6) // Staggered exactly by 1 sec
                        }
                  }
                >
                  <img src={game} alt={`Game ${i}`} className="w-full h-full object-cover opacity-60 mix-blend-screen" />
                </motion.div>
              );
            })}
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
