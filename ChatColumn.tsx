import React, { useRef, useEffect } from 'react';
import { ChatMessage, MessageType, GameActionType } from '../types';
import { Shield, Ban, MessageSquare, Pin, Settings, Users, Video, Mic, Share2 } from 'lucide-react';

interface Props {
  messages: ChatMessage[];
  viewers: number;
  onAction: (action: GameActionType, itemId: string) => void;
}

const ChatColumn: React.FC<Props> = ({ messages, viewers, onAction }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getMessageStyle = (type: MessageType) => {
    switch (type) {
      case MessageType.MOD: return 'bg-green-500/10 border-l-2 border-green-500';
      case MessageType.HATE: return 'bg-red-500/10 border-l-2 border-red-500';
      case MessageType.SPAM: return 'bg-yellow-500/10 border-l-2 border-yellow-500 opacity-80';
      default: return 'hover:bg-white/5';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0e0e10] text-gray-100 overflow-hidden shadow-2xl rounded-lg border border-gray-800">
      
      {/* App Header (Fake Twitch Dashboard Header) */}
      <div className="h-12 bg-[#18181b] border-b border-gray-800 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-4">
           <h2 className="font-bold text-white flex items-center gap-2">
             <Video size={18} className="text-purple-500" />
             Gerenciador de Transmissão
           </h2>
           <div className="h-4 w-[1px] bg-gray-700" />
           <div className="flex items-center gap-2 text-red-500 animate-pulse">
             <div className="w-2 h-2 rounded-full bg-red-500" />
             <span className="text-xs font-bold uppercase">Ao Vivo</span>
           </div>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
           <div className="flex items-center gap-1.5">
             <Users size={14} />
             <span>{viewers.toLocaleString()}</span>
           </div>
           <div className="flex items-center gap-1.5">
             <Share2 size={14} />
             <span>01:45:22</span>
           </div>
           <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs font-bold transition-colors">
             Editar Info
           </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Stream Preview (Simulated) */}
        <div className="flex-1 bg-black relative hidden lg:flex flex-col">
           <div className="absolute inset-0 flex items-center justify-center">
             <div className="text-center opacity-30">
               <Video size={48} className="mx-auto mb-2" />
               <p className="font-mono text-sm">PRÉ-VISUALIZAÇÃO DE VÍDEO</p>
               <p className="text-xs text-gray-500">Qualidade da fonte: 1080p60</p>
             </div>
             {/* Simulated Animated Noise or Content Overlay */}
             <div className="absolute top-4 left-4 bg-red-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white">
               Live
             </div>
             <div className="absolute bottom-4 right-4 flex gap-2">
                <Mic size={16} className="text-white" />
             </div>
           </div>
           
           {/* Stream Stats Overlay */}
           <div className="mt-auto bg-[#18181b] p-4 border-t border-gray-800 z-10">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#26262c] p-2 rounded border border-gray-700">
                  <span className="text-[10px] text-gray-400 uppercase">Bitrate</span>
                  <div className="text-green-400 font-mono text-sm">6000 kbps</div>
                </div>
                <div className="bg-[#26262c] p-2 rounded border border-gray-700">
                  <span className="text-[10px] text-gray-400 uppercase">FPS</span>
                  <div className="text-white font-mono text-sm">60</div>
                </div>
                <div className="bg-[#26262c] p-2 rounded border border-gray-700">
                  <span className="text-[10px] text-gray-400 uppercase">Perda de Quadros</span>
                  <div className="text-white font-mono text-sm">0%</div>
                </div>
              </div>
           </div>
        </div>

        {/* Right: Chat Panel */}
        <div className="w-full lg:w-96 flex flex-col border-l border-gray-800 bg-[#18181b]">
          <div className="p-2 border-b border-gray-700 flex justify-between items-center">
             <span className="text-xs font-bold uppercase text-gray-400 flex items-center gap-1">
               <MessageSquare size={12} /> Chat da Stream
             </span>
             <Settings size={14} className="text-gray-400 cursor-pointer hover:text-white" />
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 relative font-sans">
            {messages.length === 0 && (
              <div className="text-center text-gray-600 mt-10 text-xs italic">Aguardando mensagens...</div>
            )}
            
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`group relative p-1.5 rounded text-sm leading-snug transition-colors ${getMessageStyle(msg.type)}`}
              >
                <div className="inline align-baseline">
                  {msg.isMod && <Shield size={10} className="inline mr-1 text-green-500 fill-green-500" />}
                  <span className={`font-bold mr-1.5 ${msg.isMod ? 'text-green-500' : 'text-[#a970ff]'}`}>
                    {msg.username}:
                  </span>
                  <span className="text-[#efeff1] break-words">
                    {msg.content}
                  </span>
                </div>

                {/* Hover Actions */}
                <div className="absolute right-1 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1 bg-[#0e0e10] shadow-sm rounded border border-gray-700 p-0.5 z-10">
                   {msg.type !== MessageType.MOD && (
                      <>
                        <button 
                          onClick={() => onAction(GameActionType.TIMEOUT_USER, msg.id)}
                          className="p-1 hover:bg-yellow-500/20 text-gray-400 hover:text-yellow-500 rounded"
                          title="Timeout"
                        >
                          <span className="text-[10px] font-bold">600s</span>
                        </button>
                        <button 
                          onClick={() => onAction(GameActionType.BAN_USER, msg.id)}
                          className="p-1 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded"
                          title="Banir"
                        >
                          <Ban size={12} />
                        </button>
                      </>
                   )}
                   <button 
                     onClick={() => onAction(GameActionType.PIN_MESSAGE, msg.id)}
                     className="p-1 hover:bg-blue-500/20 text-gray-400 hover:text-blue-500 rounded"
                     title="Fixar"
                   >
                     <Pin size={12} />
                   </button>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 bg-[#18181b] border-t border-gray-700">
            <div className="relative">
              <input 
                disabled
                type="text" 
                placeholder="Enviar mensagem..." 
                className="w-full bg-[#26262c] border border-gray-600 rounded px-3 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              <div className="absolute right-2 top-2 text-xs font-bold text-purple-500">CHAT</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatColumn;