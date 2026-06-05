import React, { useState, useEffect } from 'react';
import { Lock, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';

const PremiumStatsWidget = ({ isPremium }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (isPremium) {
      apiClient.get('/stats/top-tier')
        .then(res => setStats(res.data?.data))
        .catch(err => console.error('Failed to fetch premium stats:', err));
    }
  }, [isPremium]);

  return (
    <div className="relative bg-cyber-card border border-gray-800 rounded-xl p-6 mt-6 overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <Crown className="text-yellow-500 w-5 h-5" />
        <h3 className="text-lg font-bold text-gray-100">상위 1% 랭커와의 하드웨어 교차 분석</h3>
      </div>

      {!isPremium ? (
        <div className="relative">
          {/* Blurred mock content */}
          <div className="blur-md opacity-50 select-none pointer-events-none">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-cyber-dark p-4 rounded-lg">
                <p className="text-sm text-a11y-muted">내 CPU 점수</p>
                <p className="text-2xl font-bold">8,500</p>
                <p className="text-xs text-green-400 mt-2">상위 1% 대비 -3500</p>
              </div>
              <div className="bg-cyber-dark p-4 rounded-lg">
                <p className="text-sm text-a11y-muted">내 GPU 점수</p>
                <p className="text-2xl font-bold">11,000</p>
                <p className="text-xs text-red-400 mt-2">상위 1% 평균 이하</p>
              </div>
            </div>
          </div>
          
          {/* Paywall Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <div className="bg-cyber-darker/90 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 text-center shadow-2xl max-w-sm w-full mx-auto">
              <Lock className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
              <h4 className="text-white font-bold text-lg mb-2">PRO 요금제 전용 기능</h4>
              <p className="text-a11y-muted text-sm mb-6">
                PRO로 업그레이드하고 글로벌 상위 1% 유저들의 하드웨어 평균과 내 PC를 정밀 분석해보세요.
              </p>
              <button 
                onClick={() => navigate('/subscription')}
                className="w-full bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400 text-white font-bold py-3 rounded-lg transition-all"
              >
                지금 업그레이드 하기
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-cyber-dark border border-gray-700 p-4 rounded-lg">
            <p className="text-sm text-a11y-muted">CPU 스코어 비교</p>
            <div className="flex justify-between items-end mt-2">
              <div>
                <p className="text-xs text-a11y-muted">나의 점수</p>
                <p className="text-xl font-bold text-blue-400">{stats?.cpu_score?.user.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-yellow-500">상위 1%</p>
                <p className="text-xl font-bold text-gray-200">{stats?.cpu_score?.top_1_percent.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-cyber-dark border border-gray-700 p-4 rounded-lg">
            <p className="text-sm text-a11y-muted">GPU 스코어 비교</p>
            <div className="flex justify-between items-end mt-2">
              <div>
                <p className="text-xs text-a11y-muted">나의 점수</p>
                <p className="text-xl font-bold text-green-400">{stats?.gpu_score?.user.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-yellow-500">상위 1%</p>
                <p className="text-xl font-bold text-gray-200">{stats?.gpu_score?.top_1_percent.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-2 bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg mt-2">
            <p className="text-sm font-semibold text-blue-300 mb-2">💡 PRO 인사이트</p>
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
              {stats?.insights?.map((insight, idx) => (
                <li key={idx}>{insight}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumStatsWidget;
