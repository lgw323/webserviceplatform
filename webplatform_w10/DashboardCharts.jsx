import React from 'react';
import { Play, Award, Clock } from 'lucide-react';

export default function DashboardCharts() {
  // Mock gameplay statistics
  const gameStats = [
    { name: 'Cyberpunk 2077', playTime: 120, achievement: 85, color: '#23ce6b' },
    { name: 'League of Legends', playTime: 340, achievement: 60, color: '#3b82f6' },
    { name: 'Overwatch 2', playTime: 85, achievement: 45, color: '#f59e0b' },
    { name: 'Valorant', playTime: 150, achievement: 70, color: '#ef4444' },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Playtime Bar Chart Mockup */}
      <div className="bg-white p-6 rounded-brand-lg shadow-brand-soft border border-gray-100 md:col-span-2">
        <h3 className="text-sm font-bold text-brand-charcoal mb-4 flex items-center gap-1.5">
          <Clock size={16} className="text-brand-green" /> 게임 플랫폼별 총 플레이타임 (시간)
        </h3>
        
        <div className="space-y-4 pt-2">
          {gameStats.map((game) => (
            <div key={game.name} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-brand-charcoal">
                <span>{game.name}</span>
                <span className="font-mono text-brand-green">{game.playTime} Hrs</span>
              </div>
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500" 
                  style={{ 
                    width: `${Math.min(100, (game.playTime / 350) * 100)}%`,
                    backgroundColor: game.color 
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Pie Chart Mockup / Overview Cards */}
      <div className="bg-white p-6 rounded-brand-lg shadow-brand-soft border border-gray-100 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-brand-charcoal mb-4 flex items-center gap-1.5">
            <Award size={16} className="text-brand-green" /> 통합 업적 달성 지표
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-neutral-offwhite rounded-brand-sm border border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-brand-green" />
                <span className="text-xs font-semibold text-neutral-grayText">스팀 전체 달성률</span>
              </div>
              <span className="text-sm font-bold font-mono">74%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-neutral-offwhite rounded-brand-sm border border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-xs font-semibold text-neutral-grayText">라이엇 전적 승률</span>
              </div>
              <span className="text-sm font-bold font-mono">54.5%</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 mt-4 flex justify-between items-center text-xs text-neutral-grayText">
          <span>최근 동기화: 10분 전</span>
          <button className="text-brand-green hover:underline font-semibold focus:outline-none">
            지금 동기화
          </button>
        </div>
      </div>
    </div>
  );
}
