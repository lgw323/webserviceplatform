import React, { useState } from 'react';
import { Cpu, Monitor, HardDrive, Cpu as GpuIcon, Activity, CheckCircle2, AlertTriangle, Info, Zap } from 'lucide-react';

/* ─── Quick Presets ─── */
const PRESETS = [
  { label: 'RTX 3060 보급형',  cpu: 'AMD Ryzen 5 5600X', gpu: 'NVIDIA GeForce RTX 3060', ram: 16, res: 'FHD', hz: 144 },
  { label: 'RTX 4070S 하이엔드', cpu: 'AMD Ryzen 7 7800X3D', gpu: 'NVIDIA GeForce RTX 4070 SUPER', ram: 32, res: 'QHD', hz: 165 },
  { label: 'RTX 4090 플래그십', cpu: 'Intel Core i9-14900K', gpu: 'NVIDIA GeForce RTX 4090', ram: 64, res: '4K', hz: 240 },
];

/* ─── Validators ─── */
const validateCpu = (v) => {
  if (!v.trim()) return null;
  return /(ryzen|intel|core|i[3579]|xeon|threadripper|amd)/i.test(v)
    ? { ok: true, msg: '유효한 CPU 모델 형식입니다.' }
    : { ok: false, msg: 'AMD Ryzen, Intel Core 등 브랜드명을 포함해 주세요.' };
};

const validateGpu = (v) => {
  if (!v.trim()) return null;
  return /(rtx|gtx|geforce|radeon|rx|nvidia|amd|arc|vega)/i.test(v)
    ? { ok: true, msg: '유효한 GPU 모델 형식입니다.' }
    : { ok: false, msg: 'RTX, GTX, Radeon 등 GPU 계열명을 포함해 주세요.' };
};

function ValidationHint({ result }) {
  if (!result) return null;
  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium mt-1.5 ${result.ok ? 'text-mint' : 'text-rose'}`}>
      {result.ok ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
      <span>{result.msg}</span>
    </div>
  );
}

export default function HardwareProfileForm({ onSave }) {
  const [profile, setProfile] = useState({
    cpu_model: '', gpu_model: '', ram_gb: 16,
    resolution: 'FHD', refresh_rate: 144, is_default: true,
  });

  const cpuResult = validateCpu(profile.cpu_model);
  const gpuResult = validateGpu(profile.gpu_model);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const applyPreset = (preset) => {
    setProfile({
      cpu_model: preset.cpu, gpu_model: preset.gpu,
      ram_gb: preset.ram, resolution: preset.res,
      refresh_rate: preset.hz, is_default: true,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cpuResult && !cpuResult.ok) return;
    if (gpuResult && !gpuResult.ok) return;
    onSave?.(profile);
    alert('하드웨어 프로필이 저장되었습니다!');
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="surface-card p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-surface-3/50">
          <div className="p-2.5 rounded-xl bg-accent/10">
            <Activity size={20} className="text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-txt-primary">하드웨어 사양 등록</h2>
            <p className="text-xs text-txt-muted mt-0.5">정확한 입력으로 최적의 그래픽 매칭 정밀도를 높입니다.</p>
          </div>
        </div>

        {/* Info Notice */}
        <div className="surface-inset p-4 mb-6 flex items-start gap-3 text-xs leading-relaxed">
          <Info size={16} className="text-sky mt-0.5 flex-shrink-0" />
          <div className="text-txt-secondary">
            <span className="font-semibold text-sky block mb-0.5">데이터 수집 안내</span>
            입력 사양은 매칭 엔진의 유사도 판별에만 활용되며, 외부 서버로 전송되지 않습니다.
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mb-6">
          <div className="text-[10px] font-bold text-txt-muted uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
            <Zap size={10} /> 원클릭 퀵 세팅
          </div>
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => applyPreset(p)}
                className="btn-ghost text-[10px] py-2 px-2 text-center leading-tight"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-semibold text-txt-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5 block">
              <Cpu size={12} className="text-accent" /> CPU 모델명
            </label>
            <input name="cpu_model" value={profile.cpu_model} onChange={handleChange} placeholder="예: AMD Ryzen 7 7800X3D" required className="input-field" />
            <ValidationHint result={cpuResult} />
          </div>

          <div>
            <label className="text-xs font-semibold text-txt-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5 block">
              <GpuIcon size={12} className="text-accent" /> GPU 모델명
            </label>
            <input name="gpu_model" value={profile.gpu_model} onChange={handleChange} placeholder="예: NVIDIA GeForce RTX 4070 SUPER" required className="input-field" />
            <ValidationHint result={gpuResult} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-txt-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5 block">
                <HardDrive size={12} className="text-accent" /> RAM
              </label>
              <select name="ram_gb" value={profile.ram_gb} onChange={handleChange} className="input-field">
                {[8, 16, 32, 64].map(v => <option key={v} value={v} className="bg-surface-2">{v} GB</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-txt-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5 block">
                <Monitor size={12} className="text-accent" /> 해상도
              </label>
              <select name="resolution" value={profile.resolution} onChange={handleChange} className="input-field">
                <option value="FHD" className="bg-surface-2">FHD</option>
                <option value="QHD" className="bg-surface-2">QHD</option>
                <option value="4K" className="bg-surface-2">4K</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-txt-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5 block">
                <Monitor size={12} className="text-accent" /> 주사율
              </label>
              <input type="number" name="refresh_rate" value={profile.refresh_rate} onChange={handleChange} min="60" max="500" required className="input-field" />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none pt-1">
            <input type="checkbox" name="is_default" checked={profile.is_default} onChange={handleChange}
              className="w-4 h-4 rounded bg-surface-1 border-surface-4 text-accent focus:ring-accent/30 accent-[#6d5dfc]" />
            <span className="text-xs text-txt-secondary font-medium">기본 하드웨어로 지정하여 매칭 추천 받기</span>
          </label>

          <button type="submit" className="btn-primary w-full mt-2">
            사양 저장 및 매칭 시작
          </button>
        </form>
      </div>
    </div>
  );
}
