import React, { useState } from 'react';
import { Gamepad2, User, Key, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import * as api from '../api/apiClient';
import useAuthStore from '../store/useAuthStore';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inlineError, setInlineError] = useState('');
  const [inlineSuccess, setInlineSuccess] = useState('');
  const { setUser, fetchUserData } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInlineError('');
    setInlineSuccess('');

    if (isVerifying) {
      if (!verificationCode) {
         setInlineError('인증 코드를 입력해주세요.');
         return;
      }
      setIsLoading(true);
      try {
        await api.verifyEmailCode(email, verificationCode);
        setInlineSuccess('이메일 인증 완료! 로그인 중입니다...');
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // After verification, login
        const data = await api.login(email, password);
        setUser(data.user);
        await fetchUserData();
      } catch (err) {
        setInlineError(err.message || '인증 처리에 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!email || !password || (!isLogin && !nickname)) {
      setInlineError('모든 항목을 입력해주세요.');
      return;
    }
    setIsLoading(true);

    try {
      if (isLogin) {
        const data = await api.login(email, password);
        setInlineSuccess('로그인 성공! 잠시 후 이동합니다...');
        await new Promise(resolve => setTimeout(resolve, 600));
        setUser(data.user);
        await fetchUserData();
      } else {
        await api.register(email, nickname, password);
        const res = await api.sendVerificationCode(email);
        setInlineSuccess(res?.message || '회원가입 성공! 이메일 인증 코드를 전송했습니다.');
        setIsVerifying(true);
      }
    } catch (err) {
      const message = err.message || '인증 처리에 실패했습니다.';
      setInlineError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = (provider) => {
    setIsLoading(true);
    // 백엔드의 소셜 로그인 엔드포인트로 리다이렉트합니다.
    const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
      ? 'http://localhost:5000/api/v1' 
      : '/api/v1';
    
    window.location.href = `${API_BASE_URL}/auth/${provider}`;
  };

  const handleTabSwitch = (loginMode) => {
    if (isVerifying) return; // Prevent switching while verifying
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
          {isVerifying ? (
            <div className="space-y-1">
              <label htmlFor="auth-code" className="text-xs font-semibold text-a11y-muted uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" aria-hidden="true" /> 인증 코드
              </label>
              <input
                id="auth-code"
                type="text"
                placeholder="6자리 인증 코드"
                value={verificationCode}
                onChange={(e) => { setVerificationCode(e.target.value); setInlineError(''); }}
                aria-required="true"
                className="w-full bg-cyber-darker border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyber-accent transition-colors tracking-widest text-center"
                maxLength={6}
              />
              <p className="text-xs text-cyber-accent mt-2 text-center">이메일({email})로 전송된 코드를 입력해주세요.</p>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <label htmlFor="auth-email" className="text-xs font-semibold text-a11y-muted uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" aria-hidden="true" /> 이메일 주소
                </label>
                <input
                  id="auth-email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setInlineError(''); }}
                  autoComplete="email"
                  aria-required="true"
                  className="w-full bg-cyber-darker border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyber-accent transition-colors"
                />
              </div>

              {!isLogin && (
                <div className="space-y-1">
                  <label htmlFor="auth-nickname" className="text-xs font-semibold text-a11y-muted uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" aria-hidden="true" /> 닉네임
                  </label>
                  <input
                    id="auth-nickname"
                    type="text"
                    placeholder="2자~20자"
                    value={nickname}
                    onChange={(e) => { setNickname(e.target.value); setInlineError(''); }}
                    autoComplete="nickname"
                    aria-required="true"
                    className="w-full bg-cyber-darker border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyber-accent transition-colors"
                  />
                </div>
              )}

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
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
            className="w-full flex items-center justify-center py-3 bg-cyber-accent hover:bg-blue-600 text-white rounded-lg transition-colors font-medium shadow-[0_0_15px_rgba(59,130,246,0.2)] disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" aria-label="처리 중" /> : isVerifying ? '인증 확인' : isLogin ? '로그인' : '회원가입 완료'}
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
