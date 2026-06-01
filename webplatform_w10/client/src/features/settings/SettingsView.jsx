import React, { useState, useEffect } from 'react';
import { Moon, Sun, Globe, User, Save, Check } from 'lucide-react';

export default function SettingsView({ user, onUpdateNickname }) {
  const [isLightMode, setIsLightMode] = useState(false);
  const [language, setLanguage] = useState('ko');
  const [nickname, setNickname] = useState(user?.provider_id || '');
  const [isSaved, setIsSaved] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsLightMode(true);
      document.documentElement.classList.add('light-theme');
    }
    
    const savedLang = localStorage.getItem('language');
    if (savedLang) setLanguage(savedLang);
  }, []);

  const toggleTheme = () => {
    const newMode = !isLightMode;
    setIsLightMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    // In a real app, this would trigger a re-render with the new locale.
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (nickname.trim()) {
      onUpdateNickname(nickname.trim());
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  return (
    <div className="space-y-6 animation-fade-in max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-100 mb-2">환경 설정</h2>
        <p className="text-a11y-muted">앱 테마, 언어, 그리고 계정 프로필을 관리하세요.</p>
      </div>

      <div className="bg-cyber-card rounded-xl border border-gray-800 shadow-lg overflow-hidden">
        {/* 테마 설정 */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between hover:bg-cyber-dark transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyber-darker rounded-lg border border-gray-700 text-cyber-accent" aria-hidden="true">
              {isLightMode ? <Sun size={20} /> : <Moon size={20} />}
            </div>
            <div>
              <h3 className="text-gray-200 font-semibold" id="theme-label">화면 테마</h3>
              <p className="text-sm text-a11y-muted">라이트 모드 또는 다크 모드로 변경합니다.</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            role="switch"
            aria-checked={isLightMode}
            aria-labelledby="theme-label"
            aria-label={isLightMode ? '현재 라이트 모드, 다크 모드로 전환' : '현재 다크 모드, 라이트 모드로 전환'}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isLightMode ? 'bg-cyber-accent' : 'bg-gray-600'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isLightMode ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* 언어 설정 */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between hover:bg-cyber-dark transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyber-darker rounded-lg border border-gray-700 text-cyber-purple" aria-hidden="true">
              <Globe size={20} />
            </div>
            <div>
              <h3 className="text-gray-200 font-semibold" id="language-label">언어 설정 (Language)</h3>
              <p className="text-sm text-a11y-muted">시스템 기본 언어를 설정합니다.</p>
            </div>
          </div>
          <div className="flex bg-cyber-darker p-1 rounded-lg border border-gray-700" role="radiogroup" aria-labelledby="language-label">
            <button
              role="radio"
              aria-checked={language === 'ko'}
              onClick={() => handleLanguageChange('ko')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${language === 'ko' ? 'bg-cyber-card text-cyber-purple shadow' : 'text-a11y-muted hover:text-gray-300'}`}
            >
              한국어
            </button>
            <button
              role="radio"
              aria-checked={language === 'en'}
              onClick={() => handleLanguageChange('en')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${language === 'en' ? 'bg-cyber-card text-cyber-purple shadow' : 'text-a11y-muted hover:text-gray-300'}`}
            >
              English
            </button>
          </div>
        </div>

        {/* 프로필 설정 */}
        <div className="p-6 hover:bg-cyber-dark transition-colors">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-cyber-darker rounded-lg border border-gray-700 text-cyber-warning" aria-hidden="true">
              <User size={20} />
            </div>
            <div>
              <h3 className="text-gray-200 font-semibold" id="profile-label">계정 프로필</h3>
              <p className="text-sm text-a11y-muted">대시보드에 표시될 표시 이름(닉네임)을 변경합니다.</p>
            </div>
          </div>
          
          <form onSubmit={handleSaveProfile} className="pl-[3.25rem]" aria-labelledby="profile-label">
            <div className="flex gap-3">
              <label htmlFor="settings-nickname" className="sr-only">닉네임</label>
              <input
                id="settings-nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="새로운 닉네임 입력"
                aria-required="true"
                className="flex-1 bg-cyber-darker border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyber-warning transition-colors"
              />
              <button
                type="submit"
                aria-label={isSaved ? '닉네임이 저장되었습니다' : '닉네임 저장'}
                className="flex items-center gap-2 px-4 py-2 bg-cyber-warning/20 hover:bg-cyber-warning/30 text-cyber-warning border border-cyber-warning/50 rounded-lg transition-colors font-medium text-sm"
              >
                {isSaved ? <Check size={16} aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}
                {isSaved ? '저장됨' : '저장'}
              </button>
            </div>
            {/* 저장 결과 스크린리더 피드백 */}
            <div aria-live="polite" className="sr-only">
              {isSaved && '닉네임이 성공적으로 저장되었습니다.'}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
