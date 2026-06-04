import React from 'react';
import { ShoppingCart, Cpu } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const TargetedAdWidget = () => {
  const { profile } = useAuthStore();
  
  // 내 하드웨어 프로필에 기반한 타겟팅 광고 로직 (가짜)
  const currentGpu = profile?.gpu || 'RTX 3060';
  const isHighEnd = currentGpu.includes('4080') || currentGpu.includes('4090');

  return (
    <div className="bg-cyber-darker border border-gray-800 p-5 rounded-lg relative overflow-hidden">
      <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 text-[10px] text-gray-400 rounded">
        AD
      </div>
      
      <div className="flex items-center justify-center w-12 h-12 bg-purple-900/30 rounded-lg mb-4 border border-purple-500/30">
        <Cpu className="w-6 h-6 text-purple-400" />
      </div>

      <h3 className="text-gray-200 font-bold mb-2 text-sm leading-tight">
        {isHighEnd 
          ? `${currentGpu} 성능을 100% 뽑아내는 4K 144Hz 게이밍 모니터 기획전` 
          : `현재 ${currentGpu} 쓰시나요? RTX 40 SUPER 시리즈 특가 확인하기`}
      </h3>
      
      <p className="text-xs text-gray-400 mb-4">
        SYNCRIG 유저 한정 최대 15% 추가 할인 쿠폰 증정
      </p>

      <button className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold py-2 px-4 rounded transition-colors flex items-center justify-center">
        <ShoppingCart className="w-3 h-3 mr-2" />
        최저가 알아보기
      </button>
    </div>
  );
};

export default TargetedAdWidget;
