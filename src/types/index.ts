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
    imageUrl?: string; // avatar ilustrado (public/avatars/*.svg) — quando definido, algumas telas preferem esta imagem ao emoji de `head`
  };
  unlockedSkills: string[];
  badges: Badge[];
  inventory: Array<{ itemId: string; name: string; qty: number; icon: string }>;
  unlockedCuriosities: string[];
  completedWizards: string[];
  // ODS distintos entre as missões que ESTE aluno já validou — não dá pra
  // derivar isso de Quest.status === 'COMPLETED' porque o campo de "quem
  // validou" é limpo pelo servidor ao concluir (ver questValidationHandler.ts),
  // então o board da turma não guarda autoria de conclusão. Usado só para
  // conceder o badge "sdg-guardian".
  completedQuestSdgGoals: string[];
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
  status: 'PROPOSED' | 'APPROVED' | 'ACTIVE' | 'PENDING_VALIDATION' | 'COMPLETED';
  validationSteps: string[];
  isSecretQuest?: boolean;
  secretPasscode?: string;

  // Quem está com a missão em mãos, aguardando o professor validar
  // presencialmente — visível para a turma toda (não é segredo). O código
  // de validação em si NÃO fica aqui — vive em questValidations/{questId},
  // com leitura restrita ao Game Master/Admin, justamente para não vazar
  // pra quem lê o documento da quest.
  pendingValidationStudentUid?: string;
  pendingValidationStudentName?: string;

  // --- Campos vindos do catálogo real de projetos (izicode-landing) ---
  grade?: string; // série/ano recomendado, ex: "Ensino Fundamental II (8º e 9º ano)"
  duration?: string; // ex: "4 aulas"
  guideContent?: string; // tutorial completo em markdown (montagem, código, dicas)
  externalLink?: string; // ex: link do Hackster.io com o projeto de referência
  imageUrl?: string;
}

// questValidations/{questId} — código de validação presencial gerado
// quando um aluno aceita uma missão ACTIVE. Leitura restrita ao Game
// Master/Admin da turma (ver firestore.rules); o aluno nunca lê o campo
// `token` de volta, só digita o que o professor disser/mostrar.
export interface QuestValidation {
  questId: string;
  classId: string;
  schoolId: string;
  studentUid: string;
  studentName: string;
  token: string;
  xpReward: number;
  coinReward: number;
  createdAt: string;
}

export interface HardwareItem {
  id: string;
  name: string;
  category: 'STATIONERY' | 'TOOLS' | 'MICROCONTROLLER' | 'SENSOR' | 'ACTUATOR';
  stockQuantity: number;
  coinCost: number;
  icon: string;
  pinoutDiagramUrl?: string;
  tier?: SkillTier; // nível de projeto em que este material costuma entrar em cena
  linkedQuestIds?: string[]; // ids de Quest (QUESTS/QUEST_TEMPLATES) que usam este material
  troubleshootingGuide?: {
    overview: string;
    commonErrors: Array<{ error: string; solution: string }>;
    compatibleLibraries: string[];
    wiringDiagram: Array<{ pinFrom: string; pinTo: string; note: string }>;
  };
}

export interface SkillQuizQuestion {
  skillId: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface SequencePuzzle {
  id: string;
  icon: string;
  title: string;
  instruction: string;
  steps: string[]; // já na ORDEM correta — o componente embaralha para exibir
  xpReward: number;
  coinReward: number;
}

// As 5 famílias de material didático do Maker Lab. Diferente de HardwareItem
// ['STATIONERY' | 'TOOLS' | ...] (categorias de inventário físico), esta é a
// categoria de ESTUDO — por isso "Impressora 3D" existe como tema próprio
// aqui mesmo sem ser uma categoria de estoque separada.
export type WizardCategory = 'MICROCONTROLLER' | 'SENSOR' | 'ACTUATOR' | 'PRINTER_3D' | 'TOOLS';

export interface StudyWizardStep {
  title: string;
  content: string; // markdown curto (MiniMarkdown)
}

export interface StudyWizard {
  id: string;
  category: WizardCategory;
  title: string;
  icon: string;
  summary: string;
  xpReward: number;
  coinReward: number;
  steps: StudyWizardStep[];
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

// --- Módulo EcoGuardians: hackathon de justiça climática, cross-turma/escola ---
// Coleções próprias no nível raiz (não aninhadas em classes/schools) porque um
// evento reúne equipes de qualquer turma/escola — ver PLANO em
// C:\Users\rberl\.claude\plans\wild-enchanting-cat.md.

export type HackathonDisasterType = 'TSUNAMI' | 'DESLIZAMENTO' | 'ENCHENTE' | 'TORNADO';

export interface HackathonSchedulePhase {
  id: string;
  label: string;
  startTime: string; // 'HH:mm', hora local do evento
  endTime: string; // 'HH:mm'
}

export interface HackathonTestingWindow {
  start: string; // 'HH:mm'
  end: string; // 'HH:mm'
}

export interface HackathonEvent {
  id: string;
  name: string;
  date: string; // ISO date
  joinCode: string;
  staffIds: string[];
  schedule: HackathonSchedulePhase[];
  testingWindows: HackathonTestingWindow[];
  createdAt: string;
}

// Documento de lookup em hackathonEventCodes/{joinCode} — mesmo padrão de
// RoomPasscodeLookup: get-only, nunca listável, evita enumeração de códigos.
export interface HackathonEventCodeLookup {
  eventId: string;
}

export interface HackathonTeamMember {
  name: string;
  avatarHead: string;
  role: ScrumRole;
  joinedAt: string;
}

export interface HackathonTeamScores {
  engenharia?: number;
  equidade?: number;
  regeneracao?: number;
}

export interface HackathonTeam {
  id: string;
  eventId: string;
  name: string;
  questId?: string; // uma das 4 HackathonQuest fixas (src/data/hackathonQuests.ts)
  members: Record<string, HackathonTeamMember>; // uid -> membro, mesmo padrão de UserProfile.memberships
  scores: HackathonTeamScores;
  scoreNotes?: string;
  createdAt: string;
}

export type HackathonMentorRequestType = 'technical' | 'social' | 'pitch';
export type HackathonMentorRequestStatus = 'waiting' | 'claimed' | 'resolved';

export interface HackathonMentorRequest {
  id: string;
  eventId: string;
  teamId: string;
  teamName: string;
  type: HackathonMentorRequestType;
  status: HackathonMentorRequestStatus;
  claimedByUid?: string;
  claimedByName?: string;
  createdAt: string;
}

export type HackathonTestingSlotStatus = 'available' | 'booked' | 'completed';

export interface HackathonTestingSlot {
  id: string; // determinístico: `${eventId}__${station}__${timeSlot}`
  eventId: string;
  station: HackathonDisasterType;
  timeSlot: string; // 'HH:mm-HH:mm'
  teamId?: string;
  teamName?: string;
  status: HackathonTestingSlotStatus;
  outcome?: 'passed' | 'retry';
  staffNote?: string;
}

export interface HackathonCheckin {
  id: string;
  eventId: string;
  teamId: string;
  teamName: string;
  level: 1 | 2 | 3;
  checkpointLabel: string;
  createdAt: string;
}
