import React from 'react';
import { ExternalLink, Cpu, Monitor } from 'lucide-react';

const UpgradeRecommendationWidget = ({ ad }) => {
  if (!ad) return null;

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-5 mt-4 transition-all hover:bg-white/10">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400 shrink-0">
            {ad.type === 'cpu' ? <Cpu size={24} /> : <Monitor size={24} />}
          </div>
          <div>
            <h4 className="text-white font-semibold flex items-center gap-2">
              {ad.title}
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full text-white/70">Sponsored</span>
            </h4>
            <p className="text-gray-400 text-sm mt-1 mb-3">{ad.description}</p>
            <a 
              href={ad.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              추천 제품 확인하기
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeRecommendationWidget;
