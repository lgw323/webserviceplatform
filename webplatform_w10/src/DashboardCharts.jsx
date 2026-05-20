import React from 'react';
import { Clock, Award, TrendingUp, Flame } from 'lucide-react';

export default function DashboardCharts() {
  const gameStats = [
    { name: 'Cyberpunk 2077', hours: 120, color: 'bg-accent', pct: 34 },
    { name: 'League of Legends', hours: 340, color: 'bg-sky', pct: 97 },
    { name: 'Overwatch 2', hours: 85, color: 'bg-rose', pct: 24 },
    { name: 'Valorant', hours: 150, color: 'bg-mint', pct: 43 },
  ];

  const metrics = [
    { label: '스팀 달성률', value: '74%', icon: Award, tag: 'tag-accent' },
    { label: '라이엇 승률', value: '54.5%', icon: TrendingUp, tag: 'tag-sky' },
    { label: '이번 주 플레이', value: '23.5h', icon: Flame, tag: 'tag-rose' },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-3">

      {/* ─── Playtime Chart ─── */}
      <div className="surface-card p-6 md:col-span-2">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-txt-primary flex items-center gap-2">
            <Clock size={15} className="text-accent" />
            게임별 플레이타임
          </h3>
          <span className="text-[10px] font-mono text-txt-muted uppercase tracking-wider">총 {gameStats.reduce((s,g) => s+g.hours, 0)} 시간</span>
        </div>

        <div className="space-y-4">
          {gameStats.map((game) => (
            <div key={game.name} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-txt-secondary group-hover:text-txt-primary transition-colors">{game.name}</span>
                <span className="text-xs font-bold font-mono text-txt-primary">{game.hours}h</span>
              </div>
              <div className="h-2 bg-surface-1 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${game.color} transition-all duration-700 ease-out`}
                  style={{ width: `${game.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Metrics Sidebar ─── */}
      <div className="surface-card p-6 flex flex-col gap-4">
        <h3 className="text-sm font-bold text-txt-primary flex items-center gap-2">
          <Award size={15} className="text-accent" />
          게임 통합 지표
        </h3>

        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="surface-inset p-4 flex items-center justify-between hover:border-accent/20 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg ${m.tag.replace('tag-', 'bg-')}/10`}>
                  <Icon size={14} className={`${m.tag.replace('tag-', 'text-')}`} />
                </div>
                <span className="text-xs font-medium text-txt-secondary">{m.label}</span>
              </div>
              <span className="text-base font-extrabold font-mono text-txt-primary">{m.value}</span>
            </div>
          );
        })}

        <div className="mt-auto pt-4 border-t border-surface-3/50 flex items-center justify-between">
          <span className="text-[10px] text-txt-muted">최근 동기화: 10분 전</span>
          <button className="btn-ghost text-[10px] py-1.5 px-3">동기화</button>
        </div>
      </div>
    </div>
  );
}
