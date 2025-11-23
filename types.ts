export enum MessageType {
  NORMAL = 'NORMAL',
  SPAM = 'SPAM',
  HATE = 'HATE',
  MOD = 'MOD',
  SUB = 'SUB'
}

export interface ChatMessage {
  id: string;
  username: string;
  content: string;
  type: MessageType;
  avatar: string;
  timestamp: Date;
  isMod: boolean;
}

export interface DiscordAlert {
  id: string;
  channel: string;
  user: string;
  issue: string; // Message content
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'FLAVOR'; // FLAVOR = just chat
  resolved: boolean;
  type?: 'ALERT' | 'CHAT' | 'IMAGE';
}

export interface SocialPost {
  id: string;
  username: string;
  handle: string;
  content: string;
  likes: number;
  isNegative: boolean; // Needs "damage control"
  replied: boolean;
}

export interface ModTask {
  id: string;
  description: string;
  xpReward: number;
}

export interface GameStats {
  bans: number;
  timeouts: number;
  discordResolved: number;
  socialReplied: number;
  tasksCompleted: number;
  maxViewers: number;
  timeSurvived: number; // in seconds
}

export interface GameState {
  playerName: string;
  sanity: number; // Health 0-100
  hype: number; // Score multiplier / Health
  viewers: number;
  isPlaying: boolean;
  gameOver: boolean;
  level: number;
  score: number; // Current XP
  stats: GameStats;
}

export enum GameActionType {
  TIMEOUT_USER = 'TIMEOUT_USER',
  BAN_USER = 'BAN_USER',
  PIN_MESSAGE = 'PIN_MESSAGE',
  RESOLVE_DISCORD = 'RESOLVE_DISCORD',
  REPLY_SOCIAL = 'REPLY_SOCIAL',
  IGNORE_SOCIAL = 'IGNORE_SOCIAL'
}

export interface HighScore {
  name: string;
  score: number;
  level: number;
  date: string;
}