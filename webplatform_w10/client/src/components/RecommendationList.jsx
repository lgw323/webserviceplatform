import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ThumbsUp, Star, Copy, Check, X, CheckCircle2, ShieldAlert, ThumbsDown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RecommendationList({ recommendations, userSpec }) {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(null); // 'helpful' | 'not_working' | null

  // 포커스 트랩 및 복원을 위한 ref
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);
  const closeButtonRef = useRef(null);

  const handleCopySettings = (settings) => {
    const text = Object.entries(settings).map(([k, v]) => `${k}: ${v}`).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(console.error);
  };

  // 모달 열릴 때: 이전 포커스 저장 → 닫기 버튼으로 포커스 이동
  const openModal = useCallback((item) => {
    previousFocusRef.current = document.activeElement;
    setSelectedProfile(item);
  }, []);

  // 모달 닫기: 포커스 복원 + 피드백 초기화
  const closeModal = useCallback(() => {
    setSelectedProfile(null);
    setFeedbackGiven(null);
    // 다음 렌더 사이클 후 이전 포커스 복원
    setTimeout(() => {
      previousFocusRef.current?.focus();
    }, 0);
  }, []);

  // 모달 열렸을 때 닫기 버튼으로 포커스 이동
  useEffect(() => {
    if (selectedProfile && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [selectedProfile]);

  // ESC 키 및 포커스 트랩 처리
  useEffect(() => {
    if (!selectedProfile) return;

    const handleKeyDown = (e) => {
      // ESC로 모달 닫기
      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
        return;
      }

      // Tab 키 포커스 트랩
      if (e.key === 'Tab' && modalRef.current) {
        const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const focusableElements = Array.from(modalRef.current.querySelectorAll(focusableSelectors));
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift+Tab: 첫 요소에서 마지막 요소로 순환
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: 마지막 요소에서 첫 요소로 순환
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedProfile, closeModal]);

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="col-span-full py-12 text-center text-a11y-muted bg-cyber-darker/30 rounded-xl border border-gray-800 border-dashed" role="status">
        하드웨어와 일치하는 프로필이 없습니다. 사양을 조정해보세요.
      </div>
    );
  }

  return (
    <>
      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" role="list" aria-label="추천 최적화 프로필 목록">
        {recommendations.map(item => {
          const matchScore = Math.round(item.similarity_score * 100);
          const isHigh = matchScore >= 90;

          return (
            <article key={item.id} role="listitem" className="bg-cyber-card rounded-xl border border-gray-800 hover:border-cyber-accent/50 transition-all flex flex-col overflow-hidden group shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]">
              {/* Card Header */}
              <div className="p-5 border-b border-gray-800/50 flex justify-between items-start bg-gradient-to-b from-cyber-darker/50 to-transparent">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-100">Cyberpunk 2077</h3>
                    {isHigh && <Star className="w-4 h-4 text-cyber-warning fill-cyber-warning" aria-label="최고 추천" />}
                  </div>
                  <p className="text-sm text-a11y-muted flex items-center gap-1.5">
                    {isHigh ? (
                      <span className="flex items-center gap-1 text-cyber-success text-xs font-medium bg-cyber-success/10 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" aria-hidden="true" /> 최상 일치
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-cyber-warning text-xs font-medium bg-cyber-warning/10 px-2 py-0.5 rounded">
                        <ShieldAlert className="w-3 h-3" aria-hidden="true" /> 보통 일치
                      </span>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyber-success to-green-300" aria-label={`평균 FPS: ${item.avg_fps}`}>
                    {item.avg_fps}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-a11y-muted font-bold" aria-hidden="true">평균 FPS</div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 space-y-4">
                {/* Similarity Bar */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-a11y-muted" id={`sim-label-${item.id}`}>하드웨어 유사도</div>
                  <div className="flex items-center">
                    <div
                      className="w-24 h-1.5 bg-gray-800 rounded-full mr-3 overflow-hidden"
                      role="progressbar"
                      aria-valuenow={matchScore}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-labelledby={`sim-label-${item.id}`}
                    >
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
                    <span className="text-a11y-muted block text-xs mb-0.5">테스트 환경 GPU</span>
                    <span className="text-gray-200 font-medium text-xs">{item.hardware.gpu || item.hardware.gpu_model}</span>
                  </div>
                  <div className="bg-cyber-darker p-2 rounded border border-gray-800">
                    <span className="text-a11y-muted block text-xs mb-0.5">해상도</span>
                    <span className="text-gray-200 font-medium">{item.hardware.resolution}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 bg-cyber-darker border-t border-gray-800 flex justify-between items-center group-hover:bg-gray-900 transition-colors">
                <div className="flex items-center text-sm text-a11y-muted" aria-label={`추천 수: ${item.likes || 0}`}>
                  <ThumbsUp className="w-4 h-4 mr-1.5" aria-hidden="true" /> {item.likes || 0}
                </div>
                <button
                  onClick={() => openModal(item)}
                  className="flex items-center text-sm font-medium text-cyber-accent hover:text-blue-400 transition-colors px-3 py-1.5 rounded-md hover:bg-cyber-accent/10"
                  aria-label={`Cyberpunk 2077 — 유사도 ${matchScore}% 프로필 상세 보기`}
                >
                  상세 보기
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* ─── Detail Modal ─── */}
      {selectedProfile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animation-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          ref={modalRef}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="bg-cyber-card border border-gray-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            {/* Modal Header */}
            <div className="sticky top-0 bg-cyber-card/95 backdrop-blur z-10 border-b border-gray-800 p-5 flex justify-between items-center">
              <div>
                <h2 id="modal-title" className="text-xl font-bold text-gray-100">Cyberpunk 2077</h2>
                <p className="text-sm text-a11y-muted">
                  유사도 <span className="text-cyber-accent font-bold">{Math.round(selectedProfile.similarity_score * 100)}%</span> 매칭 프로필
                </p>
              </div>
              <button
                ref={closeButtonRef}
                onClick={closeModal}
                className="p-2 text-a11y-muted hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="상세 보기 닫기"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Performance Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4" role="group" aria-label="성능 통계">
                <div className="bg-cyber-darker p-4 rounded-lg border border-gray-800 text-center">
                  <div className="text-xs text-a11y-muted uppercase font-bold mb-1">평균 FPS</div>
                  <div className="text-xl font-black text-cyber-success">{selectedProfile.avg_fps}</div>
                </div>
                <div className="bg-cyber-darker p-4 rounded-lg border border-gray-800 text-center">
                  <div className="text-xs text-a11y-muted uppercase font-bold mb-1">유사도</div>
                  <div className="text-xl font-black text-cyber-accent">{Math.round(selectedProfile.similarity_score * 100)}%</div>
                </div>
                <div className="bg-cyber-darker p-4 rounded-lg border border-gray-800 text-center">
                  <div className="text-xs text-a11y-muted uppercase font-bold mb-1">해상도</div>
                  <div className="text-xl font-black text-gray-200">{selectedProfile.hardware.resolution}</div>
                </div>
              </div>

              {/* Settings Table */}
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-3">그래픽 설정 값</h3>
                <div className="bg-cyber-darker border border-gray-800 rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left" aria-label="그래픽 설정 값 테이블">
                    <thead className="bg-gray-900/50 text-a11y-muted text-xs uppercase border-b border-gray-800">
                      <tr>
                        <th scope="col" className="px-4 py-3 font-medium">설정 항목</th>
                        <th scope="col" className="px-4 py-3 font-medium">값</th>
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
              <div className="flex gap-2 w-full sm:w-auto" role="group" aria-label="프로필 피드백">
                <button
                  onClick={() => {
                    setFeedbackGiven('helpful');
                    toast.success('피드백 감사합니다! 👍');
                  }}
                  disabled={feedbackGiven !== null}
                  aria-label="이 설정이 도움되었습니다"
                  aria-pressed={feedbackGiven === 'helpful'}
                  className={`flex-1 sm:flex-none flex items-center justify-center px-4 py-2 rounded-lg transition-colors border ${
                    feedbackGiven === 'helpful'
                      ? 'bg-cyber-success/20 text-cyber-success border-cyber-success/30'
                      : feedbackGiven !== null
                        ? 'bg-gray-800 text-a11y-muted border-gray-700 opacity-50 cursor-not-allowed'
                        : 'bg-gray-800 hover:bg-gray-700 text-white border-gray-700'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4 mr-2" aria-hidden="true" />
                  {feedbackGiven === 'helpful' ? '감사합니다!' : '도움됨'}
                </button>
                <button
                  onClick={() => {
                    setFeedbackGiven('not_working');
                    toast('피드백이 반영되었습니다.', { icon: '📝' });
                  }}
                  disabled={feedbackGiven !== null}
                  aria-label="이 설정이 작동하지 않았습니다"
                  aria-pressed={feedbackGiven === 'not_working'}
                  className={`flex-1 sm:flex-none flex items-center justify-center px-4 py-2 rounded-lg transition-colors border ${
                    feedbackGiven === 'not_working'
                      ? 'bg-red-500/20 text-red-400 border-red-500/30'
                      : feedbackGiven !== null
                        ? 'bg-gray-800 text-a11y-muted border-gray-700 opacity-50 cursor-not-allowed'
                        : 'bg-gray-800 hover:bg-gray-700 text-white border-gray-700'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4 mr-2" aria-hidden="true" />
                  {feedbackGiven === 'not_working' ? '반영됨' : '작동 안함'}
                </button>
              </div>
              <div aria-live="polite">
                <button
                  onClick={() => handleCopySettings(selectedProfile.settings)}
                  className={`w-full sm:w-auto flex items-center justify-center px-6 py-2 rounded-lg transition-all font-medium ${isCopied ? 'bg-cyber-success text-white' : 'bg-cyber-accent hover:bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'}`}
                  aria-label={isCopied ? '설정이 클립보드에 복사되었습니다' : '그래픽 설정 값 복사'}
                >
                  {isCopied ? <><Check className="w-5 h-5 mr-2" aria-hidden="true" /> 복사됨!</> : <><Copy className="w-5 h-5 mr-2" aria-hidden="true" /> 설정 복사</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
