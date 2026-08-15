export type UserRole = 'ADMIN' | 'GAME_MASTER' | 'ADVENTURER';

export type ScrumRole = 'SCRUM_MASTER' | 'DEVELOPER' | 'MAKER' | 'PRODUCT_OWNER';

export type SkillTier = 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'SPECIALIST';

// Números reais dos ODS da ONU que aparecem no catálogo de projetos
// (src/data/projectCatalog.ts, importado de github.com/izicripto/izicode-landing).
export type SDGGoal = '2' | '3' | '4' | '9' | '11' | '12' | '13' | '16';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isSecret?: boolean;
}

export interface ClassMembership {
  guildId?: string;
  guildRole?: ScrumRole;
  joinedAt: string; // ISO timestamp
}

export interface UserProfile {
  uid: string;
  adventureName: string; // Codinome Público (LGPD)
  realName: string; // Restrito a Professores/Admin
  role: UserRole; // papel de fallback/exibição — a permissão real vem dos arrays abaixo
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

  // --- Multi-tenant (escolas/turmas) ---
  // Denormalizados de propósito: as regras do Firestore não conseguem
  // atravessar um mapa por valor, então precisam desses arrays diretos
  // para checar "este usuário é GM/aluno desta turma?" sem outra leitura.
  schoolAdminOf: string[]; // schoolIds onde é ADMIN
  schoolIds: string[]; // schoolIds de qualquer vínculo (admin, GM ou aluno)
  classIdsAsGameMaster: string[];
  classIdsAsStudent: string[];
  memberships: Record<string, ClassMembership>; // classId -> vínculo
}

export interface School {
  id: string;
  name: string;
  city: string;
  adminIds: string[];
}

export interface ClassRoom {
  id: string;
  schoolId: string;
  name: string; // "9º Ano B — Robótica 2026"
  gradeRange: string; // "6º ao 9º ano" | "Ensino Médio"
  gameMasterIds: string[];
  studentIds: string[];
  roomPasscode: string;
  createdAt: string;
  archivedAt: string | null;
}

// Documento de lookup em roomPasscodes/{code} — nunca listável nas regras,
// só "get" direto pelo código exato, para não permitir enumeração.
export interface RoomPasscodeLookup {
  classId: string;
  schoolId: string;
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
  category: 'LOGIC' | 'BLOCKS' | 'ELECTRONICS' | 'PROTOTYPING' | 'DESIGN';
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

  // --- Campos vindos do catálogo real de projetos (izicode-landing) ---
  grade?: string; // série/ano recomendado, ex: "Ensino Fundamental II (8º e 9º ano)"
  duration?: string; // ex: "4 aulas"
  guideContent?: string; // tutorial completo em markdown (montagem, código, dicas)
  externalLink?: string; // ex: link do Hackster.io com o projeto de referência
  imageUrl?: string;
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
