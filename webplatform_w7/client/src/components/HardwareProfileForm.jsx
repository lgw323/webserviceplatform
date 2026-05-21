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
    <div className="max-w-xl mx-auto bg-white rounded-brand-lg shadow-brand-soft border border-gray-100 p-6 md:p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-brand-green/10 text-brand-green rounded-brand-md">
          <Activity size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-brand-charcoal">내 하드웨어 사양 등록</h2>
          <p className="text-xs text-neutral-grayText">최적의 그래픽 매칭을 위해 정확한 사양을 입력해 주세요.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-brand-charcoal mb-2 flex items-center gap-1">
            <Cpu size={14} className="text-brand-green" /> CPU 모델명
          </label>
          <input
            type="text"
            name="cpu_model"
            value={profile.cpu_model}
            onChange={handleChange}
            placeholder="예: AMD Ryzen 7 7800X3D"
            required
            className="w-full px-4 py-3 rounded-brand-sm border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-charcoal mb-2 flex items-center gap-1">
            <GpuIcon size={14} className="text-brand-green" /> GPU 모델명
          </label>
          <input
            type="text"
            name="gpu_model"
            value={profile.gpu_model}
            onChange={handleChange}
            placeholder="예: NVIDIA GeForce RTX 4070 SUPER"
            required
            className="w-full px-4 py-3 rounded-brand-sm border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-brand-charcoal mb-2 flex items-center gap-1">
              <HardDrive size={14} className="text-brand-green" /> RAM 용량 (GB)
            </label>
            <select
              name="ram_gb"
              value={profile.ram_gb}
              onChange={handleChange}
              className="w-full px-3 py-3 rounded-brand-sm border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm bg-white"
            >
              <option value={8}>8 GB</option>
              <option value={16}>16 GB</option>
              <option value={32}>32 GB</option>
              <option value={64}>64 GB</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-charcoal mb-2 flex items-center gap-1">
              <Monitor size={14} className="text-brand-green" /> 모니터 해상도
            </label>
            <select
              name="resolution"
              value={profile.resolution}
              onChange={handleChange}
              className="w-full px-3 py-3 rounded-brand-sm border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm bg-white"
            >
              <option value="FHD">FHD (1080p)</option>
              <option value="QHD">QHD (1440p)</option>
              <option value="4K">4K UHD (2160p)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-charcoal mb-2 flex items-center gap-1">
              <Monitor size={14} className="text-brand-green" /> 주사율 (Hz)
            </label>
            <input
              type="number"
              name="refresh_rate"
              value={profile.refresh_rate}
              onChange={handleChange}
              min="60"
              max="500"
              required
              className="w-full px-3 py-3 rounded-brand-sm border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <input
            type="checkbox"
            id="is_default"
            name="is_default"
            checked={profile.is_default}
            onChange={handleChange}
            className="w-4 h-4 rounded text-brand-green focus:ring-brand-green border-gray-300"
          />
          <label htmlFor="is_default" className="text-xs text-brand-charcoal font-medium select-none">
            이 프로필을 기본 하드웨어로 지정하여 매칭 추천 받기
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-brand-green hover:bg-brand-green/90 text-white font-bold rounded-brand-md text-sm transition-colors duration-200 shadow-brand-glow focus:outline-none"
        >
          사양 저장 완료
        </button>
      </form>
    </div>
  );
}
