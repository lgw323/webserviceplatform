import React from 'react';
import { ThumbsUp, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';

export default function RecommendationList({ recommendations, userSpec }) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-brand-lg border border-gray-100 shadow-brand-soft">
        <p className="text-sm text-neutral-grayText">내 하드웨어와 매칭되는 그래픽 프로파일이 아직 없습니다.</p>
        <p className="text-xs text-neutral-grayText/60 mt-1">다른 해상도나 사양의 프로파일을 탐색해 보세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-sm font-bold text-brand-charcoal">
          유사도 기반 매칭 결과 <span className="text-brand-green">({recommendations.length}개 발견)</span>
        </h3>
        <span className="text-xs text-neutral-grayText">
          내 기준: <span className="font-mono text-xs">{userSpec.gpu_model} / {userSpec.resolution}</span>
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        {recommendations.map((item) => {
          const matchPercent = Math.round(item.similarity_score * 100);
          const isHighMatch = matchPercent >= 90;

          return (
            <div 
              key={item.id}
              className="bg-white hover:bg-neutral-offwhite border border-gray-100 hover:border-gray-200 rounded-brand-md p-5 transition-all duration-200 shadow-brand-soft flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                    isHighMatch ? 'bg-brand-green/10 text-brand-green' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    유사도 {matchPercent}% {isHighMatch ? '매우 일치' : '보통 일치'}
                  </span>
                  <span className="text-xs font-semibold text-brand-charcoal">
                    테스트 사양: {item.hardware.gpu} / {item.hardware.cpu}
                  </span>
                </div>
                
                <div className="text-sm text-neutral-grayText flex flex-wrap gap-x-4 gap-y-1">
                  <span>해상도: <strong className="text-brand-charcoal">{item.hardware.resolution}</strong></span>
                  <span>평균 FPS: <strong className="text-brand-green font-mono">{item.avg_fps} FPS</strong></span>
                  <span>게임 버전: <span className="text-xs font-mono">{item.game_version}</span></span>
                </div>

                <div className="pt-2 flex flex-wrap gap-2">
                  {Object.entries(item.settings).map(([key, val]) => (
                    <span key={key} className="inline-flex items-center text-xs bg-gray-100 text-brand-charcoal px-2 py-1 rounded-brand-sm font-mono">
                      {key}: {val}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center md:self-center gap-3">
                <button className="flex items-center justify-center p-2 rounded-brand-sm hover:bg-gray-100 text-neutral-grayText hover:text-brand-green transition-colors">
                  <ThumbsUp size={16} />
                  <span className="text-xs font-mono ml-1">{item.likes || 0}</span>
                </button>
                <button className="px-4 py-2.5 bg-brand-charcoal hover:bg-brand-dark text-white text-xs font-bold rounded-brand-sm flex items-center gap-1 transition-colors">
                  설정 복사하기 <ChevronRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
