export const MODERATORS = [
  "Rodrigues", 
  "ralf", 
  "Erick", 
  "Shhhbr", 
  "yune", 
  "Nishimura", 
  "hms", 
  "yumi", 
  "BrGirl", 
  "Kawajplemes7AmorDaCadeira", 
  "Marisco", 
  "Rubens"
];

export const CHANNELS = [
  "#denuncias",
  "#geral",
  "#memes",
  "#clips",
  "#off-topic"
];

export const INITIAL_SANITY = 100;
export const INITIAL_HYPE = 50;
export const INITIAL_VIEWERS = 1200;

// Faster pacing for arcade feel
export const GAME_TICK_MS = 1800; 
export const SANITY_DRAIN_RATE = 1; // Base drain per tick

export const STORAGE_KEY_HIGHSCORE = 'lggj_mod_highscore_v1';

export const XP_REWARDS = {
  TIMEOUT_USER: 50,
  BAN_USER: 100,
  PIN_MESSAGE: 25,
  RESOLVE_DISCORD: 150,
  REPLY_SOCIAL: 80,
  IGNORE_SOCIAL: 10
};

export const LEVEL_THRESHOLDS = [
  { level: 1, minXp: 0, title: "Novato do Chat" },
  { level: 2, minXp: 500, title: "Mod de Confiança" },
  { level: 3, minXp: 1500, title: "Xerife do Discord" },
  { level: 4, minXp: 3000, title: "Admin Supremo" },
  { level: 5, minXp: 5000, title: "Lenda do Chat" },
  { level: 6, minXp: 8000, title: "Deus da Moderação" },
  { level: 7, minXp: 12000, title: "A Entidade" }
];

export const POSSIBLE_TASKS = [
  { description: "Verificar logs de banimento", xp: 200 },
  { description: "Atualizar título da stream", xp: 150 },
  { description: "Criar comando !loja", xp: 180 },
  { description: "Limpar chat de bots", xp: 250 },
  { description: "Organizar clipe da semana", xp: 220 },
  { description: "Responder sussurros", xp: 120 },
  { description: "Configurar filtro de palavras", xp: 160 },
  { description: "Sortear VIP no chat", xp: 300 },
  { description: "Avisar sobre regras no #geral", xp: 100 },
  { description: "Trocar categoria da live", xp: 150 }
];

// Flavor text to populate background Discord channels without using AI tokens
export const DISCORD_FLAVOR_GERAL = [
  "Alguém viu a live de ontem?",
  "O LGGJ tá com cara de cansado hoje kkk",
  "Manda salve!",
  "Qual o jogo de hoje?",
  "Esse chat tá muito rápido",
  "Bom dia grupo",
  "Alguém me ajuda com o pc travando?",
  "Cadeira gamer faz diferença?",
  "Vou pedir ifood, o que recomendam?",
  "O áudio tá meio baixo ou é meu fone?"
];

export const DISCORD_FLAVOR_MEMES = [
  "Postando imagem engraçada...",
  "Olha esse clipe kkkkk",
  "LGGJ fora de contexto",
  "A cara dele quando perdeu KKKK",
  "Meme do dia",
  "React disso aqui pfv",
  "kkkkkkkk intankavel",
  "apaga que da tempo",
  "Absolute Cinema"
];