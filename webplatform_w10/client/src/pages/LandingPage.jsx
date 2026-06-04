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
    <div className="min-h-screen bg-cyber-darker text-gray-100 flex flex-col items-center">
      {/* 네비게이션 헤더 */}
      <header className="w-full max-w-7xl px-6 py-6 flex items-center justify-between">
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

      {/* 메인 히어로 섹션 */}
      <main className="flex-1 w-full max-w-7xl px-6 flex flex-col items-center justify-center text-center mt-12 mb-24">
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-success/10 border border-cyber-success/30 text-cyber-success text-sm font-medium animation-fade-in">
          <Zap size={16} />
          <span>하드웨어 매칭 알고리즘 V1.0 가동 중</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-tight animation-slide-up">
          당신의 하드웨어가 가진 <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-accent to-cyber-purple">
            진짜 잠재력
          </span>
          을 끌어내세요
        </h1>

        <p className="text-lg md:text-xl text-a11y-muted max-w-2xl mb-12 animation-slide-up" style={{ animationDelay: '0.1s' }}>
          전 세계 상위 1% 게이머들의 최적화 데이터를 분석합니다.
          내 PC 사양에 딱 맞는 인게임 그래픽 세팅을 3초 만에 확인하고 프레임 드랍 없는 완벽한 게이밍을 경험하세요.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animation-slide-up" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-cyber-accent hover:bg-cyber-accent/90 text-black font-bold rounded-lg text-lg transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,255,157,0.3)]"
          >
            지금 바로 시작하기
          </button>
        </div>
      </main>

      {/* 기능 소개 섹션 (3-Column Grid) */}
      <section className="w-full max-w-7xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8 pb-24 animation-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="p-8 bg-cyber-card border border-gray-800 rounded-2xl hover:border-gray-600 transition-colors">
          <div className="w-12 h-12 bg-cyber-dark rounded-xl flex items-center justify-center mb-6">
            <Cpu className="w-6 h-6 text-cyber-accent" />
          </div>
          <h3 className="text-xl font-bold mb-3">초정밀 하드웨어 분석</h3>
          <p className="text-a11y-muted leading-relaxed">
            CPU, GPU, RAM 스펙을 분석하여 기기의 병목 구간(Bottleneck)을 진단하고 최적의 환경을 제안합니다.
          </p>
        </div>

        <div className="p-8 bg-cyber-card border border-gray-800 rounded-2xl hover:border-gray-600 transition-colors relative overflow-hidden">
          {/* 약간의 하이라이트 효과 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-purple/10 blur-3xl rounded-full" />
          <div className="w-12 h-12 bg-cyber-dark rounded-xl flex items-center justify-center mb-6 relative z-10">
            <Crosshair className="w-6 h-6 text-cyber-purple" />
          </div>
          <h3 className="text-xl font-bold mb-3 relative z-10">스팀 & 라이엇 연동</h3>
          <p className="text-a11y-muted leading-relaxed relative z-10">
            클릭 한 번으로 내가 보유한 게임 라이브러리를 동기화하고, 각 게임별 맞춤형 최적화 프로필을 받아보세요.
          </p>
        </div>

        <div className="p-8 bg-cyber-card border border-gray-800 rounded-2xl hover:border-gray-600 transition-colors">
          <div className="w-12 h-12 bg-cyber-dark rounded-xl flex items-center justify-center mb-6">
            <Zap className="w-6 h-6 text-cyber-success" />
          </div>
          <h3 className="text-xl font-bold mb-3">AI 그래픽 추천</h3>
          <p className="text-a11y-muted leading-relaxed">
            머신러닝 기반 매칭 알고리즘을 통해 나와 가장 유사한 하드웨어를 쓰는 유저들의 성공적인 그래픽 세팅을 복사합니다.
          </p>
        </div>
      </section>
    </div>
  );
}
