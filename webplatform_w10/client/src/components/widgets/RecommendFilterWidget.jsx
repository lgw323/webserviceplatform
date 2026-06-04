import React from 'react';
import { Filter, Search, SlidersHorizontal } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const RecommendFilterWidget = () => {
  const { userSpec } = useAuthStore();

  return (
    <div className="bg-cyber-dark border border-gray-800 p-5 rounded-lg space-y-6">
      <div>
        <h3 className="text-gray-200 font-bold mb-4 flex items-center">
          <Filter className="w-4 h-4 mr-2 text-cyber-accent" />
          상세 필터링
        </h3>
        
        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
          <input 
            type="text" 
            placeholder="게임명 검색..." 
            className="w-full bg-black/40 border border-gray-700 rounded-lg py-2 pl-9 pr-4 text-sm text-gray-200 focus:outline-none focus:border-cyber-accent"
          />
        </div>
      </div>

      <div>
        <p className="text-xs text-cyber-light font-semibold mb-3 uppercase tracking-wider">대상 해상도</p>
        <div className="flex flex-col space-y-2">
          <label className="flex items-center space-x-2 text-sm text-gray-400 cursor-pointer hover:text-gray-200 transition-colors">
            <input type="checkbox" className="rounded bg-black border-gray-700 text-cyber-accent focus:ring-cyber-accent" defaultChecked />
            <span>QHD (1440p)</span>
          </label>
          <label className="flex items-center space-x-2 text-sm text-gray-400 cursor-pointer hover:text-gray-200 transition-colors">
            <input type="checkbox" className="rounded bg-black border-gray-700 text-cyber-accent focus:ring-cyber-accent" />
            <span>4K (2160p)</span>
          </label>
          <label className="flex items-center space-x-2 text-sm text-gray-400 cursor-pointer hover:text-gray-200 transition-colors">
            <input type="checkbox" className="rounded bg-black border-gray-700 text-cyber-accent focus:ring-cyber-accent" />
            <span>FHD (1080p)</span>
          </label>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-800">
        <p className="text-xs text-cyber-light font-semibold mb-3 uppercase tracking-wider">나의 기준 하드웨어</p>
        <div className="bg-black/60 p-3 rounded text-xs text-gray-400 border border-gray-800/50 leading-relaxed">
          <span className="text-gray-200 font-medium block mb-1">GPU</span>
          {userSpec?.gpu_model || '미등록'}<br/>
          <span className="text-gray-200 font-medium block mt-2 mb-1">CPU</span>
          {userSpec?.cpu_model || '미등록'}
        </div>
      </div>

      <button className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-semibold rounded transition-colors flex items-center justify-center">
        <SlidersHorizontal className="w-4 h-4 mr-2" />
        필터 초기화
      </button>
    </div>
  );
};

export default RecommendFilterWidget;
