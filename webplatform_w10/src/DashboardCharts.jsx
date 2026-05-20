import React from 'react';
import { Play, Award, Clock } from 'lucide-react';

export default function DashboardCharts() {
  // Mock gameplay statistics with premium gradient styles
  const gameStats = [
    { name: 'Cyberpunk 2077', playTime: 120, achievement: 85, gradient: 'from-[#00ff66] to-[#00b347]', colorHex: '#00ff66' },
    { name: 'League of Legends', playTime: 340, achievement: 60, gradient: 'from-[#00c6ff] to-[#0072ff]', colorHex: '#00c6ff' },
    { name: 'Overwatch 2', playTime: 85, achievement: 45, gradient: 'from-[#f59e0b] to-[#d97706]', colorHex: '#f59e0b' },
    { name: 'Valorant', playTime: 150, achievement: 70, gradient: 'from-[#ef4444] to-[#991b1b]', colorHex: '#ef4444' },
  ];

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {/* Playtime Bar Chart - Premium HUD */}
      <div className="glass-panel p-6 rounded-brand-lg shadow-brand-soft md:col-span-2 border border-white/5">
        <h3 className="text-sm font-extrabold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
          <Clock size={16} className="text-[#00ff66] drop-shadow-[0_0_8px_rgba(0,255,102,0.5)]" /> 게임 플랫폼별 총 플레이타임 (시간)
        </h3>
        
        <div className="space-y-5 pt-1">
          {gameStats.map((game) => (
            <div key={game.name} className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-300">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: game.colorHex }} />
                  {game.name}
                </span>
                <span className="font-mono text-white bg-white/5 px-2 py-0.5 rounded border border-white/5">{game.playTime} Hrs</span>
              </div>
              <div className="w-full bg-black/40 h-3 rounded-full overflow-hidden border border-white/5">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${game.gradient} transition-all duration-700 relative`} 
                  style={{ 
                    width: `${Math.min(100, (game.playTime / 350) * 100)}%`
                  }}
                >
                  {/* Subtle highlight effect inside progress bar */}
                  <span className="absolute inset-0 bg-white/10 animate-pulse"></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement / Overview Cards - Premium Glass */}
      <div className="glass-panel p-6 rounded-brand-lg shadow-brand-soft flex flex-col justify-between border border-white/5">
        <div>
          <h3 className="text-sm font-extrabold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
            <Award size={16} className="text-[#00ff66] drop-shadow-[0_0_8px_rgba(0,255,102,0.5)]" /> 통합 업적 달성 지표
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-black/30 rounded-brand-md border border-white/5 hover:border-[#00ff66]/20 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00ff66] shadow-[0_0_8px_rgba(0,255,102,0.7)]" />
                <span className="text-xs font-bold text-gray-300">스팀 전체 달성률</span>
              </div>
              <span className="text-base font-extrabold font-mono text-white">74%</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-black/30 rounded-brand-md border border-white/5 hover:border-[#00c6ff]/20 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00c6ff] shadow-[0_0_8px_rgba(0,198,255,0.7)]" />
                <span className="text-xs font-bold text-gray-300">라이엇 전적 승률</span>
              </div>
              <span className="text-base font-extrabold font-mono text-white">54.5%</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 mt-6 flex justify-between items-center text-xs text-gray-400">
          <span>최근 동기화: 10분 전</span>
          <button className="text-[#00ff66] hover:text-[#33ff85] font-bold transition-colors flex items-center gap-1.5 focus:outline-none bg-[#00ff66]/5 px-3 py-1.5 rounded-brand-sm border border-[#00ff66]/10 hover:border-[#00ff66]/30">
            지금 동기화
          </button>
        </div>
      </div>
    </div>
  );
}
