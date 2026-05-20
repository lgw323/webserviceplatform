import React from 'react';
import { Clock, Trophy, Gamepad2, Monitor, TrendingUp } from 'lucide-react';

const playTimeData = [
  { name: 'Cyberpunk 2077', hours: 124, color: 'bg-cyber-accent' },
  { name: 'Valorant', hours: 450, color: 'bg-cyber-purple' },
  { name: 'Elden Ring', hours: 89, color: 'bg-cyber-warning' },
  { name: 'The Witcher 3', hours: 310, color: 'bg-cyber-success' },
];

const weeklyData = [
  { day: 'Mon', h: 2.5 }, { day: 'Tue', h: 3.8 }, { day: 'Wed', h: 1.5 },
  { day: 'Thu', h: 4.2 }, { day: 'Fri', h: 5.5 }, { day: 'Sat', h: 8.4 }, { day: 'Sun', h: 7.2 },
];

export default function DashboardCharts({ userSpec }) {
  const stats = [
    { title: 'Total Playtime', value: '1,248 hrs', icon: Clock, color: 'text-cyber-accent' },
    { title: 'Games Owned', value: '142', icon: Gamepad2, color: 'text-cyber-purple' },
    { title: 'Achievements', value: '854', icon: Trophy, color: 'text-cyber-warning' },
    { title: 'Active GPU', value: userSpec?.gpu_model?.split(' ').slice(-2).join(' ') || 'N/A', icon: Monitor, color: 'text-cyber-success' },
  ];

  const maxWeekly = Math.max(...weeklyData.map(d => d.h));
  const totalHours = playTimeData.reduce((s, g) => s + g.hours, 0);
  const maxPlaytime = Math.max(...playTimeData.map(g => g.hours));

  return (
    <div className="space-y-6">
      {/* ── Stats Cards (4-col) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-cyber-card rounded-xl p-5 border border-gray-800 shadow-lg hover:border-gray-700 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-xl font-bold text-gray-100 truncate" title={stat.value}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Weekly Activity Chart */}
        <div className="lg:col-span-2 bg-cyber-card rounded-xl border border-gray-800 shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-100">Playtime Activity</h2>
              <p className="text-sm text-gray-400">Hours played in the last 7 days</p>
            </div>
            <span className="flex items-center text-cyber-success bg-cyber-success/10 px-2 py-1 rounded-md text-sm">
              <TrendingUp className="w-4 h-4 mr-1" /> +12%
            </span>
          </div>

          {/* Simple Bar Chart (no external lib needed) */}
          <div className="flex items-end justify-between gap-3 h-48 pt-4">
            {weeklyData.map((d) => (
              <div key={d.day} className="flex flex-col items-center flex-1 gap-2">
                <div className="w-full flex items-end justify-center" style={{ height: '100%' }}>
                  <div
                    className="w-full max-w-[40px] bg-cyber-accent/20 hover:bg-cyber-accent/40 rounded-t-md transition-all duration-300 relative group"
                    style={{ height: `${(d.h / maxWeekly) * 100}%` }}
                  >
                    <div
                      className="absolute bottom-0 w-full bg-cyber-accent rounded-t-md transition-all duration-500"
                      style={{ height: '60%' }}
                    />
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.h}h
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500 font-medium">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Game Library */}
        <div className="bg-cyber-card rounded-xl border border-gray-800 shadow-lg flex flex-col overflow-hidden">
          <div className="p-5 border-b border-gray-800">
            <h2 className="text-lg font-bold text-gray-100 mb-1">Game Library</h2>
            <p className="text-xs text-gray-500">{playTimeData.length} games · {totalHours} total hours</p>
          </div>
          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {playTimeData.map((game) => (
              <div key={game.name} className="bg-cyber-darker p-3 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors group cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-gray-200 group-hover:text-cyber-accent transition-colors truncate">{game.name}</h3>
                  <span className="text-xs font-medium bg-gray-800 text-gray-300 px-2 py-1 rounded shrink-0">{game.hours} hrs</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${game.color} transition-all duration-700`} style={{ width: `${(game.hours / maxPlaytime) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
