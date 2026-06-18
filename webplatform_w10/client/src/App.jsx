import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';
import { Loader2 } from 'lucide-react';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import AuthCallback from './pages/AuthCallback';
import DashboardPage from './pages/DashboardPage';
import HardwarePage from './pages/HardwarePage';
import CommunityPage from './pages/CommunityPage';
import PostDetail from './pages/PostDetail';
import PostWritePage from './pages/PostWritePage';
import AdminDashboard from './pages/AdminDashboard';
import RecommendPage from './pages/RecommendPage';
import SettingsPage from './pages/SettingsPage';
import MyPage from './pages/MyPage';
import SubscriptionPage from './pages/SubscriptionPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFail from './pages/PaymentFail';

// Layout
import MainLayout from './components/layout/MainLayout';

export default function App() {
  const { user, initialize, isLoading } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-darker">
        <Loader2 className="w-10 h-10 animate-spin text-cyber-accent" />
      </div>
    );
  }

  // 비로그인 상태 라우팅
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-fail" element={<PaymentFail />} />
        {/* 없는 주소는 모두 랜딩 페이지로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // 로그인 상태 라우팅
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* 루트 접속 시 대시보드로 리다이렉트 */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        {/* 로그인한 유저가 /login 이나 / 에 직접 접근해도 대시보드로 */}
        <Route path="login" element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="hardware" element={<HardwarePage />} />
        <Route path="community" element={<CommunityPage />} />
        <Route path="community/:id" element={<PostDetail />} />
        <Route path="community/write" element={<PostWritePage />} />
        <Route path="community/edit/:id" element={<PostWritePage />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="recommend" element={<RecommendPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="mypage" element={<MyPage />} />
        <Route path="subscription" element={<SubscriptionPage />} />
        <Route path="payment-success" element={<PaymentSuccess />} />
        <Route path="payment-fail" element={<PaymentFail />} />
        {/* 없는 주소는 모두 대시보드로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
