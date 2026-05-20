import React, { useState } from 'react';
import { ThumbsUp, CheckCircle2, ShieldAlert, Check, Copy } from 'lucide-react';

/* ─── SVG Donut Gauge ─── */
function DonutGauge({ percent, isHigh }) {
  const r = 20;
  const stroke = 3;
  const nr = r - stroke;
  const c = nr * 2 * Math.PI;
  const offset = c - (percent / 100) * c;
  const color = isHigh ? '#2dd4bf' : '#fb7185';

  return (
    <div className="relative w-14 h-14 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r={nr} fill="none" stroke="#1f1f23" strokeWidth={stroke} />
        <circle
          cx="20" cy="20" r={nr} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold font-mono text-txt-primary">
        {percent}%
      </span>
    </div>
  );
}

export default function RecommendationList({ recommendations, userSpec }) {
  const [copiedId, setCopiedId] = useState(null);

  const copySettings = (item) => {
    const text = Object.entries(item.settings).map(([k, v]) => `${k}: ${v}`).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(console.error);
  };

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="surface-card p-12 text-center">
        <p className="text-sm text-txt-secondary">매칭되는 그래픽 프로파일이 없습니다.</p>
        <p className="text-xs text-txt-muted mt-1">다른 해상도나 사양을 시도해 보세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-surface-3/50">
        <h3 className="text-sm font-bold text-txt-primary">
          매칭 결과 <span className="text-accent ml-1">{recommendations.length}건</span>
        </h3>
        <span className="font-mono text-[11px] text-accent bg-accent/5 px-3 py-1 rounded-lg border border-accent/10">
          {userSpec.gpu_model} / {userSpec.resolution}
        </span>
      </div>

      {/* Result Cards */}
      <div className="space-y-4">
        {recommendations.map((item) => {
          const pct = Math.round(item.similarity_score * 100);
          const isHigh = pct >= 90;

          return (
            <div key={item.id} className="surface-card p-5 hover:border-accent/30 transition-all duration-300 animate-slide-up">
              <div className="flex items-start gap-4">
                {/* Donut */}
                <DonutGauge percent={pct} isHigh={isHigh} />

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-3">
                  {/* Match Tag + Specs */}
                  <div className="flex flex-wrap items-center gap-2">
                    {isHigh ? (
                      <span className="tag-mint">
                        <CheckCircle2 size={11} /> 최상 일치
                      </span>
                    ) : (
                      <span className="tag-rose">
                        <ShieldAlert size={11} /> 보통 일치
                      </span>
                    )}
                    <span className="text-xs text-txt-muted">
                      {item.hardware.gpu || item.hardware.gpu_model} · {item.hardware.cpu || item.hardware.cpu_model}
                    </span>
                  </div>

                  {/* Stats Row */}
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-txt-secondary">
                    <span>해상도 <strong className="text-txt-primary font-mono">{item.hardware.resolution}</strong></span>
                    <span>FPS <strong className="font-mono tag-accent py-0 px-1.5 border-0 bg-transparent text-accent">{item.avg_fps}</strong></span>
                    <span>버전 <span className="font-mono text-txt-muted">{item.game_version}</span></span>
                  </div>

                  {/* Settings Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(item.settings).map(([key, val]) => (
                      <span key={key} className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-surface-1 border border-surface-3/50 text-txt-secondary">
                        <span className="text-txt-muted">{key}</span>
                        <span className="text-accent font-semibold">{val}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-surface-3/30">
                <button className="btn-ghost flex items-center gap-1.5 text-[11px] py-1.5">
                  <ThumbsUp size={12} />
                  <span className="font-mono">{item.likes || 0}</span>
                </button>
                <button
                  onClick={() => copySettings(item)}
                  className={`flex items-center gap-1.5 text-[11px] font-semibold py-1.5 px-3 rounded-xl transition-all duration-300 ${
                    copiedId === item.id
                      ? 'bg-mint/10 text-mint border border-mint/20'
                      : 'btn-primary py-1.5 px-3 text-[11px]'
                  }`}
                >
                  {copiedId === item.id ? <><Check size={12} /> 복사 완료</> : <><Copy size={12} /> 설정 복사</>}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
