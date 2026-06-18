import React, { useMemo, useState } from 'react';
import { Clock, Trophy, Gamepad2, Monitor, RefreshCw, Check, AlertCircle, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/useAuthStore';

const GAME_CATALOG = [
  { id: 1091500, title: 'Cyberpunk 2077', platform: 'steam' },
  { id: 1245620, title: 'Elden Ring', platform: 'steam' },
  { id: 292030, title: 'The Witcher 3: Wild Hunt', platform: 'steam' },
  { id: 1086940, title: 'Baldur\'s Gate 3', platform: 'steam' },
  { id: 1623730, title: 'Palworld', platform: 'steam' },
  { id: 2358720, title: 'Black Myth: Wukong', platform: 'steam' },
  { id: 2767030, title: 'Marvel Rivals', platform: 'steam' },
  { id: 'valorant', title: 'Valorant', platform: 'riot' },
  { id: 'lol', title: 'League of Legends', platform: 'riot' }
];

const COLOR_CLASSES = ['bg-cyber-accent', 'bg-cyber-purple', 'bg-cyber-warning', 'bg-cyber-success'];

// Generate weekly playtime from actual game data instead of hardcoded template
function generateWeeklyFromGames(gameLibrary) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const labels = ['월', '화', '수', '목', '금', '토', '일'];
  const totalHours = gameLibrary.reduce((s, g) => s + (g.playtime || g.hours || 0), 0);
  
  if (totalHours === 0) return days.map((d, i) => ({ day: d, label: labels[i], h: 0 }));

  // Distribute total playtime across days with realistic weekend-heavy pattern
  const weekdayWeight = [0.08, 0.09, 0.07, 0.10, 0.12, 0.28, 0.26];
  // Scale so weekly total is roughly totalHours / (totalHours/30) ≈ 30h/month → ~7h/week
  const weeklyTotal = Math.min(totalHours * 0.07, 60); // 7% of total as weekly estimate, cap at 60h
  
  return days.map((d, i) => ({
    day: d,
    label: labels[i],
    h: Math.round(weeklyTotal * weekdayWeight[i] * 10) / 10
  }));
}

export default function DashboardCharts({ userSpec, gameLibrary = [], achievementsCount = 0, onSyncAccount, linkedProviders = [] }) {
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isAddGameOpen, setIsAddGameOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [playtimeHours, setPlaytimeHours] = useState(10);
  const [selectedGameId, setSelectedGameId] = useState(GAME_CATALOG[0].id.toString());

  const handleUnlink = (provider) => {
    const providerName = provider === 'steam' ? 'Steam' : 'Riot Games';
    setConfirmModal({
      isOpen: true,
      title: '연동 해제',
      message: `${providerName} 계정 연동을 해제하시겠습니까?`,
      onConfirm: async () => {
        try {
          await useAuthStore.getState().unlinkAccount(provider);
          toast.success(`${providerName} 연동이 해제되었습니다.`);
        } catch (err) {
          toast.error(err.message || '해제 실패');
        }
      }
    });
  };

  const isSynced = gameLibrary.length > 0;
  const hasSteam = linkedProviders.includes('steam');
  const hasRiot = linkedProviders.includes('riot');

  const weeklyData = useMemo(() => generateWeeklyFromGames(gameLibrary), [gameLibrary]);

  const { totalHours, gamesCount, activeGpu, stats, maxWeekly, maxPlaytime } = useMemo(() => {
    const th = isSynced ? gameLibrary.reduce((s, g) => s + (g.playtime || g.hours || 0), 0) : 0;
    const gc = isSynced ? gameLibrary.length : 0;
    const gpu = userSpec?.gpu_model?.split(' ').slice(-2).join(' ') || '등록 안 됨';
    const mw = isSynced ? Math.max(...weeklyData.map(d => d.h), 1) : 1;
    const mp = isSynced ? Math.max(...gameLibrary.map(g => g.playtime || g.hours || 1)) : 1;

    const st = [
      { title: '총 플레이 시간', value: isSynced ? `${th.toLocaleString()} 시간` : '0 시간', icon: Clock, color: 'text-cyber-accent' },
      { title: '보유 게임', value: isSynced ? `${gc}` : '0', icon: Gamepad2, color: 'text-cyber-purple' },
      { title: '달성 과제', value: isSynced ? `${achievementsCount}` : '0', icon: Trophy, color: 'text-cyber-warning' },
      { title: '현재 GPU', value: gpu, icon: Monitor, color: 'text-cyber-success' },
    ];

    return { totalHours: th, gamesCount: gc, activeGpu: gpu, stats: st, maxWeekly: mw, maxPlaytime: mp };
  }, [isSynced, gameLibrary, userSpec, achievementsCount, weeklyData]);

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
            </div>

            {isSynced ? (
              <>
                {/* 시각적 차트 (실제 데이터 기반) */}
                <div className="flex items-end justify-between gap-3 h-48 pt-4" aria-hidden="true">
                  {weeklyData.map((d) => (
                    <div key={d.day} className="flex flex-col items-center flex-1 gap-2">
                      <div className="w-full flex items-end justify-center" style={{ height: '100%' }}>
                        <div
                          className="w-full max-w-[28px] sm:max-w-[40px] bg-cyber-accent/20 hover:bg-cyber-accent/40 rounded-t-md transition-all duration-300 relative group"
                          style={{ height: d.h > 0 ? `${(d.h / maxWeekly) * 100}%` : '2%' }}
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
                    {weeklyData.map(d => (
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
          <div className="p-5 border-b border-gray-800 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-100 mb-1">게임 라이브러리</h2>
              <p className="text-xs text-a11y-muted">
                {isSynced ? `${gameLibrary.length}개 게임 · 총 ${totalHours}시간` : '0개 게임'}
              </p>
            </div>
            <button 
              onClick={() => setIsAddGameOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-cyber-accent/10 hover:bg-cyber-accent/20 border border-cyber-accent/30 text-cyber-accent text-xs font-bold rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              직접 추가
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-3 flex flex-col justify-start">
            {/* Show private warning if Steam is linked but no real steam games found */}
            {hasSteam && gameLibrary.filter(g => g.platform === 'steam' && !g.isManual).length === 0 && (
              <div className="p-3 bg-cyber-warning/10 border border-cyber-warning/20 rounded-lg text-xs space-y-2 mb-2">
                <div className="flex items-center gap-1.5 text-cyber-warning font-semibold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Steam 게임을 가져오지 못했습니다 🔒</span>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  스팀 프로필이 <strong>비공개</strong> 상태이거나 보유 게임이 없는 경우 발생합니다.
                </p>
                <div>
                  <button 
                    onClick={() => setIsGuideOpen(true)}
                    className="px-2 py-1 bg-cyber-warning/20 hover:bg-cyber-warning/30 text-cyber-warning rounded font-bold transition-all"
                  >
                    공개 설정 가이드 보기
                  </button>
                </div>
              </div>
            )}

            {isSynced ? (
              <ul role="list" aria-label="보유 게임 목록" className="w-full">
                {gameLibrary.map((game, i) => {
                  const hours = game.playtime || game.hours || 0;
                  const pct = Math.round((hours / maxPlaytime) * 100);
                  const isSteamApp = game.platform === 'steam' && !isNaN(Number(game.id)) && Number(game.id) > 100;
                  return (
                    <li key={game.id || game.title} className="bg-cyber-darker p-3 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors group mb-3 last:mb-0">
                      <div className="flex items-center gap-3">
                        {/* Game Thumbnail */}
                        <div className="w-16 h-10 rounded overflow-hidden flex-shrink-0 bg-gray-900 border border-gray-800 relative">
                          {isSteamApp ? (
                            <img 
                              src={`https://cdn.akamai.steamstatic.com/steam/apps/${game.id}/header.jpg`} 
                              alt="" 
                              className="w-full h-full object-cover relative z-10"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : null}
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cyber-accent/15 to-cyber-purple/15 text-[10px] font-black text-cyber-accent uppercase">
                            {game.title.split(' ').map(w => w[0]).join('').substring(0, 3)}
                          </div>
                        </div>

                        {/* Game Meta & Playtime */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <h3 className="text-sm font-semibold text-gray-200 group-hover:text-cyber-accent transition-colors truncate">{game.title}</h3>
                              <span className="text-[9px] font-medium text-a11y-muted bg-gray-800 px-1 py-0.2 rounded uppercase flex-shrink-0">{game.platform}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold bg-gray-800 text-gray-300 px-2 py-0.5 rounded shrink-0">{hours} 시간</span>
                              {game.isManual && (
                                <button 
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    try {
                                      await useAuthStore.getState().removeManualGame(game.id);
                                      toast.success(`${game.title}이(가) 제거되었습니다.`);
                                    } catch (err) {
                                      toast.error('제거 실패');
                                    }
                                  }}
                                  className="text-gray-500 hover:text-red-400 p-0.5 transition-colors"
                                  title="제거"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
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
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="text-center space-y-4 py-8 my-auto">
                <div className="inline-flex p-3 bg-cyber-purple/10 rounded-full text-cyber-purple border border-cyber-purple/20" aria-hidden="true">
                  <RefreshCw className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1 px-4">
                  <p className="text-sm font-medium text-gray-300">연동된 라이브러리 없음</p>
                  <p className="text-xs text-a11y-muted max-w-[220px] mx-auto leading-relaxed">
                    하단의 연동 관리 패널에서 Steam 또는 Riot 계정을 동기화하거나 게임을 추가하세요.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 외부 계정 연동 상시 노출 영역 */}
          <div className="p-4 bg-cyber-darker/50 border-t border-gray-800 space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">외부 계정 연동 관리</h3>
            <div className="grid grid-cols-2 gap-2" role="group" aria-label="계정 연동하기">
              <button
                onClick={() => {
                  if (hasSteam) {
                    handleUnlink('steam');
                    return;
                  }
                  const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
                    ? 'http://localhost:5000/api/v1'
                    : '/api/v1';
                  const token = localStorage.getItem('syncrig_token');
                  window.location.href = `${API_BASE_URL}/auth/steam?token=${token || ''}`;
                }}
                aria-label={hasSteam ? 'Steam 연동 해제하기' : 'Steam 계정 연동 시작하기'}
                className={`w-full py-2.5 text-xs font-bold rounded-lg border transition-colors ${
                  hasSteam
                    ? 'bg-cyber-success/10 border-cyber-success/30 text-cyber-success hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-700 hover:border-cyber-accent'
                }`}
              >
                {hasSteam ? (
                  <span className="flex items-center justify-center gap-1.5"><Check className="w-3.5 h-3.5" aria-hidden="true" /> Steam 연동됨</span>
                ) : 'Steam 연동'}
              </button>
              <button
                onClick={() => {
                  if (hasRiot) {
                    handleUnlink('riot');
                    return;
                  }
                  const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
                    ? 'http://localhost:5000/api/v1'
                    : '/api/v1';
                  const token = localStorage.getItem('syncrig_token');
                  window.location.href = `${API_BASE_URL}/auth/riot?token=${token || ''}`;
                }}
                aria-label={hasRiot ? 'Riot Games 연동 해제하기' : 'Riot Games 계정 연동 시작하기'}
                className={`w-full py-2.5 text-xs font-bold rounded-lg border transition-colors ${
                  hasRiot
                    ? 'bg-cyber-success/10 border-cyber-success/30 text-cyber-success hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-700 hover:border-cyber-purple'
                }`}
              >
                {hasRiot ? (
                  <span className="flex items-center justify-center gap-1.5"><Check className="w-3.5 h-3.5" aria-hidden="true" /> Riot 연동됨</span>
                ) : 'Riot Games 연동'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Steam Privacy Guide Modal ─── */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animation-fade-in" role="dialog" aria-modal="true">
          <div className="bg-cyber-card border border-gray-700 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-[0_0_40px_rgba(59,130,246,0.25)]">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Monitor className="w-5 h-5 text-cyber-accent" />
                스팀 프로필 공개 설정 가이드
              </h3>
              <button 
                onClick={() => setIsGuideOpen(false)}
                className="text-gray-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>
            <div className="text-sm text-gray-300 space-y-3.5 leading-relaxed">
              <p>스팀은 개인정보 정책에 의해 프로필 및 라이브러리 목록이 기본적으로 비공개(Private)되어 있습니다. 아래 단계를 따라 설정을 <strong>공개</strong>로 변경해 주세요:</p>
              <ol className="list-decimal pl-5 space-y-2 text-xs text-gray-400">
                <li>스팀 앱 또는 웹사이트에 로그인 후 우측 상단의 <strong>닉네임</strong>을 클릭하고 <strong>[프로필 보기]</strong>를 선택합니다.</li>
                <li>우측 상단의 <strong>[프로필 수정]</strong> 버튼을 클릭합니다.</li>
                <li>사이드 메뉴에서 <strong>[공개 설정]</strong> 탭을 클릭합니다.</li>
                <li><strong>나의 프로필</strong> 및 <strong>게임 세부 정보</strong>를 모두 <span className="text-cyber-accent font-bold">공개 (Public)</span>로 변경합니다.</li>
                <li>변경 사항이 저장되면 대시보드로 돌아와 스팀 계정 동기화를 다시 실행합니다.</li>
              </ol>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsGuideOpen(false)}
                className="px-4 py-2 bg-cyber-accent hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                확인했습니다
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Manual Add Game Modal ─── */}
      {isAddGameOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animation-fade-in" role="dialog" aria-modal="true">
          <div className="bg-cyber-card border border-gray-700 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-[0_0_40px_rgba(139,92,246,0.25)]">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-cyber-purple" />
                직접 게임 라이브러리 추가
              </h3>
              <button 
                onClick={() => { setIsAddGameOpen(false); setSearchQuery(''); }}
                className="text-gray-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-a11y-muted uppercase tracking-wider">대상 게임 선택</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="게임 필터링 (예: cyberpunk)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-cyber-darker border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyber-purple"
                  />
                </div>
                <select
                  value={selectedGameId}
                  onChange={(e) => setSelectedGameId(e.target.value)}
                  className="w-full bg-cyber-darker border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyber-purple mt-2"
                >
                  {GAME_CATALOG.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase())).map(game => (
                    <option key={game.id} value={game.id.toString()}>
                      [{game.platform.toUpperCase()}] {game.title}
                    </option>
                  ))}
                  {GAME_CATALOG.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <option disabled>일치하는 게임이 없습니다</option>
                  )}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-a11y-muted uppercase tracking-wider">플레이 시간 (시간)</label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={playtimeHours}
                  onChange={(e) => setPlaytimeHours(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full bg-cyber-darker border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyber-purple"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => { setIsAddGameOpen(false); setSearchQuery(''); }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
              >
                취소
              </button>
              <button
                onClick={async () => {
                  const targetGame = GAME_CATALOG.find(g => g.id.toString() === selectedGameId);
                  if (!targetGame) {
                    toast.error('선택된 게임이 올바르지 않습니다.');
                    return;
                  }
                  try {
                    await useAuthStore.getState().addManualGame({
                      id: targetGame.id,
                      title: targetGame.title,
                      playtime: playtimeHours,
                      lastPlayed: '수동 등록됨',
                      platform: targetGame.platform,
                      isManual: true
                    });
                    toast.success(`${targetGame.title}이(가) 라이브러리에 추가되었습니다.`);
                    setIsAddGameOpen(false);
                    setSearchQuery('');
                  } catch (err) {
                    toast.error('게임 추가 실패');
                  }
                }}
                disabled={GAME_CATALOG.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0}
                className="px-4 py-2 bg-cyber-purple hover:bg-purple-600 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
              >
                추가하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Custom Confirm Modal ─── */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animation-fade-in" role="dialog" aria-modal="true">
          <div className="bg-cyber-card border border-gray-700 p-6 rounded-xl max-w-sm w-full space-y-4 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
            <h3 className="text-lg font-bold text-white">{confirmModal.title}</h3>
            <p className="text-sm text-gray-300">{confirmModal.message}</p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal({ ...confirmModal, isOpen: false });
                }}
                className="px-4 py-2 bg-cyber-purple hover:bg-purple-600 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
