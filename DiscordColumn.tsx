import React, { useState } from 'react';
import { DiscordAlert, GameActionType } from '../types';
import { Hash, Volume2, Bell, CheckCircle, Headphones, Plus, Monitor, Menu, X, Mic, Settings as SettingsIcon, Image as ImageIcon } from 'lucide-react';
import { CHANNELS } from '../constants';

interface Props {
  alerts: DiscordAlert[];
  onAction: (action: GameActionType, itemId: string) => void;
}

const DiscordColumn: React.FC<Props> = ({ alerts, onAction }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState('#denuncias');

  // Filter messages based on active channel
  const currentMessages = alerts.filter(a => {
    if (activeChannel === '#denuncias') return a.channel === 'denuncias' || a.severity !== 'FLAVOR';
    return a.channel === activeChannel.replace('#', '');
  });

  return (
    <div className="flex h-full bg-[#313338] text-gray-300 overflow-hidden shadow-2xl rounded-lg border border-[#1e1f22] relative font-sans">
      
      {/* 1. Server List (Leftmost Sidebar) - Hidden on Mobile */}
      <div className="hidden md:flex w-[72px] bg-[#1e1f22] flex-col items-center py-3 space-y-2 flex-shrink-0 overflow-y-auto no-scrollbar">
        {/* DM Icon */}
        <div className="w-12 h-12 bg-[#313338] hover:bg-[#5865F2] hover:text-white rounded-[24px] hover:rounded-[16px] transition-all duration-200 flex items-center justify-center cursor-pointer group mb-2">
           <div className="bg-[#5865F2] text-white p-1 rounded-sm">
             <div className="w-6 h-4 bg-transparent border-2 border-white rounded-sm" />
           </div>
        </div>
        
        <div className="w-8 h-[2px] bg-[#35363C] rounded-lg" />

        {/* Active Server (LGGJ) */}
        <div className="relative w-full flex justify-center group">
           <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-white rounded-r-lg" />
           <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-[16px] flex items-center justify-center font-bold shadow-md cursor-pointer">
             LG
           </div>
        </div>

        {/* Other Fake Servers */}
        {[1, 2, 3].map(i => (
          <div key={i} className="w-12 h-12 bg-[#313338] hover:bg-[#5865F2] hover:text-white rounded-[24px] hover:rounded-[16px] transition-all duration-200 flex items-center justify-center cursor-pointer text-xs font-bold text-gray-400 group">
             S{i}
          </div>
        ))}
      </div>

      {/* 2. Channel List (Sidebar) - Responsive Overlay on Mobile */}
      <div className={`
        absolute inset-y-0 left-0 z-30 bg-[#2b2d31] w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-col md:flex-shrink-0 border-r border-[#1f2023] shadow-2xl md:shadow-none
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile Header for Sidebar */}
        <div className="h-12 border-b border-[#1f2023] px-4 flex items-center justify-between font-bold text-white shadow-sm md:hidden">
           <span>Navegação</span>
           <button onClick={() => setMobileMenuOpen(false)}>
             <X size={20} className="text-gray-400" />
           </button>
        </div>

        {/* Server Header (Desktop) */}
        <div className="h-12 border-b border-[#1f2023] px-4 hidden md:flex items-center justify-between font-bold text-white hover:bg-[#35373c] cursor-pointer transition-colors shadow-sm">
           <span>LGGJ Community</span>
           <Plus size={16} className="text-gray-400" />
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
           
           <div className="flex items-center justify-between px-2 pt-4 pb-1 group cursor-pointer hover:text-gray-100">
              <span className="text-xs font-bold uppercase text-gray-400 group-hover:text-gray-300">Canais de Texto</span>
              <Plus size={12} className="text-gray-400" />
           </div>
           
           {CHANNELS.map(ch => {
             const isAlertChannel = ch === '#denuncias';
             const alertCount = alerts.filter(a => a.channel === 'denuncias' && !a.resolved && isAlertChannel).length;
             
             return (
               <div 
                  key={ch} 
                  onClick={() => {
                    setActiveChannel(ch);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded mx-1 cursor-pointer group transition-colors
                    ${activeChannel === ch ? 'bg-[#404249] text-white' : 'hover:bg-[#35373c] text-gray-400 hover:text-gray-200'}
                  `}
               >
                 <Hash size={20} className="text-gray-500" />
                 <span className="font-medium truncate text-sm flex-1">{ch.replace('#', '')}</span>
                 {isAlertChannel && alertCount > 0 && (
                   <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                     {alertCount}
                   </span>
                 )}
               </div>
             );
           })}

           <div className="flex items-center justify-between px-2 pt-4 pb-1 mt-2 group cursor-pointer hover:text-gray-100">
              <span className="text-xs font-bold uppercase text-gray-400 group-hover:text-gray-300">Canais de Voz</span>
              <Plus size={12} className="text-gray-400" />
           </div>
           
           <div className="flex flex-col gap-0.5 px-1">
             <div className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-[#35373c] text-gray-400 hover:text-gray-200 cursor-pointer">
                <Volume2 size={20} className="text-gray-500" />
                <span className="font-medium text-sm">Geral</span>
             </div>
           </div>
        </div>

        {/* User Status Footer */}
        <div className="bg-[#232428] p-2 flex items-center gap-2">
           <div className="relative">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500" />
             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#232428]" />
           </div>
           <div className="flex-1 overflow-hidden">
              <div className="text-xs font-bold text-white truncate">Mod_LGGJ</div>
              <div className="text-[10px] text-gray-400 truncate">Online</div>
           </div>
           <div className="flex gap-1">
              <Mic size={18} className="text-gray-400 hover:text-gray-200 cursor-pointer" />
              <Headphones size={18} className="text-gray-400 hover:text-gray-200 cursor-pointer" />
              <SettingsIcon size={18} className="text-gray-400 hover:text-gray-200 cursor-pointer" />
           </div>
        </div>
      </div>

      {/* Backdrop for Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          className="absolute inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* 3. Main Content (Chat Area) */}
      <div className="flex-1 flex flex-col bg-[#313338] min-w-0 w-full">
        {/* Channel Header */}
        <div className="h-12 border-b border-[#26272d] flex items-center justify-between px-4 flex-shrink-0 shadow-sm bg-[#313338] z-10">
           <div className="flex items-center gap-2 text-white font-bold overflow-hidden">
              <button 
                className="md:hidden mr-1 p-1 hover:bg-gray-700 rounded text-gray-300"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={24} />
              </button>

              <Hash size={24} className="text-gray-400 flex-shrink-0" />
              <h3 className="truncate">{activeChannel.replace('#', '')}</h3>
              <div className="hidden sm:block h-4 w-[1px] bg-gray-600 mx-1" />
              <span className="hidden sm:block text-xs font-normal text-gray-400 truncate">
                {activeChannel === '#denuncias' ? 'Canal exclusivo para tretas e reportes' : 'Chat geral da comunidade'}
              </span>
           </div>
           <div className="flex items-center gap-2 md:gap-4 text-gray-400">
              <Bell size={20} className="hover:text-gray-200 cursor-pointer hidden sm:block" />
              <div className="relative hidden sm:block">
                 <input type="text" placeholder="Buscar" className="bg-[#1e1f22] text-xs rounded px-2 py-1 w-24 md:w-32 transition-all focus:w-48 outline-none text-gray-200" />
              </div>
           </div>
        </div>

        {/* Messages / Alerts Area */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 custom-scrollbar flex flex-col gap-1">
           
           {currentMessages.length === 0 && (
             <div className="flex flex-col items-center justify-center h-full opacity-50 select-none text-center">
                <Hash size={48} className="text-gray-600 mb-4" />
                <h3 className="text-gray-400 font-medium text-lg">Nada por aqui.</h3>
                <p className="text-gray-500 text-sm mt-1">O canal {activeChannel} está silencioso.</p>
             </div>
           )}

           {currentMessages.map(alert => (
             <div 
                key={alert.id} 
                className={`group flex gap-3 sm:gap-4 hover:bg-[#2e3035] -mx-4 px-4 py-2 transition-colors ${alert.severity !== 'FLAVOR' ? 'bg-[#36393e]/50 mt-2 mb-2 py-4' : ''}`}
             >
                <div className="w-10 h-10 rounded-full bg-gray-600 flex-shrink-0 overflow-hidden cursor-pointer mt-0.5">
                  <img src={`https://picsum.photos/seed/${alert.user}/40`} alt="avatar" />
                </div>
                
                <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-2">
                      <span className={`font-medium hover:underline cursor-pointer ${alert.severity === 'HIGH' ? 'text-red-400' : 'text-white'}`}>
                        {alert.user}
                      </span>
                      {alert.severity !== 'FLAVOR' && (
                        <span className="text-[10px] text-white bg-[#5865F2] px-1 rounded flex items-center gap-0.5">BOT</span>
                      )}
                      <span className="text-xs text-gray-400">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                   </div>
                   
                   {/* CONTENT */}
                   {alert.severity === 'FLAVOR' ? (
                     <div className="text-gray-300 text-sm md:text-base">
                        {alert.type === 'IMAGE' ? (
                          <div className="mt-1 max-w-[200px] h-32 bg-gray-800 rounded flex items-center justify-center text-gray-600 border border-gray-700">
                             <ImageIcon size={24} />
                             <span className="ml-2 text-xs">Imagem</span>
                          </div>
                        ) : (
                          alert.issue
                        )}
                     </div>
                   ) : (
                     // ACTIONABLE ALERT
                     <div className={`mt-1 p-3 rounded border-l-4 bg-[#2b2d31] ${
                       alert.severity === 'HIGH' ? 'border-red-500' : 
                       alert.severity === 'MEDIUM' ? 'border-yellow-500' : 'border-blue-500'
                     }`}>
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                             alert.severity === 'HIGH' ? 'bg-red-500/20 text-red-400' : 
                             alert.severity === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {alert.severity === 'HIGH' ? 'CRÍTICO' : 'ALERTA'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-200 font-medium mb-3">{alert.issue}</p>
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={() => onAction(GameActionType.RESOLVE_DISCORD, alert.id)}
                            className="bg-[#5865F2] hover:bg-[#4752c4] text-white px-3 py-1.5 rounded text-xs font-bold transition-colors shadow-sm"
                          >
                             Resolver
                          </button>
                        </div>
                     </div>
                   )}
                </div>
             </div>
           ))}
           <div className="h-4" />
        </div>

        {/* Chat Input */}
        <div className="px-4 pb-4 bg-[#313338]">
           <div className="bg-[#383a40] rounded-lg px-4 py-3 flex items-center gap-4">
              <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center cursor-pointer hover:text-white text-[#313338] flex-shrink-0">
                 <Plus size={16} />
              </div>
              <input 
                disabled 
                placeholder={`Conversar em #${activeChannel.replace('#', '')}`} 
                className="bg-transparent flex-1 outline-none text-gray-300 placeholder-gray-500 text-sm cursor-not-allowed" 
              />
           </div>
        </div>
      </div>
    </div>
  );
};

export default DiscordColumn;