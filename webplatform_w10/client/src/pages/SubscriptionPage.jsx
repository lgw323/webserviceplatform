import React, { useState } from 'react';
import { CheckCircle2, Crown, Zap } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { Navigate } from 'react-router-dom';
import TossCheckoutWidget from '../components/payment/TossCheckoutWidget';

export default function SubscriptionPage() {
  const [showPayment, setShowPayment] = useState(false);
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/" />;
  }

  if (user.subscription_status === 'premium') {
    return (
      <div className="flex flex-col items-center justify-center h-full pt-20">
        <Crown className="w-20 h-20 text-yellow-500 mb-6" />
        <h2 className="text-3xl font-bold mb-4 text-white">이미 PRO 구독자이십니다!</h2>
        <p className="text-a11y-muted">대시보드에서 프리미엄 전용 통계를 확인해보세요.</p>
      </div>
    );
  }

  if (showPayment) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6">
        <TossCheckoutWidget amount={4900} orderName="SYNCRIG PRO 1개월 구독" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-white">당신의 하드웨어를 한계까지.</h1>
        <p className="text-xl text-a11y-muted">SYNCRIG PRO로 상위 1%의 비밀을 확인하세요.</p>
      </div>

      <div className="bg-cyber-card border border-yellow-500/30 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-yellow-500 flex items-center gap-2 mb-2">
              <Crown className="w-6 h-6" /> PRO 요금제
            </h2>
            <div className="text-4xl font-bold mb-6 text-white">₩ 4,900 <span className="text-lg text-gray-400 font-normal">/ 월</span></div>
            
            <ul className="space-y-4 mb-8 text-gray-200">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyber-success" />
                <span>글로벌 상위 1% 랭커와의 하드웨어 성능 교차 분석</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyber-success" />
                <span>게임별 세밀한 프레임 1% Low 지표 열람</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyber-success" />
                <span>프리미엄 전용 프로필 뱃지 제공</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyber-success" />
                <span>타겟팅 광고 완벽 제거</span>
              </li>
            </ul>

            <button 
              onClick={() => setShowPayment(true)}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-white font-bold rounded-xl text-lg flex items-center justify-center gap-2 transition-all"
            >
              토스페이먼츠로 1분 만에 구독하기 <Zap className="w-5 h-5" />
            </button>
          </div>
          
          <div className="hidden md:block w-[300px] shrink-0">
            <div className="bg-cyber-dark border border-gray-800 rounded-xl p-4 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform">
               <div className="h-4 w-1/2 bg-gray-700 rounded mb-4"></div>
               <div className="h-20 bg-gray-800 rounded mb-2"></div>
               <div className="h-20 bg-yellow-500/20 border border-yellow-500/50 rounded flex items-center justify-center text-yellow-500 font-bold">
                 Unlocked Data
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
