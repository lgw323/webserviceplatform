import React, { useState } from 'react';
import { ThumbsUp, ShieldAlert, CheckCircle2, ChevronRight, Check, Copy } from 'lucide-react';

export default function RecommendationList({ recommendations, userSpec }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopySettings = (item) => {
    const settingsString = Object.entries(item.settings)
      .map(([key, val]) => `${key}: ${val}`)
      .join('\n');
    
    navigator.clipboard.writeText(settingsString).then(() => {
      setCopiedId(item.id);
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    }).catch(err => {
      console.error('클립보드 복사 실패:', err);
    });
  };

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="text-center py-16 glass-panel rounded-brand-lg border border-white/5 shadow-brand-soft">
        <p className="text-sm text-gray-400">내 하드웨어와 매칭되는 그래픽 프로파일이 아직 없습니다.</p>
        <p className="text-xs text-gray-500 mt-2">다른 해상도나 사양의 프로파일을 탐색해 보세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center px-1 border-b border-white/5 pb-3">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
          유사도 기반 매칭 결과 <span className="text-[#00ff66]">({recommendations.length}개 발견)</span>
        </h3>
        <span className="text-xs text-gray-400">
          내 기준: <span className="font-mono font-bold text-[#00ff66] bg-[#00ff66]/10 px-2 py-0.5 rounded border border-[#00ff66]/20">{userSpec.gpu_model} / {userSpec.resolution}</span>
        </span>
      </div>

      <div className="grid gap-5 md:grid-cols-1">
        {recommendations.map((item) => {
          const matchPercent = Math.round(item.similarity_score * 100);
          const isHighMatch = matchPercent >= 90;

          // SVG Circle telemetry parameters
          const radius = 18;
          const stroke = 3.5;
          const normalizedRadius = radius - stroke * 2;
          const circumference = normalizedRadius * 2 * Math.PI;
          const strokeDashoffset = circumference - (matchPercent / 100) * circumference;

          return (
            <div 
              key={item.id}
              className="glass-card rounded-brand-md p-6 border border-white/5 hover:border-[#00ff66]/20 transition-all duration-300 shadow-brand-soft flex flex-col md:flex-row md:items-center md:justify-between gap-5 relative overflow-hidden"
            >
              <div className="flex items-start gap-4">
                {/* SVG circular gauge */}
                <div className="relative flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-12 h-12 transform -rotate-90">
                    <circle
                      className="text-gray-800"
                      strokeWidth={stroke}
                      stroke="currentColor"
                      fill="transparent"
                      r={normalizedRadius}
                      cx="24"
                      cy="24"
                    />
                    <svg className="w-12 h-12">
                      <circle
                        className={`${isHighMatch ? 'text-[#00ff66]' : 'text-amber-500'}`}
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={normalizedRadius}
                        cx="24"
                        cy="24"
                      />
                    </svg>
                  </svg>
                  <span className="absolute text-[10px] font-extrabold font-mono text-white">
                    {matchPercent}%
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isHighMatch 
                        ? 'bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/20 shadow-[0_0_10px_rgba(0,255,102,0.15)]' 
                        : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}>
                      {isHighMatch ? 'Optimal Match' : 'Normal Match'}
                    </span>
                    <span className="text-xs font-bold text-gray-300">
                      테스트 사양: {item.hardware.gpu || item.hardware.gpu_model} / {item.hardware.cpu || item.hardware.cpu_model}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-400 flex flex-wrap gap-x-5 gap-y-1.5">
                    <span>해상도: <strong className="text-white font-mono">{item.hardware.resolution}</strong></span>
                    <span>평균 FPS: <strong className="text-[#00ff66] font-mono bg-[#00ff66]/5 px-1.5 py-0.5 rounded border border-[#00ff66]/10">{item.avg_fps} FPS</strong></span>
                    <span>게임 버전: <span className="font-mono text-gray-500">{item.game_version}</span></span>
                  </div>

                  <div className="pt-1 flex flex-wrap gap-2">
                    {Object.entries(item.settings).map(([key, val]) => (
                      <span key={key} className="inline-flex items-center text-xs bg-black/40 text-gray-300 px-2.5 py-1.5 rounded-brand-sm font-mono border border-white/5">
                        <span className="text-gray-500 mr-1.5">{key}:</span>
                        <span className="text-[#00ff66] font-bold">{val}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center self-end md:self-center gap-3 pt-3 md:pt-0 border-t border-white/5 md:border-t-0 w-full md:w-auto justify-end">
                <button className="flex items-center justify-center py-2 px-3 rounded-brand-sm bg-white/5 hover:bg-white/10 text-gray-400 hover:text-[#00ff66] transition-colors border border-white/5">
                  <ThumbsUp size={14} className="mr-1.5" />
                  <span className="text-xs font-mono font-bold">{item.likes || 0}</span>
                </button>
                <button 
                  onClick={() => handleCopySettings(item)}
                  className={`px-4 py-2.5 text-xs font-extrabold rounded-brand-sm flex items-center gap-2 transition-all duration-300 border ${
                    copiedId === item.id 
                      ? 'bg-[#00ff66]/15 text-[#00ff66] border-[#00ff66]/30 shadow-brand-glow-subtle' 
                      : 'bg-white text-black hover:bg-gray-200 border-transparent shadow-brand-soft'
                  }`}
                >
                  {copiedId === item.id ? (
                    <>
                      <Check size={14} /> 복사 완료!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> 설정 복사하기
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
