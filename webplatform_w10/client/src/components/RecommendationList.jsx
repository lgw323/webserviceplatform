import React, { useState } from 'react';
import { ThumbsUp, Star, Copy, Check, X, CheckCircle2, ShieldAlert, ThumbsDown } from 'lucide-react';

export default function RecommendationList({ recommendations, userSpec }) {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopySettings = (settings) => {
    const text = Object.entries(settings).map(([k, v]) => `${k}: ${v}`).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(console.error);
  };

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="col-span-full py-12 text-center text-gray-500 bg-cyber-darker/30 rounded-xl border border-gray-800 border-dashed">
        하드웨어와 일치하는 프로필이 없습니다. 사양을 조정해보세요.
      </div>
    );
  }

  return (
    <>
      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {recommendations.map(item => {
          const matchScore = Math.round(item.similarity_score * 100);
          const isHigh = matchScore >= 90;

          return (
            <div key={item.id} className="bg-cyber-card rounded-xl border border-gray-800 hover:border-cyber-accent/50 transition-all flex flex-col overflow-hidden group shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]">
              {/* Card Header */}
              <div className="p-5 border-b border-gray-800/50 flex justify-between items-start bg-gradient-to-b from-cyber-darker/50 to-transparent">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-100">Cyberpunk 2077</h3>
                    {isHigh && <Star className="w-4 h-4 text-cyber-warning fill-cyber-warning" />}
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5">
                    {isHigh ? (
                      <span className="flex items-center gap-1 text-cyber-success text-xs font-medium bg-cyber-success/10 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" /> 최상 일치
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-cyber-warning text-xs font-medium bg-cyber-warning/10 px-2 py-0.5 rounded">
                        <ShieldAlert className="w-3 h-3" /> 보통 일치
                      </span>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyber-success to-green-300">
                    {item.avg_fps}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">평균 FPS</div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 space-y-4">
                {/* Similarity Bar */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">하드웨어 유사도</div>
                  <div className="flex items-center">
                    <div className="w-24 h-1.5 bg-gray-800 rounded-full mr-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${isHigh ? 'bg-cyber-success shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-cyber-accent shadow-[0_0_8px_rgba(59,130,246,0.6)]'}`}
                        style={{ width: `${matchScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-200">{matchScore}%</span>
                  </div>
                </div>

                {/* Spec Grid */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-cyber-darker p-2 rounded border border-gray-800">
                    <span className="text-gray-500 block text-xs mb-0.5">테스트 환경 GPU</span>
                    <span className="text-gray-200 font-medium text-xs">{item.hardware.gpu || item.hardware.gpu_model}</span>
                  </div>
                  <div className="bg-cyber-darker p-2 rounded border border-gray-800">
                    <span className="text-gray-500 block text-xs mb-0.5">해상도</span>
                    <span className="text-gray-200 font-medium">{item.hardware.resolution}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 bg-cyber-darker border-t border-gray-800 flex justify-between items-center group-hover:bg-gray-900 transition-colors">
                <div className="flex items-center text-sm text-gray-400">
                  <ThumbsUp className="w-4 h-4 mr-1.5" /> {item.likes || 0}
                </div>
                <button
                  onClick={() => setSelectedProfile(item)}
                  className="flex items-center text-sm font-medium text-cyber-accent hover:text-blue-400 transition-colors px-3 py-1.5 rounded-md hover:bg-cyber-accent/10"
                >
                  상세 보기
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Detail Modal ─── */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animation-fade-in">
          <div className="bg-cyber-card border border-gray-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            {/* Modal Header */}
            <div className="sticky top-0 bg-cyber-card/95 backdrop-blur z-10 border-b border-gray-800 p-5 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-100">Cyberpunk 2077</h2>
                <p className="text-sm text-gray-400">
                  유사도 <span className="text-cyber-accent font-bold">{Math.round(selectedProfile.similarity_score * 100)}%</span> 매칭 프로필
                </p>
              </div>
              <button onClick={() => setSelectedProfile(null)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Performance Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-cyber-darker p-4 rounded-lg border border-gray-800 text-center">
                  <div className="text-xs text-gray-500 uppercase font-bold mb-1">평균 FPS</div>
                  <div className="text-xl font-black text-cyber-success">{selectedProfile.avg_fps}</div>
                </div>
                <div className="bg-cyber-darker p-4 rounded-lg border border-gray-800 text-center">
                  <div className="text-xs text-gray-500 uppercase font-bold mb-1">유사도</div>
                  <div className="text-xl font-black text-cyber-accent">{Math.round(selectedProfile.similarity_score * 100)}%</div>
                </div>
                <div className="bg-cyber-darker p-4 rounded-lg border border-gray-800 text-center">
                  <div className="text-xs text-gray-500 uppercase font-bold mb-1">해상도</div>
                  <div className="text-xl font-black text-gray-200">{selectedProfile.hardware.resolution}</div>
                </div>
              </div>

              {/* Settings Table */}
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-3">그래픽 설정 값</h3>
                <div className="bg-cyber-darker border border-gray-800 rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase border-b border-gray-800">
                      <tr>
                        <th className="px-4 py-3 font-medium">설정 항목</th>
                        <th className="px-4 py-3 font-medium">값</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {Object.entries(selectedProfile.settings).map(([key, value]) => (
                        <tr key={key} className="hover:bg-gray-800/30 transition-colors">
                          <td className="px-4 py-3 text-gray-300">{key}</td>
                          <td className="px-4 py-3 font-medium text-white">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-800 bg-gray-900/30 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700">
                  <ThumbsUp className="w-4 h-4 mr-2 text-gray-400" /> 도움됨
                </button>
                <button className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700">
                  <ThumbsDown className="w-4 h-4 mr-2 text-gray-400" /> 작동 안함
                </button>
              </div>
              <button
                onClick={() => handleCopySettings(selectedProfile.settings)}
                className={`w-full sm:w-auto flex items-center justify-center px-6 py-2 rounded-lg transition-all font-medium ${isCopied ? 'bg-cyber-success text-white' : 'bg-cyber-accent hover:bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'}`}
              >
                {isCopied ? <><Check className="w-5 h-5 mr-2" /> 복사됨!</> : <><Copy className="w-5 h-5 mr-2" /> 설정 복사</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
