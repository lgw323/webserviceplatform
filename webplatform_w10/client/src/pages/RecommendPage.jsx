import React, { useState, useEffect } from 'react';
import { Cpu, Loader2 } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import RecommendationList from '../components/RecommendationList';
import * as api from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
import useSEO from '../hooks/useSEO';

function MatchingLoader() {
  const [step, setStep] = useState(0);
  const steps = ['하드웨어 사양 분석', '매칭 엔진 유사도 연산', '최적 프리셋 산출'];
  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 600);
    const t2 = setTimeout(() => setStep(2), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="bg-cyber-card rounded-xl border border-gray-800 p-10 max-w-md mx-auto animation-fade-in" role="status" aria-live="polite" aria-label="매칭 엔진 처리 중">
      <div className="flex justify-center mb-8">
        <Loader2 size={36} className="text-cyber-accent animate-spin" aria-hidden="true" />
      </div>
      <div className="space-y-3">
        {steps.map((s, i) => (
          <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-300 ${
            i <= step ? 'bg-cyber-darker border border-gray-700 text-gray-200' : 'text-gray-600'
          }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              i < step ? 'bg-cyber-success text-white' : i === step ? 'bg-cyber-accent text-white' : 'bg-gray-800 text-gray-600'
            }`} aria-hidden="true">{i + 1}</span>
            <span className="flex-1">{s}</span>
            {i < step && <span className="text-cyber-success text-xs font-medium" aria-label={`${s} 완료`}>완료</span>}
            {i === step && <div className="w-2 h-2 rounded-full bg-cyber-accent animate-pulse" aria-hidden="true" />}
          </div>
        ))}
      </div>
      <div className="sr-only" aria-live="assertive">{steps[step]} 진행 중</div>
    </div>
  );
}

export default function RecommendPage() {
  useSEO('recommend');
  const { user, userSpec } = useAuthStore();
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!user || !userSpec) return;
      setIsLoading(true);
      try {
        const data = await api.fetchRecommendations(userSpec);
        setRecommendations(data.recommendations || []);
      } catch (err) {
        console.error('추천 데이터 로드 실패', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadRecommendations();
  }, [userSpec, user]);

  return (
    <section className="space-y-6 animation-fade-in" aria-labelledby="heading-recommend">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 id="heading-recommend" className="text-2xl font-bold text-gray-100 mb-1">최적화 허브</h1>
          <p className="text-a11y-muted">보유하신 하드웨어에 가장 적합한 그래픽 설정을 찾아보세요.</p>
        </div>
      </div>

      {userSpec ? (
        <>
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
            onClick={() => navigate('/hardware')}
            className="px-6 py-2.5 bg-cyber-accent hover:bg-blue-600 text-white rounded-lg transition-colors font-semibold text-sm shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          >
            프로필 등록하러 가기
          </button>
        </div>
      )}
    </section>
  );
}
