import React from 'react';
import { Crown, Zap } from 'lucide-react';

const PremiumBannerWidget = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-cyber-dark to-black border border-cyber-accent/50 p-5 rounded-lg group hover:border-cyber-accent transition-colors duration-300">
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
        <Crown className="w-16 h-16 text-cyber-accent" />
      </div>
      
      <h3 className="text-lg font-bold text-cyber-accent mb-2 flex items-center">
        <Crown className="w-5 h-5 mr-2" /> SYNCRIG Premium
      </h3>
      
      <p className="text-sm text-gray-300 mb-4 relative z-10 leading-relaxed">
        클라우드 자동 백업 및 <span className="text-white font-semibold">상위 1% 유저와의 교차 분석</span> 통계를 지금 해제하세요.
      </p>
      
      <button className="w-full bg-cyber-accent/10 hover:bg-cyber-accent text-cyber-accent hover:text-black border border-cyber-accent font-bold py-2 px-4 rounded transition-all duration-300 flex items-center justify-center">
        <Zap className="w-4 h-4 mr-2" />
        자세히 보기
      </button>
    </div>
  );
};

export default PremiumBannerWidget;
