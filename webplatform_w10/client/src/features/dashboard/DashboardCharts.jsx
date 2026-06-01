import React, { useMemo } from 'react';
import { Clock, Trophy, Gamepad2, Monitor, TrendingUp, RefreshCw } from 'lucide-react';

const WEEKLY_PLAYTIME_TEMPLATE = [
  { day: 'Mon', label: '월', h: 2.5 }, { day: 'Tue', label: '화', h: 3.8 }, { day: 'Wed', label: '수', h: 1.5 },
  { day: 'Thu', label: '목', h: 4.2 }, { day: 'Fri', label: '금', h: 5.5 }, { day: 'Sat', label: '토', h: 8.4 }, { day: 'Sun', label: '일', h: 7.2 },
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
      { title: '총 플레이 시간', value: isSynced ? `${th.toLocaleString()} 시간` : '0 시간', icon: Clock, color: 'text-cyber-accent' },
      { title: '보유 게임', value: isSynced ? `${gc}` : '0', icon: Gamepad2, color: 'text-cyber-purple' },
      { title: '달성 과제', value: isSynced ? `${achievementsCount}` : '0', icon: Trophy, color: 'text-cyber-warning' },
      { title: '현재 GPU', value: gpu, icon: Monitor, color: 'text-cyber-success' },
    ];

    return { totalHours: th, gamesCount: gc, activeGpu: gpu, stats: st, maxWeekly: mw, maxPlaytime: mp };
  }, [isSynced, gameLibrary, userSpec, achievementsCount]);

  return (
    <div className="space-y-6">
      {/* ── Stats Cards (4-col) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" role="group" aria-label="주요 통계 요약">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-cyber-card rounded-xl p-5 border border-gray-800 shadow-lg hover:border-gray-700 transition-colors" aria-label={`${stat.title}: ${stat.value}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-a11y-muted text-sm font-medium">{stat.title}</h3>
                <Icon className={`w-5 h-5 ${stat.color}`} aria-hidden="true" />
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
                <h2 className="text-lg font-bold text-gray-100">플레이 시간 통계</h2>
                <p className="text-sm text-a11y-muted">최근 7일간 플레이 시간</p>
              </div>
              {isSynced && (
                <span className="flex items-center text-cyber-success bg-cyber-success/10 px-2 py-1 rounded-md text-sm" aria-label="전주 대비 12% 증가">
                  <TrendingUp className="w-4 h-4 mr-1" aria-hidden="true" /> +12%
                </span>
              )}
            </div>

            {isSynced ? (
              <>
                {/* 시각적 차트 (장식용) */}
                <div className="flex items-end justify-between gap-3 h-48 pt-4" aria-hidden="true">
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
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-a11y-muted opacity-0 group-hover:opacity-100 transition-opacity">
                            {d.h}h
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-a11y-muted font-medium">{d.day}</span>
                    </div>
                  ))}
                </div>

                {/* 스크린리더 전용 데이터 테이블 (차트 대체 텍스트) */}
                <table className="sr-only" aria-label="최근 7일간 플레이 시간 데이터">
                  <thead>
                    <tr>
                      <th scope="col">요일</th>
                      <th scope="col">플레이 시간</th>
                    </tr>
                  </thead>
                  <tbody>
                    {WEEKLY_PLAYTIME_TEMPLATE.map(d => (
                      <tr key={d.day}>
                        <td>{d.label}요일 ({d.day})</td>
                        <td>{d.h}시간</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center border border-dashed border-gray-800 rounded-lg text-sm text-a11y-muted" role="status">
                <span>데이터가 없습니다. 외부 계정을 연동해 주십시오.</span>
              </div>
            )}
          </div>
        </div>

        {/* Game Library */}
        <div className="bg-cyber-card rounded-xl border border-gray-800 shadow-lg flex flex-col overflow-hidden min-h-[300px]">
          <div className="p-5 border-b border-gray-800">
            <h2 className="text-lg font-bold text-gray-100 mb-1">게임 라이브러리</h2>
            <p className="text-xs text-a11y-muted">
              {isSynced ? `${gameLibrary.length}개 게임 · 총 ${totalHours}시간` : '0개 게임'}
            </p>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-3 flex flex-col justify-center">
            {isSynced ? (
              <ul role="list" aria-label="보유 게임 목록">
                {gameLibrary.map((game, i) => {
                  const hours = game.playtime || game.hours || 0;
                  const pct = Math.round((hours / maxPlaytime) * 100);
                  return (
                    <li key={game.title} className="bg-cyber-darker p-3 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors group cursor-pointer mb-3 last:mb-0">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-semibold text-gray-200 group-hover:text-cyber-accent transition-colors truncate">{game.title}</h3>
                        <span className="text-xs font-medium bg-gray-800 text-gray-300 px-2 py-1 rounded shrink-0">{hours} 시간</span>
                      </div>
                      <div
                        className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden"
                        role="progressbar"
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${game.title} 플레이 비중 ${pct}%`}
                      >
                        <div className={`h-full rounded-full ${COLOR_CLASSES[i % COLOR_CLASSES.length]} transition-all duration-700`} style={{ width: `${pct}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="text-center space-y-4 py-6">
                <div className="inline-flex p-3 bg-cyber-purple/10 rounded-full text-cyber-purple border border-cyber-purple/20" aria-hidden="true">
                  <RefreshCw className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-300">연동된 라이브러리 없음</p>
                  <p className="text-xs text-a11y-muted max-w-[200px] mx-auto">Steam 또는 Riot 계정을 동기화하여 플레이 통계를 불러오세요.</p>
                </div>
                <div className="flex flex-col gap-2 pt-2 px-4" role="group" aria-label="계정 연동 동기화">
                  <button
                    onClick={() => onSyncAccount('steam')}
                    aria-label="Steam 계정 연동 동기화"
                    className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-200 rounded-lg border border-gray-700 transition-colors"
                  >
                    Steam 연동 동기화
                  </button>
                  <button
                    onClick={() => onSyncAccount('riot')}
                    aria-label="Riot Games 계정 연동 동기화"
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
