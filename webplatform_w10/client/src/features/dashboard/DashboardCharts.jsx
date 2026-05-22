import React, { useMemo } from 'react';
import { Clock, Trophy, Gamepad2, Monitor, TrendingUp, RefreshCw } from 'lucide-react';

const WEEKLY_PLAYTIME_TEMPLATE = [
  { day: 'Mon', h: 2.5 }, { day: 'Tue', h: 3.8 }, { day: 'Wed', h: 1.5 },
  { day: 'Thu', h: 4.2 }, { day: 'Fri', h: 5.5 }, { day: 'Sat', h: 8.4 }, { day: 'Sun', h: 7.2 },
];

const COLOR_CLASSES = ['bg-cyber-accent', 'bg-cyber-purple', 'bg-cyber-warning', 'bg-cyber-success'];

export default function DashboardCharts({ userSpec, gameLibrary = [], achievementsCount = 0, onSyncAccount }) {
  const isSynced = gameLibrary.length > 0;

  const { totalHours, gamesCount, activeGpu, stats, maxWeekly, maxPlaytime } = useMemo(() => {
    const th = isSynced ? gameLibrary.reduce((s, g) => s + (g.playtime || g.hours || 0), 0) : 0;
    const gc = isSynced ? gameLibrary.length : 0;
    const gpu = userSpec?.gpu_model?.split(' ').slice(-2).join(' ') || '등록 안 됨';
    const mw = isSynced ? Math.max(...WEEKLY_PLAYTIME_TEMPLATE.map(d => d.h)) : 1;
    const mp = isSynced ? Math.max(...gameLibrary.map(g => g.playtime || g.hours || 1)) : 1;

    const st = [
      { title: 'Total Playtime', value: isSynced ? `${th.toLocaleString()} hrs` : '0 hrs', icon: Clock, color: 'text-cyber-accent' },
      { title: 'Games Owned', value: isSynced ? `${gc}` : '0', icon: Gamepad2, color: 'text-cyber-purple' },
      { title: 'Achievements', value: isSynced ? `${achievementsCount}` : '0', icon: Trophy, color: 'text-cyber-warning' },
      { title: 'Active GPU', value: gpu, icon: Monitor, color: 'text-cyber-success' },
    ];

    return { totalHours: th, gamesCount: gc, activeGpu: gpu, stats: st, maxWeekly: mw, maxPlaytime: mp };
  }, [isSynced, gameLibrary, userSpec, achievementsCount]);

  return (
    <div className="space-y-6">
      {/* ── Stats Cards (4-col) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-cyber-card rounded-xl p-5 border border-gray-800 shadow-lg hover:border-gray-700 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-xl font-bold text-gray-100 truncate" title={stat.value}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Weekly Activity Chart */}
        <div className="lg:col-span-2 bg-cyber-card rounded-xl border border-gray-800 shadow-lg p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-100">Playtime Activity</h2>
                <p className="text-sm text-gray-400">Hours played in the last 7 days</p>
              </div>
              {isSynced && (
                <span className="flex items-center text-cyber-success bg-cyber-success/10 px-2 py-1 rounded-md text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" /> +12%
                </span>
              )}
            </div>

            {isSynced ? (
              <div className="flex items-end justify-between gap-3 h-48 pt-4">
                {WEEKLY_PLAYTIME_TEMPLATE.map((d) => (
                  <div key={d.day} className="flex flex-col items-center flex-1 gap-2">
                    <div className="w-full flex items-end justify-center" style={{ height: '100%' }}>
                      <div
                        className="w-full max-w-[40px] bg-cyber-accent/20 hover:bg-cyber-accent/40 rounded-t-md transition-all duration-300 relative group"
                        style={{ height: `${(d.h / maxWeekly) * 100}%` }}
                      >
                        <div
                          className="absolute bottom-0 w-full bg-cyber-accent rounded-t-md transition-all duration-500"
                          style={{ height: '60%' }}
                        />
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {d.h}h
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{d.day}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center border border-dashed border-gray-800 rounded-lg text-sm text-gray-500">
                <span>데이터가 없습니다. 외부 계정을 연동해 주십시오.</span>
              </div>
            )}
          </div>
        </div>

        {/* Game Library */}
        <div className="bg-cyber-card rounded-xl border border-gray-800 shadow-lg flex flex-col overflow-hidden min-h-[300px]">
          <div className="p-5 border-b border-gray-800">
            <h2 className="text-lg font-bold text-gray-100 mb-1">Game Library</h2>
            <p className="text-xs text-gray-500">
              {isSynced ? `${gameLibrary.length} games · ${totalHours} total hours` : '0 games'}
            </p>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-3 flex flex-col justify-center">
            {isSynced ? (
              gameLibrary.map((game, i) => {
                const hours = game.playtime || game.hours || 0;
                return (
                  <div key={game.title} className="bg-cyber-darker p-3 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors group cursor-pointer">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-semibold text-gray-200 group-hover:text-cyber-accent transition-colors truncate">{game.title}</h3>
                      <span className="text-xs font-medium bg-gray-800 text-gray-300 px-2 py-1 rounded shrink-0">{hours} hrs</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${COLOR_CLASSES[i % COLOR_CLASSES.length]} transition-all duration-700`} style={{ width: `${(hours / maxPlaytime) * 100}%` }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center space-y-4 py-6">
                <div className="inline-flex p-3 bg-cyber-purple/10 rounded-full text-cyber-purple border border-cyber-purple/20">
                  <RefreshCw className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-300">연동된 라이브러리 없음</p>
                  <p className="text-xs text-gray-500 max-w-[200px] mx-auto">Steam 또는 Riot 계정을 동기화하여 플레이 통계를 불러오세요.</p>
                </div>
                <div className="flex flex-col gap-2 pt-2 px-4">
                  <button
                    onClick={() => onSyncAccount('steam')}
                    className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-200 rounded-lg border border-gray-700 transition-colors"
                  >
                    Steam 연동 동기화
                  </button>
                  <button
                    onClick={() => onSyncAccount('riot')}
                    className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-200 rounded-lg border border-gray-700 transition-colors"
                  >
                    Riot Games 연동 동기화
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
