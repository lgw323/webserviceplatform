import React, { useState, useEffect } from 'react';
import { Moon, Sun, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsView() {
  const [isLightMode, setIsLightMode] = useState(false);
  const [language, setLanguage] = useState('ko');

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
    if (lang === 'en') {
      toast('영어 지원은 현재 준비 중입니다.\n추후 업데이트를 통해 제공될 예정입니다.', {
        icon: '🌐',
        duration: 3000,
      });
      return;
    }
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <div className="space-y-6 animation-fade-in max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-100 mb-2">환경 설정</h2>
        <p className="text-a11y-muted">앱 테마와 언어를 설정하고 관리하세요.</p>
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
        <div className="p-6 flex items-center justify-between hover:bg-cyber-dark transition-colors">
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
      </div>
    </div>
  );
}

  );
}
