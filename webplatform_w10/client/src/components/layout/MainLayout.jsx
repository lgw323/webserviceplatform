import React, { useRef, useCallback, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Gamepad2, LayoutDashboard, Cpu, Settings2, Settings, Bell, Search, LogOut, Users } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useNotificationStore from '../../store/useNotificationStore';
import { useSearch } from '../../hooks/useSearch';
import NotificationDropdown from '../NotificationDropdown';
import toast from 'react-hot-toast';

const NAV = [
  { path: '/dashboard', label: '대시보드', icon: LayoutDashboard },
  { path: '/hardware', label: '하드웨어 프로필', icon: Cpu },
  { path: '/recommend', label: '최적화 허브', icon: Settings2 },
  { path: '/community', label: '커뮤니티', icon: Users },
  { path: '/settings', label: '환경 설정', icon: Settings },
];

export default function MainLayout() {
  const { user, logout } = useAuthStore();
  const { getUnreadCount } = useNotificationStore();
  const { query, setQuery, results, isOpen, selectedIndex, selectResult, handleKeyDown, containerRef } = useSearch();
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const navRefs = useRef([]);

  const handleLogout = () => {
    logout();
    toast.success('로그아웃 되었습니다.');
    navigate('/');
  };

  const handleNavKeyDown = useCallback((e, index) => {
    let nextIndex = index;
    if (e.key === 'ArrowDown') nextIndex = (index + 1) % NAV.length;
    else if (e.key === 'ArrowUp') nextIndex = (index - 1 + NAV.length) % NAV.length;
    else if (e.key === 'Home') nextIndex = 0;
    else if (e.key === 'End') nextIndex = NAV.length - 1;
    
    if (nextIndex !== index) {
      e.preventDefault();
      navRefs.current[nextIndex]?.focus();
    }
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-cyber-darker text-gray-100">
      <a href="#main-content" className="skip-nav">본문으로 건너뛰기</a>

      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-cyber-card border-r border-gray-800 flex-col h-full shrink-0" aria-label="사이드바 메뉴">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <Gamepad2 className="w-7 h-7 text-cyber-accent mr-3" aria-hidden="true" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyber-accent to-cyber-purple">SYNCRIG</span>
        </div>

        <div className="p-4 flex-1">
          <div className="text-xs font-semibold text-a11y-muted uppercase tracking-wider mb-4 px-2" id="sidebar-nav-label">메뉴</div>
          <nav aria-labelledby="sidebar-nav-label" role="navigation">
            <ul className="space-y-1" role="list">
              {NAV.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={item.path} role="listitem">
                    <NavLink
                      to={item.path}
                      ref={(el) => (navRefs.current[index] = el)}
                      onKeyDown={(e) => handleNavKeyDown(e, index)}
                      className={({ isActive }) => `w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive ? 'bg-cyber-dark text-cyber-accent' : 'text-a11y-muted hover:bg-cyber-dark hover:text-gray-200'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3 flex-shrink-0" aria-hidden="true" />
                      {item.label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-800 space-y-3">
          {user?.subscription_status !== 'premium' && (
            <button 
              onClick={() => navigate('/subscription')}
              className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500/10 to-yellow-600/10 hover:from-amber-500/20 hover:to-yellow-600/20 text-yellow-500 hover:text-yellow-400 py-2 rounded-lg text-xs font-bold transition-all border border-yellow-500/20 mb-2"
            >
              👑 PRO 업그레이드
            </button>
          )}
          <div className="flex items-center px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-cyber-dark flex items-center justify-center border border-gray-700 text-sm font-bold text-cyber-accent uppercase" aria-hidden="true">
              {user?.provider_id ? user.provider_id.substring(0, 1) : 'U'}
            </div>
            <div className="ml-3 truncate max-w-[130px]">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium text-gray-200 truncate">{user?.provider_id || 'User'}</p>
                {user?.subscription_status === 'premium' && (
                  <span className="bg-gradient-to-r from-amber-400 to-yellow-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center">
                    👑 PRO
                  </span>
                )}
              </div>
              <p className="text-[10px] text-a11y-muted capitalize mt-0.5">
                {user?.provider} 계정 {user?.linked_providers?.length > 0 && `(+ 연동)`}
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-a11y-muted hover:text-white bg-gray-800/40 hover:bg-gray-800 border border-gray-800 rounded-lg transition-colors">
            <LogOut size={13} aria-hidden="true" /> 로그아웃
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-cyber-card/50 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-6 shrink-0" role="banner">
          <div className="md:hidden flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-cyber-accent" aria-hidden="true" />
            <span className="font-bold text-lg">SYNCRIG</span>
          </div>
          <div className="hidden md:flex items-center bg-cyber-darker rounded-full px-4 py-2 border border-gray-800 w-96 relative" ref={containerRef}>
            <Search className="w-4 h-4 text-a11y-muted mr-2" aria-hidden="true" />
            <input
              type="search"
              placeholder="게임, 프로필 검색..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              role="combobox"
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              aria-label="사이트 내 검색"
              aria-autocomplete="list"
              className="bg-transparent border-none outline-none text-sm w-full text-gray-200"
            />
            {isOpen && results.length > 0 && (
              <ul role="listbox" className="absolute top-full left-0 w-full mt-2 bg-cyber-card border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden" aria-label="검색 결과">
                {results.map((item, index) => (
                  <li key={item.path} role="option" aria-selected={selectedIndex === index}>
                    <button
                      onClick={() => selectResult(item)}
                      className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${
                        selectedIndex === index ? 'bg-cyber-dark text-cyber-accent' : 'text-gray-200 hover:bg-cyber-dark'
                      }`}
                    >
                      <span className="text-base" aria-hidden="true">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex items-center space-x-4">

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full hover:bg-cyber-dark transition-colors relative text-a11y-muted hover:text-gray-200"
                aria-label={`알림 ${getUnreadCount()}개 읽지 않음`}
                aria-haspopup="true"
                aria-expanded={showNotifications}
              >
                <Bell className="w-5 h-5" aria-hidden="true" />
                {getUnreadCount() > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyber-danger rounded-full ring-2 ring-cyber-card" />
                )}
              </button>
              {showNotifications && <NotificationDropdown onClose={() => setShowNotifications(false)} />}
            </div>
            <button onClick={handleLogout} className="md:hidden p-2 rounded-full hover:bg-cyber-dark text-a11y-muted hover:text-white transition-colors">
              <LogOut className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </header>

        <main id="main-content" className="flex-1 overflow-y-auto p-6 scroll-smooth" tabIndex="-1">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-cyber-card/95 backdrop-blur border-t border-gray-800 z-50">
        <div className="grid grid-cols-4 h-16">
          {NAV.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `flex flex-col items-center justify-center gap-1 ${
                  isActive ? 'text-cyber-accent' : 'text-a11y-muted'
                }`}
              >
                <Icon size={18} aria-hidden="true" />
                <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
