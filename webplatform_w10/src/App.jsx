import React, { useState, useEffect } from 'react';
import * as api from './api';
import HardwareProfileForm from './components/HardwareProfileForm';
import RecommendationList from './components/RecommendationList';
import DashboardCharts from './DashboardCharts';
import { Gamepad2, LayoutDashboard, Cpu, Settings2, Bell, Search, Loader2, LogOut, Key, User, Plus, Check } from 'lucide-react';

/* ─── Sidebar Navigation ─── */
const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'hardware', label: 'Hardware Profiles', icon: Cpu },
  { id: 'recommend', label: 'Optimization Hub', icon: Settings2 },
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
    <div className="bg-cyber-card rounded-xl border border-gray-800 p-10 max-w-md mx-auto animation-fade-in">
      <div className="flex justify-center mb-8">
        <Loader2 size={36} className="text-cyber-accent animate-spin" />
      </div>
      <div className="space-y-3">
        {steps.map((s, i) => (
          <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-300 ${
            i <= step ? 'bg-cyber-darker border border-gray-700 text-gray-200' : 'text-gray-600'
          }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              i < step ? 'bg-cyber-success text-white' : i === step ? 'bg-cyber-accent text-white' : 'bg-gray-800 text-gray-600'
            }`}>{i + 1}</span>
            <span className="flex-1">{s}</span>
            {i < step && <span className="text-cyber-success text-xs font-medium">완료</span>}
            {i === step && <div className="w-2 h-2 rounded-full bg-cyber-accent animate-pulse" />}
          </div>
        ))}
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
          <div className="inline-flex p-3 bg-cyber-accent/10 rounded-full border border-cyber-accent/20 text-cyber-accent mb-2">
            <Gamepad2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyber-accent to-cyber-purple">
            SYNCRIG PLATFORM
          </h1>
          <p className="text-sm text-gray-400">통합 게임 데이터 분석 및 그래픽 최적화 플랫폼</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-cyber-darker p-1 rounded-lg border border-gray-800">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              isLogin ? 'bg-cyber-card text-cyber-accent shadow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            로그인
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              !isLogin ? 'bg-cyber-card text-cyber-accent shadow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            회원가입
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-cyber-danger/10 border border-cyber-danger/30 text-cyber-danger text-xs px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> 사용자 아이디
            </label>
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-cyber-darker border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyber-accent transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" /> 비밀번호
            </label>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-cyber-darker border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyber-accent transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center py-3 bg-cyber-accent hover:bg-blue-600 text-white rounded-lg transition-colors font-medium shadow-[0_0_15px_rgba(59,130,246,0.2)] disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : isLogin ? '로그인' : '회원가입 완료'}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-800"></div>
          <span className="flex-shrink mx-4 text-xs font-bold text-gray-500 uppercase tracking-widest">or connect account</span>
          <div className="flex-grow border-t border-gray-800"></div>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleOAuth('steam')}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold rounded-lg border border-gray-700 transition-colors"
          >
            Steam 로그인
          </button>
          <button
            type="button"
            onClick={() => handleOAuth('riot')}
            disabled={isLoading}
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
  const [userSpec, setUserSpec] = useState({
    cpu_model: 'AMD Ryzen 5 5600X',
    gpu_model: 'NVIDIA GeForce RTX 3060',
    ram_gb: 16,
    resolution: 'FHD',
    refresh_rate: 144,
  });

  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Check auth state on mount
  useEffect(() => {
    const token = api.getToken();
    if (token) {
      // Decode user from mock or simple string representation (or fallback object)
      setUser({
        id: 'user-mock-id',
        provider: token.includes('steam') ? 'steam' : token.includes('riot') ? 'riot' : 'local',
        provider_id: token.replace('mock_jwt_token_for_', '')
      });
    }
  }, []);

  const loadRecommendations = async (specs) => {
    if (!user) return;
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
    if (user) {
      loadRecommendations(userSpec);
    }
  }, [userSpec, user]);

  const handleHardwareUpdate = (newSpec) => {
    setUserSpec(newSpec);
    setActiveTab('recommend');
  };

  const handleLogout = () => {
    api.setToken(null);
    setUser(null);
  };

  // If not authenticated, render AuthScreen
  if (!user) {
    return <AuthScreen onAuthSuccess={(authenticatedUser) => setUser(authenticatedUser)} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-cyber-darker text-gray-100">

      {/* ─── Sidebar ─── */}
      <aside className="hidden md:flex w-64 bg-cyber-card border-r border-gray-800 flex-col h-full shrink-0">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <Gamepad2 className="w-7 h-7 text-cyber-accent mr-3" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyber-accent to-cyber-purple">
            SYNCRIG
          </span>
        </div>

        {/* Nav */}
        <div className="p-4 flex-1">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">Menu</div>
          <nav className="space-y-1">
            {NAV.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-cyber-dark text-cyber-accent' : 'text-gray-400 hover:bg-cyber-dark hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-gray-800 space-y-3">
          <div className="flex items-center px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-cyber-dark flex items-center justify-center border border-gray-700 text-sm font-bold text-cyber-accent uppercase">
              {user.provider_id ? user.provider_id.substring(0, 1) : 'U'}
            </div>
            <div className="ml-3 truncate max-w-[130px]">
              <p className="text-sm font-medium text-gray-200 truncate">{user.provider_id || 'User'}</p>
              <p className="text-[10px] text-gray-500 capitalize">{user.provider} account</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-gray-400 hover:text-white bg-gray-800/40 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 rounded-lg transition-colors"
          >
            <LogOut size={13} /> 로그아웃
          </button>
        </div>
      </aside>

      {/* ─── Main Area ─── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-cyber-card/50 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-6 shrink-0">
          {/* Mobile menu */}
          <div className="md:hidden flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-cyber-accent" />
            <span className="font-bold text-lg">SYNCRIG</span>
          </div>
          {/* Search */}
          <div className="hidden md:flex items-center bg-cyber-darker rounded-full px-4 py-2 border border-gray-800 w-96">
            <Search className="w-4 h-4 text-gray-500 mr-2" />
            <input type="text" placeholder="Search games, profiles..." className="bg-transparent border-none outline-none text-sm w-full text-gray-200 placeholder-gray-500" />
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-cyber-dark transition-colors relative text-gray-400 hover:text-gray-200">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyber-danger rounded-full ring-2 ring-cyber-card"></span>
            </button>
            <button
              onClick={handleLogout}
              className="md:hidden p-2 rounded-full hover:bg-cyber-dark text-gray-400 hover:text-white transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto">

            {/* ─── Dashboard ─── */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animation-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-100 mb-2">Welcome back, {user.provider_id}</h1>
                    <p className="text-gray-400">Here's your gaming and hardware summary for today.</p>
                  </div>
                  {/* Account linking status indicator */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">계정 연동 상태:</span>
                    <span className="text-xs font-semibold bg-cyber-success/10 border border-cyber-success/20 text-cyber-success px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <Check className="w-3 h-3" /> Steam/Riot 활성됨
                    </span>
                  </div>
                </div>
                <DashboardCharts userSpec={userSpec} />
              </div>
            )}

            {/* ─── Hardware ─── */}
            {activeTab === 'hardware' && (
              <div className="animation-fade-in">
                <HardwareProfileForm onSave={handleHardwareUpdate} />
              </div>
            )}

            {/* ─── Optimization Hub ─── */}
            {activeTab === 'recommend' && (
              <div className="space-y-6 animation-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-100 mb-1">Optimization Hub</h1>
                    <p className="text-gray-400">Discover the best graphics settings for your hardware.</p>
                  </div>
                </div>

                {/* Active Profile Context */}
                <div className="flex items-center justify-between text-sm text-gray-400 bg-cyber-darker/50 p-3 rounded-lg border border-gray-800/50">
                  <div className="flex items-center">
                    <Cpu className="w-4 h-4 mr-2 text-cyber-success" />
                    Matching against: <strong className="text-gray-200 ml-1">{userSpec.gpu_model}</strong>
                  </div>
                </div>

                {isLoading ? (
                  <MatchingLoader />
                ) : (
                  <RecommendationList recommendations={recommendations} userSpec={userSpec} />
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ─── Mobile Bottom Nav ─── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-cyber-card/95 backdrop-blur border-t border-gray-800 z-50">
        <div className="grid grid-cols-3 h-16">
          {NAV.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center gap-1 ${
                  activeTab === item.id ? 'text-cyber-accent' : 'text-gray-500'
                }`}
              >
                <Icon size={18} />
                <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
