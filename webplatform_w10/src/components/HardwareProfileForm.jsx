import React, { useState } from 'react';
import { Cpu, Monitor, HardDrive, Plus, CheckCircle2, Server, Trash2, ArrowRight, ArrowLeft, Save, AlertTriangle, Info, Zap } from 'lucide-react';

const PRESETS = [
  { label: 'RTX 3060 보급형', name: 'Budget Gaming', cpu: 'AMD Ryzen 5 5600X', gpu: 'NVIDIA GeForce RTX 3060', ram: '16', res: 'FHD', hz: '144' },
  { label: 'RTX 4070S 하이엔드', name: 'High End', cpu: 'AMD Ryzen 7 7800X3D', gpu: 'NVIDIA GeForce RTX 4070 SUPER', ram: '32', res: 'QHD', hz: '165' },
  { label: 'RTX 4090 플래그십', name: 'Flagship', cpu: 'Intel Core i9-14900K', gpu: 'NVIDIA GeForce RTX 4090', ram: '64', res: '4K', hz: '240' },
];

export default function HardwareProfileForm({ onSave }) {
  const [profiles, setProfiles] = useState([
    { id: 'hw-1', name: 'Main Gaming Rig', isDefault: true, cpu: 'AMD Ryzen 5 5600X', gpu: 'NVIDIA GeForce RTX 3060', ram: '16', resolution: 'FHD', refreshRate: '144' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', cpu: '', gpu: '', ram: '', resolution: 'FHD', refreshRate: '' });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };

  const applyPreset = (p) => {
    setFormData({ name: p.name, cpu: p.cpu, gpu: p.gpu, ram: p.ram, resolution: p.res, refreshRate: p.hz });
  };

  const handleSave = () => {
    const np = { id: `hw-${Date.now()}`, ...formData, isDefault: profiles.length === 0 };
    setProfiles(prev => [...prev, np]);
    setShowForm(false); setFormStep(1);
    setFormData({ name: '', cpu: '', gpu: '', ram: '', resolution: 'FHD', refreshRate: '' });
    if (onSave) {
      onSave({ cpu_model: np.cpu, gpu_model: np.gpu, ram_gb: parseInt(np.ram) || 16, resolution: np.resolution, refresh_rate: parseInt(np.refreshRate) || 144 });
    }
  };

  const handleSetDefault = (id) => setProfiles(p => p.map(x => ({ ...x, isDefault: x.id === id })));
  const handleDelete = (id) => {
    setProfiles(p => {
      const f = p.filter(x => x.id !== id);
      if (f.length > 0 && !f.some(x => x.isDefault)) f[0].isDefault = true;
      return f;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 mb-1">Hardware Profiles</h1>
          <p className="text-gray-400">Manage your PC specifications for accurate optimization matching.</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="flex items-center px-4 py-2 bg-cyber-accent hover:bg-blue-600 text-white rounded-lg transition-colors font-medium shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Plus className="w-5 h-5 mr-2" /> Add New Profile
          </button>
        )}
      </div>

      {/* Info Notice */}
      <div className="flex items-start gap-3 text-sm text-gray-400 bg-cyber-darker/50 p-4 rounded-lg border border-gray-800/50">
        <Info className="w-5 h-5 text-cyber-accent mt-0.5 flex-shrink-0" />
        <div>
          <span className="font-semibold text-gray-300 block mb-0.5">데이터 수집 안내</span>
          입력하신 사양은 매칭 엔진의 유사도 판별에만 활용되며, 외부 서버로 전송되지 않습니다.
        </div>
      </div>

      {/* Multi-step Create Form */}
      {showForm && (
        <div className="bg-cyber-card border border-cyber-accent/50 rounded-xl p-6 shadow-[0_0_30px_rgba(59,130,246,0.15)] animation-fade-in relative overflow-hidden">
          {/* Progress */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
            <div className="h-full bg-cyber-accent transition-all duration-300" style={{ width: `${(formStep / 3) * 100}%` }} />
          </div>

          <div className="flex justify-between items-center mb-6 pt-2">
            <h2 className="text-xl font-bold text-gray-100">
              Create Profile: <span className="text-cyber-accent">Step {formStep} of 3</span>
            </h2>
            <button onClick={() => { setShowForm(false); setFormStep(1); }} className="text-gray-500 hover:text-white text-sm">Cancel</button>
          </div>

          {/* Quick Presets (Step 1 only) */}
          {formStep === 1 && (
            <div className="mb-5 p-3 bg-cyber-darker rounded-lg border border-gray-800">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Zap className="w-3 h-3" /> 원클릭 퀵 세팅
              </div>
              <div className="grid grid-cols-3 gap-2">
                {PRESETS.map(p => (
                  <button key={p.label} type="button" onClick={() => applyPreset(p)}
                    className="text-[11px] py-2 px-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg border border-gray-700 transition-colors font-medium">
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6 space-y-4">
            {formStep === 1 && (
              <div className="animation-fade-in space-y-4">
                <p className="text-gray-400 text-sm">Let's start with a name and your core processing units.</p>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Profile Name</label>
                  <input name="name" value={formData.name} onChange={handleInput} placeholder="e.g. Living Room HTPC" className="w-full bg-cyber-darker border border-gray-700 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:border-cyber-accent transition-colors" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">CPU Model</label>
                  <input name="cpu" value={formData.cpu} onChange={handleInput} placeholder="e.g. Ryzen 5 5600X" className="w-full bg-cyber-darker border border-gray-700 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:border-cyber-accent transition-colors" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">GPU Model</label>
                  <input name="gpu" value={formData.gpu} onChange={handleInput} placeholder="e.g. RTX 3060" className="w-full bg-cyber-darker border border-gray-700 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:border-cyber-accent transition-colors" />
                </div>
              </div>
            )}
            {formStep === 2 && (
              <div className="animation-fade-in space-y-4">
                <p className="text-gray-400 text-sm">Next, input your system memory (RAM).</p>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">RAM Capacity (GB)</label>
                  <input name="ram" type="number" value={formData.ram} onChange={handleInput} placeholder="e.g. 16 or 32" className="w-full bg-cyber-darker border border-gray-700 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:border-cyber-accent transition-colors" />
                </div>
              </div>
            )}
            {formStep === 3 && (
              <div className="animation-fade-in space-y-4">
                <p className="text-gray-400 text-sm">Finally, what is your primary display setup?</p>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Target Resolution</label>
                  <select name="resolution" value={formData.resolution} onChange={handleInput} className="w-full bg-cyber-darker border border-gray-700 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:border-cyber-accent appearance-none transition-colors">
                    <option value="FHD">1080p (FHD)</option>
                    <option value="QHD">1440p (QHD)</option>
                    <option value="4K">4K (UHD)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Refresh Rate (Hz)</label>
                  <input name="refreshRate" type="number" value={formData.refreshRate} onChange={handleInput} placeholder="e.g. 144" className="w-full bg-cyber-darker border border-gray-700 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:border-cyber-accent transition-colors" />
                </div>
              </div>
            )}
          </div>

          {/* Form Navigation */}
          <div className="flex justify-between pt-4 border-t border-gray-800">
            <button onClick={() => setFormStep(s => s - 1)} disabled={formStep === 1}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${formStep === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>
            {formStep < 3 ? (
              <button onClick={() => setFormStep(s => s + 1)} disabled={formStep === 1 && (!formData.name || !formData.cpu || !formData.gpu)}
                className="flex items-center px-6 py-2 bg-cyber-accent hover:bg-blue-600 text-white rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                Next Step <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button onClick={handleSave} disabled={!formData.resolution || !formData.refreshRate}
                className="flex items-center px-6 py-2 bg-cyber-success hover:bg-green-600 text-white rounded-lg transition-all font-medium shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
                <Save className="w-4 h-4 mr-2" /> Save Profile
              </button>
            )}
          </div>
        </div>
      )}

      {/* Profile Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {profiles.map(profile => (
          <div key={profile.id} className={`bg-cyber-card rounded-xl border p-6 relative transition-all ${profile.isDefault ? 'border-cyber-accent shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'border-gray-800 hover:border-gray-700'}`}>
            {profile.isDefault && (
              <div className="absolute -top-3 -right-3">
                <div className="bg-cyber-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Default
                </div>
              </div>
            )}

            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${profile.isDefault ? 'bg-blue-500/10 text-cyber-accent' : 'bg-gray-800 text-gray-400'}`}>
                  <Server className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-gray-100">{profile.name}</h3>
                  <p className="text-sm text-gray-500">ID: {profile.id}</p>
                </div>
              </div>
              <button onClick={() => handleDelete(profile.id)} className="text-gray-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-400/10 transition-colors" title="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Cpu, label: 'Processor', value: profile.cpu },
                { icon: Monitor, label: 'Graphics', value: profile.gpu },
                { icon: HardDrive, label: 'Memory', value: `${profile.ram} GB` },
                { icon: Monitor, label: 'Display', value: `${profile.resolution} @ ${profile.refreshRate}Hz` },
              ].map(spec => {
                const Icon = spec.icon;
                return (
                  <div key={spec.label} className="space-y-1">
                    <div className="flex items-center text-xs text-gray-500 font-medium uppercase tracking-wider">
                      <Icon className="w-3 h-3 mr-1.5" /> {spec.label}
                    </div>
                    <p className="text-sm text-gray-200 font-medium">{spec.value}</p>
                  </div>
                );
              })}
            </div>

            {!profile.isDefault && (
              <div className="mt-6 pt-4 border-t border-gray-800">
                <button onClick={() => handleSetDefault(profile.id)} className="text-sm font-medium text-cyber-accent hover:text-blue-400 transition-colors flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1.5" /> Set as Default Profile
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
