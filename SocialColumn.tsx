import React from 'react';
import { SocialPost, GameActionType } from '../types';
import { Twitter, Heart, MessageCircle, Repeat, Share, MoreHorizontal, Home, Hash, Bell, Mail, ShieldAlert } from 'lucide-react';

interface Props {
  posts: SocialPost[];
  onAction: (action: GameActionType, itemId: string) => void;
}

const SocialColumn: React.FC<Props> = ({ posts, onAction }) => {
  return (
    <div className="flex h-full bg-black text-white overflow-hidden shadow-2xl rounded-lg border border-gray-800 font-sans">
      
      {/* 1. Navigation Sidebar (Simplified) */}
      <div className="w-16 border-r border-gray-800 flex flex-col items-center py-4 space-y-6 flex-shrink-0 bg-black z-10">
         <div className="p-2 rounded-full hover:bg-gray-900 cursor-pointer">
            <Twitter size={28} className="text-white fill-white" />
         </div>
         <Home size={26} className="text-white cursor-pointer" />
         <Hash size={26} className="text-gray-500 cursor-pointer hover:text-white" />
         <Bell size={26} className="text-gray-500 cursor-pointer hover:text-white" />
         <Mail size={26} className="text-gray-500 cursor-pointer hover:text-white" />
      </div>

      {/* 2. Main Feed */}
      <div className="flex-1 flex flex-col min-w-0 bg-black">
         
         {/* Header */}
         <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-gray-800 px-4 py-3">
            <h2 className="font-bold text-lg">Página Inicial</h2>
         </div>

         {/* Tweets List */}
         <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
            {posts.length === 0 && (
               <div className="p-12 text-center text-gray-500">
                  Carregando feed...
               </div>
            )}
            
            {posts.map(post => (
               <div key={post.id} className={`p-4 border-b border-gray-800 hover:bg-[#080808] transition-colors cursor-pointer ${post.isNegative ? 'bg-red-900/10 border-l-2 border-l-red-500' : ''}`}>
                  <div className="flex gap-3">
                     <div className="w-10 h-10 rounded-full bg-gray-800 flex-shrink-0 overflow-hidden">
                        <img src={`https://picsum.photos/seed/${post.username}/50`} alt={post.username} className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-1 truncate">
                              <span className="font-bold text-white hover:underline text-[15px]">{post.username}</span>
                              <span className="text-gray-500 truncate text-[14px]">{post.handle}</span>
                              <span className="text-gray-500 text-[14px]">· 2m</span>
                           </div>
                           <MoreHorizontal size={16} className="text-gray-500" />
                        </div>
                        
                        <p className="text-gray-100 text-[15px] mt-0.5 whitespace-pre-wrap leading-snug">
                           {post.content}
                        </p>

                        {post.isNegative && (
                           <div className="mt-2 mb-1 inline-flex items-center gap-2 text-red-400 text-xs font-bold bg-red-500/10 px-2 py-1 rounded">
                              <ShieldAlert size={12} />
                              RISCO DE CANCELAMENTO
                           </div>
                        )}

                        <div className="flex items-center justify-between mt-2 text-gray-500 max-w-sm">
                           <div className="flex items-center gap-1 group hover:text-[#1d9bf0]">
                              <MessageCircle size={16} />
                              <span className="text-xs">23</span>
                           </div>
                           <div className="flex items-center gap-1 group hover:text-green-500">
                              <Repeat size={16} />
                              <span className="text-xs">12</span>
                           </div>
                           <div className="flex items-center gap-1 group hover:text-pink-600">
                              <Heart size={16} />
                              <span className="text-xs">{post.likes}</span>
                           </div>
                           <Share size={16} className="hover:text-[#1d9bf0]" />
                        </div>

                        {/* Mod Actions */}
                        <div className="mt-3 flex gap-2">
                           {post.isNegative ? (
                              <button 
                                 onClick={(e) => { e.stopPropagation(); onAction(GameActionType.REPLY_SOCIAL, post.id); }}
                                 className="flex-1 py-1 bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white text-sm font-bold rounded-full transition-colors"
                              >
                                 Contenção de Danos (+RP)
                              </button>
                           ) : (
                              <button 
                                 onClick={(e) => { e.stopPropagation(); onAction(GameActionType.IGNORE_SOCIAL, post.id); }}
                                 className="flex-1 py-1 border border-gray-600 hover:bg-gray-800 text-white text-sm font-bold rounded-full transition-colors"
                              >
                                 Curtir
                              </button>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default SocialColumn;