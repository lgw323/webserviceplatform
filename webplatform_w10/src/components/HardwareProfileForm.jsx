import React, { useState } from 'react';
import { Cpu, Monitor, HardDrive, Cpu as GpuIcon, Activity, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export default function HardwareProfileForm({ onSave }) {
  const [profile, setProfile] = useState({
    cpu_model: '',
    gpu_model: '',
    ram_gb: 16,
    resolution: 'FHD',
    refresh_rate: 144,
    is_default: true
  });

  const [cpuFeedback, setCpuFeedback] = useState({ text: 'CPU 모델명을 기입해 주세요. (예: Ryzen 7 7800X3D)', isValid: null });
  const [gpuFeedback, setGpuFeedback] = useState({ text: 'GPU 모델명을 기입해 주세요. (예: RTX 3060)', isValid: null });

  const validateCpu = (val) => {
    if (!val.trim()) return { text: 'CPU 모델명을 기입해 주세요. (예: Ryzen 7 7800X3D)', isValid: null };
    const regex = /(ryzen|intel|core|i3|i5|i7|i9|xeon|threadripper|athlon|pentium|celeron|amd)/i;
    if (regex.test(val)) {
      return { text: '올바른 형식의 CPU 명칭입니다.', isValid: true };
    }
    return { text: 'Ryzen, Intel Core 등 부품 브랜드 명칭을 포함하는지 확인해 주세요.', isValid: false };
  };

  const validateGpu = (val) => {
    if (!val.trim()) return { text: 'GPU 모델명을 기입해 주세요. (예: RTX 3060)', isValid: null };
    const regex = /(rtx|gtx|geforce|radeon|rx|nvidia|amd|intel|arc|vega|quadro)/i;
    if (regex.test(val)) {
      return { text: '올바른 형식의 GPU 명칭입니다.', isValid: true };
    }
    return { text: 'RTX, RX, Radeon, GeForce 등 GPU 모델 계열명이 포함되어야 합니다.', isValid: false };
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : value;
    
    setProfile(prev => ({
      ...prev,
      [name]: finalValue
    }));

    if (name === 'cpu_model') {
      setCpuFeedback(validateCpu(value));
    }
    if (name === 'gpu_model') {
      setGpuFeedback(validateGpu(value));
    }
  };

  const applyPreset = (presetType) => {
    let preset = {};
    if (presetType === 'budget') {
      preset = {
        cpu_model: 'AMD Ryzen 5 5600X',
        gpu_model: 'NVIDIA GeForce RTX 3060',
        ram_gb: 16,
        resolution: 'FHD',
        refresh_rate: 144,
        is_default: true
      };
    } else if (presetType === 'high') {
      preset = {
        cpu_model: 'AMD Ryzen 7 7800X3D',
        gpu_model: 'NVIDIA GeForce RTX 4070 SUPER',
        ram_gb: 32,
        resolution: 'QHD',
        refresh_rate: 165,
        is_default: true
      };
    } else if (presetType === 'flagship') {
      preset = {
        cpu_model: 'Intel Core i9-14900K',
        gpu_model: 'NVIDIA GeForce RTX 4090',
        ram_gb: 64,
        resolution: '4K',
        refresh_rate: 240,
        is_default: true
      };
    }
    setProfile(preset);
    setCpuFeedback(validateCpu(preset.cpu_model));
    setGpuFeedback(validateGpu(preset.gpu_model));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Final check before saving
    const cpuVal = validateCpu(profile.cpu_model);
    const gpuVal = validateGpu(profile.gpu_model);
    
    if (cpuVal.isValid === false || gpuVal.isValid === false) {
      alert('입력된 사양 정보가 올바른 규격에 맞는지 다시 한번 확인해 주세요.');
      return;
    }

    if (onSave) {
      onSave(profile);
    }
    alert('하드웨어 프로필이 성공적으로 저장되었습니다!');
  };

  return (
    <div className="max-w-xl mx-auto glass-panel rounded-brand-lg shadow-brand-soft p-6 md:p-8">
      <div className="flex items-center space-x-4 mb-6 border-b border-white/5 pb-5">
        <div className="p-3 bg-[#00ff66]/10 text-[#00ff66] rounded-brand-md border border-[#00ff66]/20 shadow-brand-glow-subtle">
          <Activity size={24} />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">내 하드웨어 사양 등록</h2>
          <p className="text-xs text-gray-400 mt-0.5">최적의 그래픽 매칭을 위해 정확한 사양을 입력해 주세요.</p>
        </div>
      </div>

      {/* Info Notice (Guide #3 - Explain Collection Purpose) */}
      <div className="mb-6 p-4 bg-blue-500/5 rounded-brand-md border border-blue-500/10 text-[11px] leading-relaxed text-blue-400 flex items-start gap-2.5">
        <Info size={16} className="mt-0.5 flex-shrink-0 text-blue-400" />
        <div>
          <span className="font-extrabold block text-blue-300 mb-0.5">하드웨어 정보 수집 안내</span>
          기입하시는 부품 사양은 9주차 매칭 엔진(유사도 판별 가중치 알고리즘)에 의해 최적의 그래픽 카드 추천 설정값을 불러오는 용도로만 사용되며, 외부 서버나 마케팅 용도로 절대 유출되거나 수집되지 않습니다.
        </div>
      </div>

      {/* Quick Setup Presets (Guide #1 - Minimize User Input) */}
      <div className="mb-6 space-y-2">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">원클릭 대표 사양 퀵 세팅</span>
        <div className="grid grid-cols-3 gap-2">
          <button 
            type="button" 
            onClick={() => applyPreset('budget')}
            className="px-2 py-2 bg-black/40 hover:bg-[#00ff66]/10 border border-white/5 hover:border-[#00ff66]/30 rounded-brand-sm text-[10px] text-gray-300 hover:text-[#00ff66] font-bold transition-all duration-300"
          >
            RTX 3060 사양
          </button>
          <button 
            type="button" 
            onClick={() => applyPreset('high')}
            className="px-2 py-2 bg-black/40 hover:bg-[#00ff66]/10 border border-white/5 hover:border-[#00ff66]/30 rounded-brand-sm text-[10px] text-gray-300 hover:text-[#00ff66] font-bold transition-all duration-300"
          >
            RTX 4070S 사양
          </button>
          <button 
            type="button" 
            onClick={() => applyPreset('flagship')}
            className="px-2 py-2 bg-black/40 hover:bg-[#00ff66]/10 border border-white/5 hover:border-[#00ff66]/30 rounded-brand-sm text-[10px] text-gray-300 hover:text-[#00ff66] font-bold transition-all duration-300"
          >
            RTX 4090 사양
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* CPU Input with Validation Feedback */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu size={14} className="text-[#00ff66]" /> CPU 모델명
          </label>
          <input
            type="text"
            name="cpu_model"
            value={profile.cpu_model}
            onChange={handleChange}
            placeholder="예: AMD Ryzen 7 7800X3D"
            required
            className="w-full px-4 py-3 bg-black/40 rounded-brand-sm border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#00ff66] focus:ring-1 focus:ring-[#00ff66] text-sm transition-all duration-200"
          />
          {profile.cpu_model && (
            <div className={`flex items-center gap-1.5 text-xs font-medium ${cpuFeedback.isValid ? 'text-[#00ff66]' : 'text-amber-500'}`}>
              {cpuFeedback.isValid ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
              <span>{cpuFeedback.text}</span>
            </div>
          )}
        </div>

        {/* GPU Input with Validation Feedback */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
            <GpuIcon size={14} className="text-[#00ff66]" /> GPU 모델명
          </label>
          <input
            type="text"
            name="gpu_model"
            value={profile.gpu_model}
            onChange={handleChange}
            placeholder="예: NVIDIA GeForce RTX 4070 SUPER"
            required
            className="w-full px-4 py-3 bg-black/40 rounded-brand-sm border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#00ff66] focus:ring-1 focus:ring-[#00ff66] text-sm transition-all duration-200"
          />
          {profile.gpu_model && (
            <div className={`flex items-center gap-1.5 text-xs font-medium ${gpuFeedback.isValid ? 'text-[#00ff66]' : 'text-amber-500'}`}>
              {gpuFeedback.isValid ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
              <span>{gpuFeedback.text}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <HardDrive size={14} className="text-[#00ff66]" /> RAM (GB)
            </label>
            <select
              name="ram_gb"
              value={profile.ram_gb}
              onChange={handleChange}
              className="w-full px-3 py-3 bg-black/40 rounded-brand-sm border border-white/10 text-white focus:outline-none focus:border-[#00ff66] focus:ring-1 focus:ring-[#00ff66] text-sm transition-all duration-200"
            >
              <option value={8} className="bg-[#13171d]">8 GB</option>
              <option value={16} className="bg-[#13171d]">16 GB</option>
              <option value={32} className="bg-[#13171d]">32 GB</option>
              <option value={64} className="bg-[#13171d]">64 GB</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Monitor size={14} className="text-[#00ff66]" /> 해상도
            </label>
            <select
              name="resolution"
              value={profile.resolution}
              onChange={handleChange}
              className="w-full px-3 py-3 bg-black/40 rounded-brand-sm border border-white/10 text-white focus:outline-none focus:border-[#00ff66] focus:ring-1 focus:ring-[#00ff66] text-sm transition-all duration-200"
            >
              <option value="FHD" className="bg-[#13171d]">FHD (1080p)</option>
              <option value="QHD" className="bg-[#13171d]">QHD (1440p)</option>
              <option value="4K" className="bg-[#13171d]">4K UHD (2160p)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Monitor size={14} className="text-[#00ff66]" /> 주사율 (Hz)
            </label>
            <input
              type="number"
              name="refresh_rate"
              value={profile.refresh_rate}
              onChange={handleChange}
              min="60"
              max="500"
              required
              className="w-full px-3 py-3 bg-black/40 rounded-brand-sm border border-white/10 text-white focus:outline-none focus:border-[#00ff66] focus:ring-1 focus:ring-[#00ff66] text-sm transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-1">
          <input
            type="checkbox"
            id="is_default"
            name="is_default"
            checked={profile.is_default}
            onChange={handleChange}
            className="w-4 h-4 rounded text-black border-white/10 bg-black/40 focus:ring-[#00ff66] accent-[#00ff66]"
          />
          <label htmlFor="is_default" className="text-xs text-gray-300 font-medium select-none cursor-pointer">
            이 프로필을 기본 하드웨어로 지정하여 매칭 추천 받기
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-4 px-4 bg-gradient-to-r from-[#00ff66] to-[#00cc52] hover:from-[#33ff85] hover:to-[#00e65c] text-black font-extrabold rounded-brand-md text-sm transition-all duration-300 shadow-brand-glow hover:shadow-[0_0_25px_rgba(0,255,102,0.55)] focus:outline-none mt-2"
        >
          사양 저장 완료
        </button>
      </form>
    </div>
  );
}
