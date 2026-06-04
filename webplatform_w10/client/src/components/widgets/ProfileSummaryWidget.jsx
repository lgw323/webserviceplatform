import React from 'react';
import useAuthStore from '../../store/useAuthStore';
import { User, Cpu, Shield, Gamepad2 } from 'lucide-react';

const ProfileSummaryWidget = () => {
  const { user, profile } = useAuthStore();

  return (
    <div className="bg-cyber-dark border border-cyber-light/20 p-5 rounded-lg shadow-[0_0_15px_rgba(0,255,157,0.1)]">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-cyber-light/10 rounded-full flex items-center justify-center border border-cyber-accent">
          <User className="text-cyber-accent w-6 h-6" />
        </div>
        <div>
          <h3 className="text-white font-bold">{user?.username || user?.provider_id || '게스트'}</h3>
          <p className="text-xs text-cyber-light flex items-center mt-1">
            <Shield className="w-3 h-3 mr-1" /> 일반 유저
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-cyber-light mb-1 uppercase tracking-wider font-semibold">연동된 계정</p>
          <div className="flex items-center justify-between bg-black/40 p-2 rounded border border-cyber-light/10">
            <span className="text-sm text-gray-300 flex items-center"><Gamepad2 className="w-4 h-4 mr-2 text-blue-400"/> Steam</span>
            <span className="text-xs text-cyber-accent">연동됨</span>
          </div>
        </div>

        <div>
          <p className="text-xs text-cyber-light mb-1 uppercase tracking-wider font-semibold">내 하드웨어 스코어</p>
          <div className="bg-black/40 p-3 rounded border border-cyber-light/10 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-300">
              <Cpu className="w-4 h-4 mr-2 text-purple-400"/>
              종합 성능 지수
            </div>
            <span className="text-lg font-bold text-white tracking-wider">
              {profile ? profile.gpu.replace(/[^0-9]/g, '').slice(0, 4) || '8540' : '측정필요'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSummaryWidget;
