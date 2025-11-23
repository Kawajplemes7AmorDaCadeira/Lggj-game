import React from 'react';
import { GameState } from '../types';
import { Activity, Users, Zap, AlertTriangle, Trophy, Wifi } from 'lucide-react';
import { LEVEL_THRESHOLDS } from '../constants';

interface Props {
  state: GameState;
}

const StatsHeader: React.FC<Props> = ({ state }) => {
  // Calculate Level Progress
  const currentLevelInfo = LEVEL_THRESHOLDS.find(l => l.level === state.level) || LEVEL_THRESHOLDS[0];
  const nextLevelInfo = LEVEL_THRESHOLDS.find(l => l.level === state.level + 1);
  
  let progressPercent = 100;
  if (nextLevelInfo) {
    const totalLevelXp = nextLevelInfo.minXp - currentLevelInfo.minXp;
    const currentXpInLevel = state.score - currentLevelInfo.minXp;
    progressPercent = Math.min(100, Math.max(0, (currentXpInLevel / totalLevelXp) * 100));
  }

  return (
    <div className="bg-gray-900/90 backdrop-blur-md border-b border-gray-800 h-10 flex items-center justify-between px-4 select-none z-50">
      
      {/* Left: System Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 cursor-pointer shadow-sm" />
           <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 cursor-pointer shadow-sm" />
           <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 cursor-pointer shadow-sm" />
        </div>
        <div className="h-4 w-[1px] bg-gray-700 mx-1" />
        <span className="text-xs font-bold text-gray-300 tracking-wide">LGGJ OS v2.0</span>
      </div>

      {/* Center: Game Stats */}
      <div className="flex items-center gap-6">
          {/* Sanity */}
          <div className="flex items-center gap-2 group relative">
            <Activity size={14} className={state.sanity < 30 ? "text-red-500 animate-pulse" : "text-green-400"} />
            <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
              <div 
                className={`h-full transition-all duration-500 ${state.sanity < 30 ? "bg-red-500" : "bg-green-500"}`}
                style={{ width: `${state.sanity}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-gray-400 absolute -bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Sanidade</span>
          </div>

          {/* Hype */}
          <div className="flex items-center gap-2 group relative">
            <Zap size={14} className="text-purple-400" />
            <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-purple-300 transition-all duration-500"
                style={{ width: `${state.hype}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-gray-400 absolute -bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Hype</span>
          </div>
      </div>

      {/* Right: Level & Time */}
      <div className="flex items-center gap-4">
        
        <div className="flex flex-col items-end group">
           <div className="flex items-center gap-1.5 text-xs text-yellow-400 font-bold">
              <span>LVL {state.level}</span>
              <Trophy size={12} />
           </div>
           <div className="w-20 h-1 bg-gray-800 rounded-full mt-0.5">
              <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${progressPercent}%` }} />
           </div>
        </div>

        <div className="h-4 w-[1px] bg-gray-700" />

        <div className="flex items-center gap-2 text-gray-400">
          <Wifi size={14} />
          <span className="text-xs font-mono">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>

      </div>
    </div>
  );
};

export default StatsHeader;