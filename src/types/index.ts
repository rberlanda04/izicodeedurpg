export type UserRole = 'ADMIN' | 'GAME_MASTER' | 'ADVENTURER';

export type ScrumRole = 'SCRUM_MASTER' | 'DEVELOPER' | 'MAKER' | 'PRODUCT_OWNER';

export type SkillTier = 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'SPECIALIST';

export type SDGGoal = '4.3' | '7.a' | '12.c' | '13.a';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isSecret?: boolean;
}

export interface UserProfile {
  uid: string;
  adventureName: string; // Codinome Público (LGPD)
  realName: string; // Restrito a Professores/Admin
  role: UserRole;
  level: number;
  xp: number;
  xpToNextLevel: number;
  izicoins: number;
  guildId?: string;
  guildRole?: ScrumRole;
  avatarConfig: {
    head: string;
    body: string;
    accessory: string;
    color: string;
  };
  unlockedSkills: string[];
  badges: Badge[];
  inventory: Array<{ itemId: string; name: string; qty: number; icon: string }>;
  unlockedCuriosities: string[];
  heroContractSigned: boolean;
}

export interface Guild {
  id: string;
  name: string;
  motto: string;
  emblemUrl: string;
  leaderId: string;
  leaderName: string;
  members: Array<{
    uid: string;
    name: string;
    role: ScrumRole;
    avatarHead: string;
  }>;
  score: number;
  canvaFigmaLink?: string;
}

export interface SkillNode {
  id: string;
  title: string;
  tier: SkillTier;
  category: 'LOGIC' | 'BLOCKS' | 'ELECTRONICS' | 'PROTOTYPING';
  prerequisites: string[];
  hardwareUnlocked?: string[];
  allowsResourceBooking?: boolean;
  description: string;
  icon: string;
  isSecretNode?: boolean;
  secretHint?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  tier: SkillTier;
  requiredSkills: string[];
  sdgGoals: SDGGoal[];
  xpReward: number;
  coinReward: number;
  hardwareRequired: string[];
  proposedByStudentId?: string;
  proposedByStudentName?: string;
  status: 'PROPOSED' | 'APPROVED' | 'ACTIVE' | 'COMPLETED';
  validationSteps: string[];
  isSecretQuest?: boolean;
  secretPasscode?: string;
}

export interface HardwareItem {
  id: string;
  name: string;
  category: 'STATIONERY' | 'TOOLS' | 'MICROCONTROLLER' | 'SENSOR' | 'ACTUATOR';
  stockQuantity: number;
  coinCost: number;
  icon: string;
  pinoutDiagramUrl?: string;
  troubleshootingGuide?: {
    overview: string;
    commonErrors: Array<{ error: string; solution: string }>;
    compatibleLibraries: string[];
    wiringDiagram: Array<{ pinFrom: string; pinTo: string; note: string }>;
  };
}

export interface CuriosityCard {
  id: string;
  code: string;
  title: string;
  category: 'MAKER_HISTORY' | 'CYBERPUNK' | 'PHYSICS_HACK' | 'AI_FUTURE';
  content: string;
  labLocation: string;
  xpReward: number;
  unlocked: boolean;
}

export interface BossRaidCampaign {
  id: string;
  title: string;
  isActive: boolean;
  bossName: string;
  bossMaxHp: number;
  bossCurrentHp: number;
  participatingGuildsCount: number;
  totalStudentsCount: number; // e.g. 350+
  concurrencyRps: number;
  timeRemainingSeconds: number;
  recentLogs: Array<{ id: string; text: string; time: string; guildName: string }>;
}

export interface QuickHackAlert {
  id: string;
  title: string;
  description: string;
  riddle: string;
  answerHash: string; // Plaintext secret code
  timeLimitSeconds: number;
  xpReward: number;
  active: boolean;
}

export interface ResourceBooking {
  id: string;
  machine: 'Impressora 3D' | 'Cortadora a Laser';
  studentName: string;
  guildName?: string;
  date: string; // ISO date, e.g. '2026-08-13'
  timeSlot: string; // e.g. '13:00-13:30'
}
