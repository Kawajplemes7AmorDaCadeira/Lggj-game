import React, { useState, useEffect, useCallback, useRef } from 'react';
import StatsHeader from './components/StatsHeader';
import ChatColumn from './components/ChatColumn';
import DiscordColumn from './components/DiscordColumn';
import SocialColumn from './components/SocialColumn';
import TaskBoard from './components/TaskBoard';
import { 
  GameState, 
  ChatMessage, 
  DiscordAlert, 
  SocialPost, 
  ModTask,
  GameActionType,
  MessageType,
  HighScore,
  GameStats
} from './types';
import { 
  INITIAL_SANITY, 
  INITIAL_HYPE, 
  INITIAL_VIEWERS, 
  GAME_TICK_MS,
  MODERATORS,
  XP_REWARDS,
  LEVEL_THRESHOLDS,
  POSSIBLE_TASKS,
  STORAGE_KEY_HIGHSCORE,
  DISCORD_FLAVOR_GERAL,
  DISCORD_FLAVOR_MEMES,
  SANITY_DRAIN_RATE
} from './constants';
import { fetchGameContent } from './services/geminiService';
import { Star, CheckCircle, AlertOctagon, ShieldCheck, Video, MessageCircle, Twitter, Play, Trophy, RotateCcw } from 'lucide-react';

interface Notification {
  id: string;
  text: string;
  color: string;
  icon?: React.ReactNode;
}

type AppId = 'STREAM' | 'DISCORD' | 'SOCIAL' | 'DESKTOP';

const App: React.FC = () => {
  // Game State
  const [gameState, setGameState] = useState<GameState>({
    playerName: '',
    sanity: INITIAL_SANITY,
    hype: INITIAL_HYPE,
    viewers: INITIAL_VIEWERS,
    isPlaying: false,
    gameOver: false,
    level: 1,
    score: 0,
    stats: {
      bans: 0,
      timeouts: 0,
      discordResolved: 0,
      socialReplied: 0,
      tasksCompleted: 0,
      maxViewers: INITIAL_VIEWERS,
      timeSurvived: 0
    }
  });

  const [inputName, setInputName] = useState('');
  const [highScore, setHighScore] = useState<HighScore | null>(null);

  // UI State
  const [activeApp, setActiveApp] = useState<AppId>('DESKTOP');
  
  // Entities State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [discordAlerts, setDiscordAlerts] = useState<DiscordAlert[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [modTasks, setModTasks] = useState<ModTask[]>([]);
  
  // Feedback System
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Content Buffer
  const contentBuffer = useRef<{
    chat: ChatMessage[],
    discord: DiscordAlert[],
    social: SocialPost[]
  }>({ chat: [], discord: [], social: [] });

  const isFetchingRef = useRef(false);

  // Load High Score on Mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY_HIGHSCORE);
    if (stored) {
      setHighScore(JSON.parse(stored));
    }
  }, []);

  // --- Helpers ---

  const triggerNotification = (text: string, color: string = 'text-yellow-400', icon?: React.ReactNode) => {
    const id = Date.now().toString() + Math.random();
    setNotifications(prev => [...prev, { id, text, color, icon }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 2000);
  };

  const getFlavorChannel = (channel: string) => {
    if (channel === 'memes') return DISCORD_FLAVOR_MEMES;
    return DISCORD_FLAVOR_GERAL;
  };

  // --- Game Mechanics ---
  const refillContent = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    const data = await fetchGameContent(gameState.hype);
    if (data) {
      const newChats = data.chatMessages.map((msg: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        username: msg.username,
        content: msg.content,
        type: msg.type as MessageType,
        isMod: MODERATORS.includes(msg.username) || msg.isMod,
        avatar: `https://picsum.photos/seed/${msg.username}/50`,
        timestamp: new Date()
      }));
      
      const newDiscord = data.discordAlerts.map((alert: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        channel: 'denuncias', // AI targets actual alerts
        user: alert.user,
        issue: alert.issue,
        severity: alert.severity,
        resolved: false
      }));

      // Add "Flavor" messages to buffer (Not from AI, to save cost/time and populate background channels)
      const flavorCount = 4;
      for (let i = 0; i < flavorCount; i++) {
        const isMeme = Math.random() > 0.5;
        const channel = isMeme ? 'memes' : 'geral';
        const list = getFlavorChannel(channel);
        const text = list[Math.floor(Math.random() * list.length)];
        
        newDiscord.push({
          id: Math.random().toString(36).substr(2, 9),
          channel: channel,
          user: `User_${Math.floor(Math.random() * 999)}`,
          issue: text,
          severity: 'FLAVOR',
          resolved: true,
          type: isMeme && Math.random() > 0.7 ? 'IMAGE' : 'CHAT'
        });
      }

      const newSocial = data.socialPosts.map((post: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        username: post.username,
        handle: post.handle || `@${post.username.replace(/\s/g, '')}`,
        content: post.content,
        likes: Math.floor(Math.random() * 500),
        isNegative: post.isNegative,
        replied: false
      }));
      contentBuffer.current.chat.push(...newChats);
      contentBuffer.current.discord.push(...newDiscord);
      contentBuffer.current.social.push(...newSocial);
    }
    isFetchingRef.current = false;
  }, [gameState.hype]);

  // Main Loop
  useEffect(() => {
    if (!gameState.isPlaying || gameState.gameOver) return;
    if (contentBuffer.current.chat.length === 0) refillContent();

    // The game gets faster as level increases.
    // Base 1800ms. Level 5 -> 1800 - (4 * 150) = 1200ms
    const speedModifier = Math.min(600, (gameState.level - 1) * 150);
    const tickRate = Math.max(800, GAME_TICK_MS - speedModifier);

    const interval = setInterval(() => {
      const nextChat = contentBuffer.current.chat.shift();
      const nextDiscord = Math.random() > 0.6 ? contentBuffer.current.discord.shift() : null; // Higher spawn rate
      const nextSocial = Math.random() > 0.7 ? contentBuffer.current.social.shift() : null;

      // 1. Process Chat
      if (nextChat) {
        setChatMessages(prev => [...prev.slice(-49), nextChat]);
        if (nextChat.type === MessageType.HATE) {
             setGameState(s => ({ ...s, sanity: Math.max(0, s.sanity - 3) })); // Harder hate damage
        }
      }

      // 2. Process Discord
      if (nextDiscord) {
        setDiscordAlerts(prev => {
          // Keep flavor messages from piling up too much
          const flavor = prev.filter(a => a.severity === 'FLAVOR').slice(-10);
          const alerts = prev.filter(a => a.severity !== 'FLAVOR');
          return [...alerts, ...flavor, nextDiscord];
        });
        
        if (nextDiscord.severity !== 'FLAVOR') {
          setGameState(s => ({ ...s, sanity: Math.max(0, s.sanity - 5) })); // Harder discord damage
        }
      }

      // 3. Process Social
      if (nextSocial) {
        setSocialPosts(prev => [nextSocial, ...prev]);
        if (nextSocial.isNegative) {
             setGameState(s => ({ ...s, sanity: Math.max(0, s.sanity - 2) }));
        }
      }

      // 4. Generate Tasks
      setModTasks(prev => {
        if (prev.length < 5 && Math.random() > 0.8) {
          const template = POSSIBLE_TASKS[Math.floor(Math.random() * POSSIBLE_TASKS.length)];
          return [...prev, { 
            id: Math.random().toString(36).substr(2, 9), 
            description: template.description, 
            xpReward: template.xp 
          }];
        }
        return prev;
      });

      // 5. Update Global Stats
      setGameState(prev => {
        // Difficulty scaling: Sanity drains naturally over time based on Level
        const levelDrain = Math.floor(prev.level * 0.5); 
        const activeIssues = discordAlerts.filter(a => a.severity !== 'FLAVOR').length;
        const totalDrain = SANITY_DRAIN_RATE + levelDrain + activeIssues;
        
        const newSanity = Math.max(0, prev.sanity - totalDrain);
        const viewerChange = Math.floor(Math.random() * 20) * (prev.hype > 50 ? 1 : -1);
        const newViewers = Math.max(0, prev.viewers + viewerChange);

        if (newSanity <= 0) {
          saveHighScore(prev);
          return { ...prev, sanity: 0, gameOver: true };
        }
        
        return { 
          ...prev, 
          sanity: newSanity, 
          viewers: newViewers,
          stats: {
             ...prev.stats,
             maxViewers: Math.max(prev.stats.maxViewers, newViewers),
             timeSurvived: prev.stats.timeSurvived + (tickRate / 1000)
          }
        };
      });

      if (contentBuffer.current.chat.length < 5) refillContent();
    }, tickRate);

    return () => clearInterval(interval);
  }, [gameState.isPlaying, gameState.gameOver, discordAlerts.length, refillContent, gameState.level]);

  const saveHighScore = (finalState: GameState) => {
    const newScore: HighScore = {
      name: finalState.playerName,
      score: finalState.score,
      level: finalState.level,
      date: new Date().toLocaleDateString()
    };
    
    // Simple check: is this better than stored?
    const stored = localStorage.getItem(STORAGE_KEY_HIGHSCORE);
    if (!stored || JSON.parse(stored).score < newScore.score) {
      localStorage.setItem(STORAGE_KEY_HIGHSCORE, JSON.stringify(newScore));
      setHighScore(newScore);
    }
  };

  const updateGameStateWithXP = (xpGain: number) => {
    setGameState(prev => {
      const newScore = prev.score + xpGain;
      const newLevel = LEVEL_THRESHOLDS.reduce((acc, curr) => newScore >= curr.minXp ? curr.level : acc, 1);
      
      if (newLevel > prev.level) {
        triggerNotification(`LEVEL UP! Nível ${newLevel}`, 'text-yellow-300', <Star className="text-yellow-500 fill-yellow-500"/>);
        // Sanity heal on level up
        return { ...prev, score: newScore, level: newLevel, sanity: Math.min(100, prev.sanity + 30) };
      }
      return { ...prev, score: newScore, level: newLevel };
    });
  };

  const handleAction = (action: GameActionType, itemId: string) => {
    let xpGain = 0;
    
    // Stats Update Helper
    const updateStats = (key: keyof GameStats) => {
      setGameState(s => ({
        ...s,
        stats: { ...s.stats, [key]: (s.stats[key] as number) + 1 }
      }));
    };

    if (action === GameActionType.TIMEOUT_USER) { xpGain = XP_REWARDS.TIMEOUT_USER; updateStats('timeouts'); }
    if (action === GameActionType.BAN_USER) { xpGain = XP_REWARDS.BAN_USER; updateStats('bans'); }
    if (action === GameActionType.PIN_MESSAGE) { xpGain = XP_REWARDS.PIN_MESSAGE; }
    if (action === GameActionType.RESOLVE_DISCORD) { xpGain = XP_REWARDS.RESOLVE_DISCORD; updateStats('discordResolved'); }
    if (action === GameActionType.REPLY_SOCIAL) { xpGain = XP_REWARDS.REPLY_SOCIAL; updateStats('socialReplied'); }
    if (action === GameActionType.IGNORE_SOCIAL) { xpGain = XP_REWARDS.IGNORE_SOCIAL; }

    // Trigger Notification
    let actionText = "";
    let actionColor = "text-white";
    let icon = undefined;
    switch (action) {
      case GameActionType.TIMEOUT_USER: actionText = "TIMEOUT"; actionColor = "text-yellow-400"; icon = <AlertOctagon size={16} />; break;
      case GameActionType.BAN_USER: actionText = "BANIDO"; actionColor = "text-red-500"; icon = <ShieldCheck size={16} />; break;
      case GameActionType.RESOLVE_DISCORD: actionText = "RESOLVIDO"; actionColor = "text-blue-400"; icon = <CheckCircle size={16} />; break;
      case GameActionType.REPLY_SOCIAL: actionText = "RESPONDIDO"; actionColor = "text-blue-300"; break;
      case GameActionType.PIN_MESSAGE: actionText = "FIXADO"; actionColor = "text-purple-400"; break;
      default: actionText = "AÇÃO";
    }
    triggerNotification(`${actionText}! +${xpGain} XP`, actionColor, icon);

    // Apply Logic
    switch (action) {
      case GameActionType.TIMEOUT_USER:
      case GameActionType.BAN_USER:
        setChatMessages(prev => prev.filter(m => m.id !== itemId));
        setGameState(s => ({ ...s, sanity: Math.min(100, s.sanity + 5) }));
        break;
      case GameActionType.PIN_MESSAGE:
        setGameState(s => ({ ...s, hype: Math.min(100, s.hype + 5) }));
        break;
      case GameActionType.RESOLVE_DISCORD:
        setDiscordAlerts(prev => prev.filter(a => a.id !== itemId));
        setGameState(s => ({ ...s, sanity: Math.min(100, s.sanity + 15) }));
        break;
      case GameActionType.REPLY_SOCIAL:
        setSocialPosts(prev => prev.filter(p => p.id !== itemId));
        setGameState(s => ({ ...s, hype: Math.min(100, s.hype + 5), sanity: Math.min(100, s.sanity + 5) }));
        break;
      case GameActionType.IGNORE_SOCIAL:
        setSocialPosts(prev => prev.filter(p => p.id !== itemId));
        break;
    }
    updateGameStateWithXP(xpGain);
  };

  const handleCompleteTask = (taskId: string) => {
    const task = modTasks.find(t => t.id === taskId);
    if (!task) return;
    setModTasks(prev => prev.filter(t => t.id !== taskId));
    setGameState(s => ({ 
      ...s, 
      hype: Math.min(100, s.hype + 5), 
      sanity: Math.min(100, s.sanity + 10),
      stats: { ...s.stats, tasksCompleted: s.stats.tasksCompleted + 1 }
    }));
    triggerNotification(`TAREFA! +${task.xpReward} XP`, "text-green-400", <CheckCircle size={16} />);
    updateGameStateWithXP(task.xpReward);
  };

  const startGame = () => {
    if (!inputName.trim()) return;
    setGameState(prev => ({ ...prev, playerName: inputName, isPlaying: true }));
    // Force reset for restart
    if (gameState.gameOver) {
      setGameState({
        playerName: inputName,
        sanity: INITIAL_SANITY,
        hype: INITIAL_HYPE,
        viewers: INITIAL_VIEWERS,
        isPlaying: true,
        gameOver: false,
        level: 1,
        score: 0,
        stats: {
          bans: 0,
          timeouts: 0,
          discordResolved: 0,
          socialReplied: 0,
          tasksCompleted: 0,
          maxViewers: INITIAL_VIEWERS,
          timeSurvived: 0
        }
      });
      setChatMessages([]);
      setDiscordAlerts([]);
      setSocialPosts([]);
      setModTasks([]);
    }
  };

  // --- Render ---

  // 1. Start Screen
  if (!gameState.isPlaying && !gameState.gameOver) {
    return (
       <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700 text-center">
          <div className="w-20 h-20 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-purple-500/50">
            LG
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Simulador de Mod LGGJ</h1>
          <p className="text-gray-400 mb-6 text-sm">
            Modere o chat, o Discord e o Twitter. Seja rápido. O caos não espera.
          </p>

          <div className="mb-6 text-left">
             <label className="block text-gray-400 text-xs font-bold mb-2 uppercase">Seu Nome de Mod</label>
             <input 
               type="text"
               maxLength={15}
               value={inputName}
               onChange={(e) => setInputName(e.target.value)}
               placeholder="Digite seu nick..."
               className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white focus:border-purple-500 focus:outline-none font-mono"
               onKeyDown={(e) => e.key === 'Enter' && startGame()}
             />
          </div>

          <button 
            onClick={startGame}
            disabled={!inputName.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            <Play size={20} />
            INICIAR TURNO
          </button>

          {highScore && (
            <div className="mt-8 pt-6 border-t border-gray-700">
               <div className="flex items-center justify-between text-yellow-500 mb-2">
                 <span className="flex items-center gap-2 font-bold"><Trophy size={16} /> Recorde Atual</span>
                 <span className="text-sm opacity-70">{highScore.date}</span>
               </div>
               <div className="bg-gray-900 rounded p-3 flex justify-between items-center">
                  <span className="text-white font-bold">{highScore.name}</span>
                  <div className="text-right">
                     <div className="text-yellow-400 font-mono font-bold text-lg">{highScore.score.toLocaleString()} XP</div>
                     <div className="text-xs text-gray-500">Nível {highScore.level}</div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. Game Over Screen
  if (gameState.gameOver) {
     const stats = gameState.stats;
     const isNewRecord = highScore && gameState.score >= highScore.score;

     return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 font-mono">
        <div className="max-w-lg w-full">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-black text-red-600 mb-2 tracking-tighter animate-pulse">GAME OVER</h1>
            <p className="text-xl text-gray-400">A sanidade da live chegou a zero.</p>
          </div>

          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden shadow-2xl">
             <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
                <span className="font-bold text-white text-lg">Relatório de Turno: {gameState.playerName}</span>
                {isNewRecord && <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded animate-bounce">NOVO RECORDE!</span>}
             </div>
             
             <div className="p-6 grid grid-cols-2 gap-6">
                <div className="col-span-2 text-center border-b border-gray-800 pb-6">
                   <div className="text-sm text-gray-500 uppercase tracking-widest mb-1">Pontuação Final</div>
                   <div className="text-5xl font-bold text-white mb-2">{gameState.score.toLocaleString()} XP</div>
                   <div className="text-yellow-500 font-bold">Nível Alcançado: {gameState.level}</div>
                </div>

                <div className="space-y-4">
                   <StatRow label="Bans Aplicados" value={stats.bans} color="text-red-400" />
                   <StatRow label="Timeouts" value={stats.timeouts} color="text-yellow-400" />
                   <StatRow label="Casos Discord" value={stats.discordResolved} color="text-blue-400" />
                </div>
                <div className="space-y-4">
                   <StatRow label="Tweets Respondidos" value={stats.socialReplied} color="text-sky-400" />
                   <StatRow label="Tarefas Concluídas" value={stats.tasksCompleted} color="text-green-400" />
                   <StatRow label="Tempo Sobrevivido" value={`${Math.floor(stats.timeSurvived)}s`} color="text-gray-400" />
                </div>
             </div>
             
             <div className="bg-gray-800 p-4 text-center">
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-white hover:bg-gray-200 text-black font-bold py-3 px-8 rounded flex items-center gap-2 mx-auto transition-colors"
                >
                  <RotateCcw size={18} />
                  TENTAR NOVAMENTE
                </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Main Gameplay Desktop
  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden font-sans relative select-none">
      <StatsHeader state={gameState} />
      
      {/* Desktop Background Area */}
      <div 
        className="flex-1 relative bg-cover bg-center overflow-hidden flex items-center justify-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')" }}
        onClick={() => setActiveApp('DESKTOP')}
      >
         <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>

         {/* Task Widget */}
         <div className={`absolute top-8 right-8 w-72 transition-all duration-500 transform z-10 ${activeApp === 'DESKTOP' ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0 pointer-events-none'}`}>
            <TaskBoard tasks={modTasks} onComplete={handleCompleteTask} />
         </div>

         {/* Application Window */}
         {activeApp !== 'DESKTOP' && (
           <div 
              className="relative w-[95%] h-[90%] max-w-7xl shadow-2xl rounded-lg overflow-hidden animate-zoom-in z-20"
              onClick={(e) => e.stopPropagation()}
           >
              {activeApp === 'STREAM' && <ChatColumn messages={chatMessages} viewers={gameState.viewers} onAction={handleAction} />}
              {activeApp === 'DISCORD' && <DiscordColumn alerts={discordAlerts} onAction={handleAction} />}
              {activeApp === 'SOCIAL' && <SocialColumn posts={socialPosts} onAction={handleAction} />}
           </div>
         )}
      </div>

      {/* Dock */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center gap-3 shadow-2xl z-50 h-20 px-6">
         <DockItem 
           active={activeApp === 'STREAM'} 
           onClick={() => setActiveApp(prev => prev === 'STREAM' ? 'DESKTOP' : 'STREAM')}
           color="bg-purple-600"
           icon={<Video size={28} className="text-white" />}
           label="Live Manager"
         />

         <DockItem 
           active={activeApp === 'DISCORD'} 
           onClick={() => setActiveApp(prev => prev === 'DISCORD' ? 'DESKTOP' : 'DISCORD')}
           color="bg-[#5865F2]"
           icon={<MessageCircle size={28} className="text-white" />}
           label="Discord"
           notificationCount={discordAlerts.filter(a => a.severity !== 'FLAVOR' && !a.resolved).length}
         />

         <DockItem 
           active={activeApp === 'SOCIAL'} 
           onClick={() => setActiveApp(prev => prev === 'SOCIAL' ? 'DESKTOP' : 'SOCIAL')}
           color="bg-black border border-gray-700"
           icon={<Twitter size={28} className="text-white" />}
           label="X"
           notificationCount={socialPosts.filter(p => p.isNegative).length}
         />

         <div className="w-[1px] h-10 bg-white/10 mx-1"></div>

         <DockItem 
           active={activeApp === 'DESKTOP'} 
           onClick={() => setActiveApp('DESKTOP')}
           color="bg-yellow-400"
           icon={<ShieldCheck size={28} className="text-yellow-900" />}
           label="Tarefas"
           notificationCount={modTasks.length}
         />
      </div>

      {/* Notifications Overlay */}
      <div className="fixed top-16 right-4 z-[100] flex flex-col gap-2 items-end pointer-events-none">
        {notifications.map(n => (
          <div 
            key={n.id} 
            className="bg-gray-900/95 backdrop-blur-md border-l-4 border-yellow-400 px-4 py-3 rounded shadow-xl flex items-center gap-3 animate-slide-in transform transition-all duration-300 min-w-[200px]"
          >
            {n.icon}
            <span className={`font-bold text-sm ${n.color}`}>{n.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatRow = ({ label, value, color }: { label: string, value: string | number, color: string }) => (
  <div className="flex justify-between items-center border-b border-gray-800 pb-1 last:border-0">
     <span className="text-gray-400 text-sm">{label}</span>
     <span className={`font-bold ${color}`}>{value}</span>
  </div>
);

const DockItem: React.FC<{
  active: boolean;
  onClick: () => void;
  color: string;
  icon: React.ReactNode;
  label: string;
  notificationCount?: number;
}> = ({ active, onClick, color, icon, label, notificationCount = 0 }) => {
  return (
    <div className="group relative flex flex-col items-center gap-1">
       <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs py-1 px-3 rounded pointer-events-none whitespace-nowrap border border-gray-700">
         {label}
       </div>
       <button 
         onClick={onClick}
         className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:scale-110 ${color} ${active ? 'ring-2 ring-white/50 ring-offset-2 ring-offset-transparent' : 'opacity-90 hover:opacity-100'}`}
       >
         {icon}
         {notificationCount > 0 && (
           <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-gray-900 animate-bounce">
             {notificationCount}
           </div>
         )}
       </button>
       <div className={`w-1 h-1 rounded-full bg-white transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
};

export default App;