import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as api from './api/apiClient';
import HardwareProfileForm from './components/HardwareProfileForm';
import RecommendationList from './components/RecommendationList';
import DashboardCharts from './features/dashboard/DashboardCharts';
import SettingsView from './features/settings/SettingsView';
import useSEO from './hooks/useSEO';
import { Gamepad2, LayoutDashboard, Cpu, Settings2, Settings, Bell, Search, Loader2, LogOut, Key, User, Plus, Check, RefreshCw } from 'lucide-react';

/* ─── Sidebar Navigation ─── */
const NAV = [
  { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
  { id: 'hardware', label: '하드웨어 프로필', icon: Cpu },
  { id: 'recommend', label: '최적화 허브', icon: Settings2 },
  { id: 'settings', label: '환경 설정', icon: Settings },
];

/* ─── Loading State ─── */
function MatchingLoader() {
  const [step, setStep] = useState(0);
  const steps = ['하드웨어 사양 분석', '매칭 엔진 유사도 연산', '최적 프리셋 산출'];
  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 600);
    const t2 = setTimeout(() => setStep(2), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div
      className="bg-cyber-card rounded-xl border border-gray-800 p-10 max-w-md mx-auto animation-fade-in"
      role="status"
      aria-live="polite"
      aria-label="매칭 엔진 처리 중"
    >
      <div className="flex justify-center mb-8">
        <Loader2 size={36} className="text-cyber-accent animate-spin" aria-hidden="true" />
      </div>
      <div className="space-y-3">
        {steps.map((s, i) => (
          <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-300 ${
            i <= step ? 'bg-cyber-darker border border-gray-700 text-gray-200' : 'text-gray-600'
          }`}>
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                i < step ? 'bg-cyber-success text-white' : i === step ? 'bg-cyber-accent text-white' : 'bg-gray-800 text-gray-600'
              }`}
              aria-hidden="true"
            >{i + 1}</span>
            <span className="flex-1">{s}</span>
            {i < step && <span className="text-cyber-success text-xs font-medium" aria-label={`${s} 완료`}>완료</span>}
            {i === step && <div className="w-2 h-2 rounded-full bg-cyber-accent animate-pulse" aria-hidden="true" />}
          </div>
        ))}
      </div>
      {/* 스크린리더 전용 현재 상태 안내 */}
      <div className="sr-only" aria-live="assertive">
        {steps[step]} 진행 중
      </div>
    </div>
  );
}

/* ─── Auth Component (Login / Register / OAuth) ─── */
function AuthScreen({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('모든 항목을 입력해주세요.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      let data;
      if (isLogin) {
        data = await api.login(username, password);
      } else {
        data = await api.register(username, password);
      }
      onAuthSuccess(data.user);
    } catch (err) {
      setError(err.message || '인증 처리에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    setError('');
    setIsLoading(true);
    try {
      const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
      const data = await api.oauthCallback(provider, mockCode);
      onAuthSuccess(data.user);
    } catch (err) {
      setError(`${provider} 인증 연동 실패`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-darker p-4 animation-fade-in">
      <div className="w-full max-w-md bg-cyber-card border border-gray-800 rounded-2xl p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-cyber-accent/10 rounded-full border border-cyber-accent/20 text-cyber-accent mb-2" aria-hidden="true">
            <Gamepad2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyber-accent to-cyber-purple">
            SYNCRIG PLATFORM
          </h1>
          <p className="text-sm text-a11y-muted">통합 게임 데이터 분석 및 그래픽 최적화 플랫폼</p>
        </div>

        {/* Tabs — role="tablist" for a11y */}
        <div className="flex bg-cyber-darker p-1 rounded-lg border border-gray-800" role="tablist" aria-label="인증 방식 선택">
          <button
            type="button"
            role="tab"
            id="tab-login"
            aria-selected={isLogin}
            aria-controls="panel-auth"
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              isLogin ? 'bg-cyber-card text-cyber-accent shadow' : 'text-a11y-muted hover:text-gray-200'
            }`}
          >
            로그인
          </button>
          <button
            type="button"
            role="tab"
            id="tab-register"
            aria-selected={!isLogin}
            aria-controls="panel-auth"
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              !isLogin ? 'bg-cyber-card text-cyber-accent shadow' : 'text-a11y-muted hover:text-gray-200'
            }`}
          >
            회원가입
          </button>
        </div>

        {/* Error Message — role="alert" for screen readers */}
        {error && (
          <div
            className="bg-cyber-danger/10 border border-cyber-danger/30 text-cyber-danger text-xs px-4 py-3 rounded-lg"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4" id="panel-auth" role="tabpanel" aria-labelledby={isLogin ? 'tab-login' : 'tab-register'}>
          <div className="space-y-1">
            <label htmlFor="auth-username" className="text-xs font-semibold text-a11y-muted uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" aria-hidden="true" /> 사용자 아이디
            </label>
            <input
              id="auth-username"
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              aria-required="true"
              className="w-full bg-cyber-darker border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyber-accent transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="auth-password" className="text-xs font-semibold text-a11y-muted uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" aria-hidden="true" /> 비밀번호
            </label>
            <input
              id="auth-password"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              aria-required="true"
              className="w-full bg-cyber-darker border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyber-accent transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
            className="w-full flex items-center justify-center py-3 bg-cyber-accent hover:bg-blue-600 text-white rounded-lg transition-colors font-medium shadow-[0_0_15px_rgba(59,130,246,0.2)] disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" aria-label="처리 중" /> : isLogin ? '로그인' : '회원가입 완료'}
          </button>
        </form>

        <div className="relative flex py-2 items-center" role="separator">
          <div className="flex-grow border-t border-gray-800"></div>
          <span className="flex-shrink mx-4 text-xs font-bold text-a11y-muted uppercase tracking-widest">또는 계정 연동</span>
          <div className="flex-grow border-t border-gray-800"></div>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-3" role="group" aria-label="소셜 계정 연동">
          <button
            type="button"
            onClick={() => handleOAuth('steam')}
            disabled={isLoading}
            aria-label="Steam 계정으로 로그인"
            className="flex items-center justify-center gap-2 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold rounded-lg border border-gray-700 transition-colors"
          >
            Steam 로그인
          </button>
          <button
            type="button"
            onClick={() => handleOAuth('riot')}
            disabled={isLoading}
            aria-label="Riot Games 계정으로 로그인"
            className="flex items-center justify-center gap-2 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold rounded-lg border border-gray-700 transition-colors"
          >
            Riot Games 로그인
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main App ─── */
export default function App() {
  const [user, setUser] = useState(null);
  const [userSpec, setUserSpec] = useState(null);
  const [gameLibrary, setGameLibrary] = useState([]);
  const [achievementsCount, setAchievementsCount] = useState(0);

  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // 사이드바 키보드 내비게이션 ref
  const navRefs = useRef([]);

  // SEO 훅 — 탭 전환 시 타이틀/메타 자동 업데이트
  useSEO(activeTab);

  // Check auth state and load user details on mount
  useEffect(() => {
    const token = api.getToken();
    if (token) {
      let sessionUser = { id: 'user-mock-id', provider: 'local', provider_id: 'User' };
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        sessionUser = { id: payload.id, provider: payload.provider, provider_id: payload.provider_id };
      } catch(e) {
        // Fallback for old tokens
        const isSteam = token.includes('steam');
        const isRiot = token.includes('riot');
        const provider = isSteam ? 'steam' : isRiot ? 'riot' : 'local';
        const providerId = token.replace('mock_jwt_token_for_', '');
        sessionUser = { id: 'user-mock-id', provider, provider_id: providerId };
      }
      
      const linked = JSON.parse(localStorage.getItem('syncrig_linked_providers') || '[]');
      sessionUser.linked_providers = linked;
      
      setUser(sessionUser);
      initializeUserData(sessionUser);
    }
  }, []);

  // Fetch games, achievements, and hardware specs for the user
  const initializeUserData = async (currentUser) => {
    if (!currentUser) return;
    
    // 1. Fetch hardware profiles to establish default spec
    try {
      const profiles = await api.fetchHardwareProfiles();
      const defaultProfile = profiles.find(p => p.is_default || p.isDefault) || profiles[0];
      if (defaultProfile) {
        setUserSpec({
          cpu_model: defaultProfile.cpu_model || defaultProfile.cpu,
          gpu_model: defaultProfile.gpu_model || defaultProfile.gpu,
          ram_gb: parseInt(defaultProfile.ram_gb || defaultProfile.ram) || 16,
          resolution: defaultProfile.resolution,
          refresh_rate: parseInt(defaultProfile.refresh_rate || defaultProfile.refreshRate) || 144
        });
      } else {
        setUserSpec(null);
      }
    } catch (e) {
      console.error('Failed to load hardware profiles', e);
      setUserSpec(null);
    }

    // 2. Fetch games library if user registered via social or has linked accounts
    const hasSocial = currentUser.provider === 'steam' || currentUser.provider === 'riot' || currentUser.linked_providers?.length > 0;
    if (hasSocial) {
      try {
        const games = await api.syncGameLibrary();
        setGameLibrary(games);
        setAchievementsCount(854);
      } catch (e) {
        console.error('Failed to sync games', e);
      }
    } else {
      setGameLibrary([]);
      setAchievementsCount(0);
    }
  };

  const loadRecommendations = async (specs) => {
    if (!user || !specs) return;
    setIsLoading(true);
    try {
      const data = await api.fetchRecommendations(specs);
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error('추천 데이터 로드 실패', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && userSpec) {
      loadRecommendations(userSpec);
    }
  }, [userSpec, user]);

  const handleHardwareUpdate = (newSpec) => {
    setUserSpec(newSpec);
    setActiveTab('recommend');
  };

  const handleLogout = () => {
    api.setToken(null);
    localStorage.removeItem('syncrig_linked_providers');
    setUser(null);
    setUserSpec(null);
    setGameLibrary([]);
    setAchievementsCount(0);
  };

  // Sync external account simulator on dashboard
  const handleSyncAccount = async (provider) => {
    setIsSyncing(true);
    try {
      // API 통신 딜레이 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 현재 유저 정보(sessionUser)를 덮어씌우지 않고, 연동된 프로바이더 목록만 추가
      const newLinked = Array.from(new Set([...(user.linked_providers || []), provider]));
      localStorage.setItem('syncrig_linked_providers', JSON.stringify(newLinked));
      
      setUser(prev => ({
        ...prev,
        linked_providers: newLinked
      }));
      
      // Fetch libraries
      const games = await api.syncGameLibrary();
      setGameLibrary(games);
      setAchievementsCount(854);
    } catch (err) {
      console.error('Sync failed', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // 사이드바 키보드 내비게이션 핸들러
  const handleNavKeyDown = useCallback((e, index) => {
    let nextIndex = index;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (index + 1) % NAV.length;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (index - 1 + NAV.length) % NAV.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = NAV.length - 1;
    }
    if (nextIndex !== index) {
      navRefs.current[nextIndex]?.focus();
    }
  }, []);

  // If not authenticated, render AuthScreen
  if (!user) {
    return <AuthScreen onAuthSuccess={(authenticatedUser) => {
      setUser(authenticatedUser);
      initializeUserData(authenticatedUser);
    }} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-cyber-darker text-gray-100">

      {/* ─── Skip Navigation (웹접근성) ─── */}
      <a href="#main-content" className="skip-nav">
        본문으로 건너뛰기
      </a>

      {/* ─── Syncing Backdrop overlay ─── */}
      {isSyncing && (
        <div
          className="fixed inset-0 bg-cyber-darker/80 backdrop-blur-md flex items-center justify-center z-[100] animation-fade-in"
          role="alert"
          aria-live="assertive"
          aria-busy="true"
        >
          <div className="text-center space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-cyber-accent mx-auto" aria-hidden="true" />
            <p className="text-sm font-semibold text-gray-200">외부 계정 연동 동기화 중...</p>
            <p className="text-xs text-a11y-muted">Steam/Riot 라이브러리 및 하드웨어 통계를 가져오는 중입니다.</p>
          </div>
        </div>
      )}

      {/* ─── Sidebar ─── */}
      <aside className="hidden md:flex w-64 bg-cyber-card border-r border-gray-800 flex-col h-full shrink-0" aria-label="사이드바 메뉴">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <Gamepad2 className="w-7 h-7 text-cyber-accent mr-3" aria-hidden="true" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyber-accent to-cyber-purple">
            SYNCRIG
          </span>
        </div>

        {/* Nav */}
        <div className="p-4 flex-1">
          <div className="text-xs font-semibold text-a11y-muted uppercase tracking-wider mb-4 px-2" id="sidebar-nav-label">메뉴</div>
          <nav aria-labelledby="sidebar-nav-label" role="navigation">
            <ul className="space-y-1" role="list">
              {NAV.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id} role="listitem">
                    <button
                      ref={(el) => (navRefs.current[index] = el)}
                      onClick={() => setActiveTab(item.id)}
                      onKeyDown={(e) => handleNavKeyDown(e, index)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive ? 'bg-cyber-dark text-cyber-accent' : 'text-a11y-muted hover:bg-cyber-dark hover:text-gray-200'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3 flex-shrink-0" aria-hidden="true" />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-gray-800 space-y-3">
          <div className="flex items-center px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-cyber-dark flex items-center justify-center border border-gray-700 text-sm font-bold text-cyber-accent uppercase" aria-hidden="true">
              {user.provider_id ? user.provider_id.substring(0, 1) : 'U'}
            </div>
            <div className="ml-3 truncate max-w-[130px]">
              <p className="text-sm font-medium text-gray-200 truncate">{user.provider_id || 'User'}</p>
              <p className="text-[10px] text-a11y-muted capitalize">
                {user.provider} 계정 {user.linked_providers?.length > 0 && `(+ 연동)`}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            aria-label="로그아웃"
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-a11y-muted hover:text-white bg-gray-800/40 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 rounded-lg transition-colors"
          >
            <LogOut size={13} aria-hidden="true" /> 로그아웃
          </button>
        </div>
      </aside>

      {/* ─── Main Area ─── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-cyber-card/50 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-6 shrink-0" role="banner">
          {/* Mobile menu */}
          <div className="md:hidden flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-cyber-accent" aria-hidden="true" />
            <span className="font-bold text-lg">SYNCRIG</span>
          </div>
          {/* Search */}
          <div className="hidden md:flex items-center bg-cyber-darker rounded-full px-4 py-2 border border-gray-800 w-96" role="search">
            <Search className="w-4 h-4 text-a11y-muted mr-2" aria-hidden="true" />
            <input
              type="search"
              placeholder="게임, 프로필 검색..."
              aria-label="게임 또는 프로필 검색"
              className="bg-transparent border-none outline-none text-sm w-full text-gray-200 placeholder-gray-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="p-2 rounded-full hover:bg-cyber-dark transition-colors relative text-a11y-muted hover:text-gray-200"
              aria-label="알림 (새 알림 있음)"
              aria-haspopup="true"
            >
              <Bell className="w-5 h-5" aria-hidden="true" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyber-danger rounded-full ring-2 ring-cyber-card" aria-hidden="true"></span>
            </button>
            <button
              onClick={handleLogout}
              className="md:hidden p-2 rounded-full hover:bg-cyber-dark text-a11y-muted hover:text-white transition-colors"
              aria-label="로그아웃"
            >
              <LogOut className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main id="main-content" className="flex-1 overflow-y-auto p-6 scroll-smooth" tabIndex="-1">
          <div className="max-w-7xl mx-auto">

            {/* ─── Dashboard ─── */}
            {activeTab === 'dashboard' && (
              <section className="space-y-6 animation-fade-in" aria-labelledby="heading-dashboard">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 id="heading-dashboard" className="text-2xl font-bold text-gray-100 mb-2">환영합니다, {user.provider_id}님</h1>
                    <p className="text-a11y-muted">오늘의 게임 및 하드웨어 요약입니다.</p>
                  </div>
                  {/* Account linking status indicator */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-a11y-muted">계정 연동 상태:</span>
                    {gameLibrary.length > 0 ? (
                      <span className="text-xs font-semibold bg-cyber-success/10 border border-cyber-success/20 text-cyber-success px-3 py-1.5 rounded-full flex items-center gap-1.5" role="status">
                        <Check className="w-3 h-3" aria-hidden="true" /> Steam/Riot 활성됨
                      </span>
                    ) : (
                      <span className="text-xs font-semibold bg-gray-800 border border-gray-700 text-a11y-muted px-3 py-1.5 rounded-full flex items-center gap-1.5" role="status">
                        미연동
                      </span>
                    )}
                  </div>
                </div>
                <DashboardCharts
                  userSpec={userSpec}
                  gameLibrary={gameLibrary}
                  achievementsCount={achievementsCount}
                  onSyncAccount={handleSyncAccount}
                />
              </section>
            )}

            {/* ─── Hardware ─── */}
            {activeTab === 'hardware' && (
              <section className="animation-fade-in" aria-labelledby="heading-hardware">
                <h1 id="heading-hardware" className="sr-only">하드웨어 프로필 관리</h1>
                <HardwareProfileForm onSave={handleHardwareUpdate} />
              </section>
            )}

            {/* ─── Optimization Hub ─── */}
            {activeTab === 'recommend' && (
              <section className="space-y-6 animation-fade-in" aria-labelledby="heading-recommend">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 id="heading-recommend" className="text-2xl font-bold text-gray-100 mb-1">최적화 허브</h1>
                    <p className="text-a11y-muted">보유하신 하드웨어에 가장 적합한 그래픽 설정을 찾아보세요.</p>
                  </div>
                </div>

                {userSpec ? (
                  <>
                    {/* Active Profile Context */}
                    <div className="flex items-center justify-between text-sm text-a11y-muted bg-cyber-darker/50 p-3 rounded-lg border border-gray-800/50">
                      <div className="flex items-center">
                        <Cpu className="w-4 h-4 mr-2 text-cyber-success" aria-hidden="true" />
                        현재 매칭 기준: <strong className="text-gray-200 ml-1">{userSpec.gpu_model}</strong>
                      </div>
                    </div>

                    {isLoading ? (
                      <MatchingLoader />
                    ) : (
                      <RecommendationList recommendations={recommendations} userSpec={userSpec} />
                    )}
                  </>
                ) : (
                  <div className="text-center py-16 bg-cyber-card rounded-xl border border-gray-800 max-w-lg mx-auto space-y-6 animation-fade-in">
                    <div className="inline-flex p-4 bg-cyber-accent/10 text-cyber-accent rounded-full border border-cyber-accent/20" aria-hidden="true">
                      <Cpu className="w-8 h-8" />
                    </div>
                    <div className="space-y-2 px-6">
                      <h2 className="text-lg font-bold text-gray-200">하드웨어 프로필이 없습니다</h2>
                      <p className="text-sm text-a11y-muted leading-relaxed">
                        추천 그래픽 세팅 엔진을 기동하려면 먼저 사용 중이신 PC 사양을 프로필로 등록해 주셔야 합니다.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('hardware')}
                      className="px-6 py-2.5 bg-cyber-accent hover:bg-blue-600 text-white rounded-lg transition-colors font-semibold text-sm shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                    >
                      프로필 등록하러 가기
                    </button>
                  </div>
                )}
              </section>
            )}
            {/* ─── Settings ─── */}
            {activeTab === 'settings' && (
              <section className="animation-fade-in" aria-labelledby="heading-settings">
                <h1 id="heading-settings" className="sr-only">환경 설정</h1>
                <SettingsView user={user} onUpdateNickname={(name) => setUser({...user, provider_id: name})} />
              </section>
            )}
          </div>
        </main>
      </div>

      {/* ─── Mobile Bottom Nav ─── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-cyber-card/95 backdrop-blur border-t border-gray-800 z-50" aria-label="모바일 메뉴">
        <div className="grid grid-cols-4 h-16" role="list">
          {NAV.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                aria-current={activeTab === item.id ? 'page' : undefined}
                aria-label={item.label}
                role="listitem"
                className={`flex flex-col items-center justify-center gap-1 ${
                  activeTab === item.id ? 'text-cyber-accent' : 'text-a11y-muted'
                }`}
              >
                <Icon size={18} aria-hidden="true" />
                <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
