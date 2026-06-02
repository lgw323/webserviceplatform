import React, { useState } from 'react';
import { Gamepad2, User, Key, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import * as api from '../api/apiClient';
import useAuthStore from '../store/useAuthStore';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inlineError, setInlineError] = useState('');
  const [inlineSuccess, setInlineSuccess] = useState('');
  const { setUser, fetchUserData } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInlineError('');
    setInlineSuccess('');

    if (!username || !password) {
      setInlineError('모든 항목을 입력해주세요.');
      return;
    }
    setIsLoading(true);

    try {
      let data;
      if (isLogin) {
        data = await api.login(username, password);
        setInlineSuccess('로그인 성공! 잠시 후 이동합니다...');
      } else {
        data = await api.register(username, password);
        setInlineSuccess('회원가입 성공! 로그인 중입니다...');
      }
      // Brief delay so user sees the success message
      await new Promise(resolve => setTimeout(resolve, 600));
      setUser(data.user);
      await fetchUserData();
    } catch (err) {
      const message = err.message || '인증 처리에 실패했습니다.';
      setInlineError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    setIsLoading(true);
    setInlineError('');
    setInlineSuccess('');
    try {
      const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
      const data = await api.oauthCallback(provider, mockCode);
      setInlineSuccess(`${provider} 연동 성공!`);
      await new Promise(resolve => setTimeout(resolve, 600));
      setUser(data.user);
      await fetchUserData();
    } catch (err) {
      setInlineError(`${provider} 인증 연동에 실패했습니다.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabSwitch = (loginMode) => {
    setIsLogin(loginMode);
    setInlineError('');
    setInlineSuccess('');
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

        {/* Tabs */}
        <div className="flex bg-cyber-darker p-1 rounded-lg border border-gray-800" role="tablist">
          <button
            type="button"
            role="tab"
            id="tab-login"
            aria-selected={isLogin}
            aria-controls="panel-auth"
            onClick={() => handleTabSwitch(true)}
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
            onClick={() => handleTabSwitch(false)}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              !isLogin ? 'bg-cyber-card text-cyber-accent shadow' : 'text-a11y-muted hover:text-gray-200'
            }`}
          >
            회원가입
          </button>
        </div>

        {/* Inline Feedback Messages */}
        {inlineError && (
          <div className="flex items-center gap-2.5 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg animation-fade-in" role="alert">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" aria-hidden="true" />
            <p className="text-sm text-red-300 font-medium">{inlineError}</p>
          </div>
        )}
        {inlineSuccess && (
          <div className="flex items-center gap-2.5 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg animation-fade-in" role="status">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" aria-hidden="true" />
            <p className="text-sm text-emerald-300 font-medium">{inlineSuccess}</p>
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
              onChange={(e) => { setUsername(e.target.value); setInlineError(''); }}
              autoComplete="username"
              aria-required="true"
              className="w-full bg-cyber-darker border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyber-accent transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="auth-password" className="text-xs font-semibold text-a11y-muted uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" aria-hidden="true" /> 비밀번호
              {!isLogin && <span className="normal-case tracking-normal text-a11y-muted font-normal">(6자 이상, 숫자 포함)</span>}
            </label>
            <input
              id="auth-password"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setInlineError(''); }}
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
