import React from 'react';
import { TrendingUp, MonitorPlay } from 'lucide-react';

const TrendingProfilesWidget = () => {
  const trendingData = [
    { id: 1, title: 'RTX 4090 4K 풀옵션', author: 'CyberNinja', likes: 124 },
    { id: 2, title: '국민옵션 144Hz 방어', author: 'FPS_Master', likes: 89 },
    { id: 3, title: '노트북 발열 최소화 세팅', author: 'NomadGamer', likes: 67 },
  ];

  return (
    <div className="bg-cyber-dark border border-cyber-light/20 p-5 rounded-lg">
      <h3 className="text-white font-bold mb-4 flex items-center">
        <TrendingUp className="w-5 h-5 text-cyber-accent mr-2" />
        인기 최적화 프로필
      </h3>
      
      <div className="space-y-3">
        {trendingData.map((item, index) => (
          <div key={item.id} className="flex items-start justify-between p-2 hover:bg-black/40 rounded transition-colors cursor-pointer group">
            <div className="flex items-start space-x-3">
              <span className="text-cyber-accent font-bold mt-0.5">{index + 1}</span>
              <div>
                <p className="text-sm text-gray-200 font-medium group-hover:text-cyber-accent transition-colors">{item.title}</p>
                <p className="text-xs text-cyber-light mt-0.5">by {item.author}</p>
              </div>
            </div>
            <div className="flex items-center text-xs text-gray-400">
              <MonitorPlay className="w-3 h-3 mr-1" />
              {item.likes}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingProfilesWidget;
