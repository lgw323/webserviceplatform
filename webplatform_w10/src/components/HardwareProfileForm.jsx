import React, { useState } from 'react';
import { Cpu, Monitor, HardDrive, Cpu as GpuIcon, Activity } from 'lucide-react';

export default function HardwareProfileForm({ onSave }) {
  const [profile, setProfile] = useState({
    cpu_model: '',
    gpu_model: '',
    ram_gb: 16,
    resolution: 'FHD',
    refresh_rate: 144,
    is_default: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(profile);
    }
    alert('하드웨어 프로필이 성공적으로 저장되었습니다!');
  };

  return (
    <div className="max-w-xl mx-auto glass-panel rounded-brand-lg shadow-brand-soft p-6 md:p-8">
      <div className="flex items-center space-x-4 mb-8 border-b border-white/5 pb-5">
        <div className="p-3 bg-[#00ff66]/10 text-[#00ff66] rounded-brand-md border border-[#00ff66]/20 shadow-brand-glow-subtle">
          <Activity size={24} />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">내 하드웨어 사양 등록</h2>
          <p className="text-xs text-gray-400 mt-0.5">최적의 그래픽 매칭을 위해 정확한 사양을 입력해 주세요.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Cpu size={14} className="text-[#00ff66]" /> CPU 모델명
          </label>
          <input
            type="text"
            name="cpu_model"
            value={profile.cpu_model}
            onChange={handleChange}
            placeholder="예: AMD Ryzen 7 7800X3D"
            required
            className="w-full px-4 py-3 bg-black/40 rounded-brand-sm border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#00ff66] focus:ring-1 focus:ring-[#00ff66] focus:shadow-brand-glow text-sm transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <GpuIcon size={14} className="text-[#00ff66]" /> GPU 모델명
          </label>
          <input
            type="text"
            name="gpu_model"
            value={profile.gpu_model}
            onChange={handleChange}
            placeholder="예: NVIDIA GeForce RTX 4070 SUPER"
            required
            className="w-full px-4 py-3 bg-black/40 rounded-brand-sm border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#00ff66] focus:ring-1 focus:ring-[#00ff66] focus:shadow-brand-glow text-sm transition-all duration-200"
          />
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

        <div className="flex items-center space-x-3 pt-3">
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
