import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import type { User } from 'firebase/auth';
import {
  HARDWARE_CATALOG,
  CURIOSITY_CARDS,
  HACKATHON_CAMPAIGN,
  QUICK_HACK_ALERT,
  QUEST_TEMPLATES
} from '../data/mockData';
import { BADGE_DEFINITIONS } from '../data/badgeDefinitions';
import { SKILL_NODES } from '../data/mockData';
import { generateAIQuest } from '../services/questEngine';
import { generateQuestWithAI } from '../services/aiContentService';
import {
  subscribeToClassQuests,
  proposeQuest,
  createQuest,
  approveQuest as approveQuestFs,
  completeSecretQuest,
  acceptQuest as acceptQuestFs,
  cancelQuestAcceptance
} from '../services/questRepo';
import { submitValidationCode } from '../services/questValidationService';
import {
  requestSkillValidation,
  cancelSkillValidation,
  subscribeToClassSkillValidations,
  subscribeToMySkillValidation,
  subscribeToClassSkillCompletions
} from '../services/skillValidationRepo';
import { submitSkillValidationCode, completeSkillWithLink as completeSkillWithLinkApi } from '../services/skillValidationService';
import { subscribeToClassGuilds, createGuild, joinGuild } from '../services/guildRepo';
import {
  requestHardware,
  cancelHardwareRequest,
  subscribeToClassHardwareRequests,
  subscribeToMyHardwareRequests
} from '../services/hardwareRequestRepo';
import { resolveHardwareRequest as resolveHardwareRequestApi } from '../services/hardwareRequestService';
import { saveSkillProfileAnswers, deleteSkillProfileAnswers } from '../services/skillProfileRepo';
import {
  computeArchetype,
  SURVEY_VERSION,
  SKILL_SURVEY_XP_REWARD,
  SKILL_SURVEY_COIN_REWARD
} from '../data/skillProfileSurvey';
import { loadState, saveState, debounce, NAMESPACE } from '../services/persistence';
import { soundEngine } from '../services/soundEngine';
import { deleteField } from 'firebase/firestore';
import type { ApplyUserPatch } from './useApplyUserPatch';
import type {
  Guild,
  Quest,
  HardwareItem,
  CuriosityCard,
  BossRaidCampaign,
  QuickHackAlert,
  ResourceBooking,
  ScrumRole,
  SDGGoal,
  SkillValidation,
  SkillCompletion,
  ActiveChallenge,
  HardwareRequest,
  UserProfile
} from '../types';

function classKey(classId: string, name: string) {
  return `${NAMESPACE}:${classId}:${name}`;
}

/**
 * Per-class state for a turma. Guilds and quests are Firestore-backed
 * (subscribeToClassGuilds/subscribeToClassQuests) so they're actually
 * shared in real time between every student and the Game Master, not just
 * a fiction of whoever's browser happens to be open — this was the single
 * biggest gap in the app until this pass (student-proposed quests never
 * reached the GM, guild membership never reached classmates). Hardware
 * catalog, curiosities, the hackathon boss raid and quick-hacks remain
 * localStorage-only for now — a smaller, still-accepted "Fase 2" gap;
 * see PLANO_DESENVOLVIMENTO.md.
 *
 * `profile`/`applyUserPatch` come from Firestore (AuthContext) — anything
 * that changes XP, Izicoins, unlocked skills, badges or inventory goes
 * through `applyUserPatch`, never local state, because the user profile is
 * global across classes/years, not per-turma.
 */
export function useClassLocalState(
  classId: string,
  schoolId: string,
  profile: UserProfile,
  applyUserPatch: ApplyUserPatch,
  firebaseUser: User | null
) {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  // Amplo (toda a turma) — só realmente populado pra GM/Admin; para um
  // aluno comum a query é rejeitada pela regra e fica vazio em silêncio
  // (ver onError abaixo). Usado pelo Painel do Mestre.
  const [skillValidations, setSkillValidations] = useState<SkillValidation[]>([]);
  const [skillCompletions, setSkillCompletions] = useState<SkillCompletion[]>([]);
  // Escopado ao próprio aluno — este SIM funciona pra qualquer papel, é o
  // que a BattleScreen usa pra saber "eu tenho uma habilidade pendente?"
  // mesmo depois de recarregar a página.
  const [myPendingSkillValidation, setMyPendingSkillValidation] = useState<SkillValidation | null>(null);
  // Mesma dupla amplo/escopado dos pedidos de habilidade: hardwareRequests
  // só popula de verdade pra GM/Admin (Painel), myHardwareRequests funciona
  // pra qualquer papel e é o que o Maker Lab usa pra saber "já pedi este item?".
  const [hardwareRequests, setHardwareRequests] = useState<HardwareRequest[]>([]);
  const [myHardwareRequests, setMyHardwareRequests] = useState<HardwareRequest[]>([]);
  // Só populado quando um ganho de XP realmente cruza pro próximo nível —
  // ver maybeCelebrateLevelUp abaixo. Distingue esse momento de qualquer
  // outro ganho de XP rotineiro, que só toca soundEngine.playSuccess().
  const [levelUpInfo, setLevelUpInfo] = useState<{ level: number } | null>(null);
  // Passo intermediário entre "quiz do Desafio Relâmpago acertado" e
  // "pedido de validação realmente criado no Firestore" — o aluno ainda
  // precisa escolher entre link de projeto ou validação do professor. Só
  // local porque nada precisa ser travado/lido por mais ninguém nesse meio
  // tempo (ver ActiveChallenge em types/index.ts).
  const [pendingSkillChoice, setPendingSkillChoice] = useState<{
    skillId: string;
    skillTitle: string;
    xpReward: number;
    coinReward: number;
  } | null>(null);
  const [catalog] = useState<HardwareItem[]>(() => loadState(classKey(classId, 'catalog'), HARDWARE_CATALOG));
  const [curiosities, setCuriosities] = useState<CuriosityCard[]>(() =>
    loadState(classKey(classId, 'curiosities'), CURIOSITY_CARDS)
  );
  const [campaign, setCampaign] = useState<BossRaidCampaign>(() =>
    loadState(classKey(classId, 'campaign'), HACKATHON_CAMPAIGN)
  );
  const [quickHack, setQuickHack] = useState<QuickHackAlert>(() =>
    loadState(classKey(classId, 'quickHack'), QUICK_HACK_ALERT)
  );
  const [bookings, setBookings] = useState<ResourceBooking[]>(() =>
    loadState(classKey(classId, 'bookings'), [] as ResourceBooking[])
  );
  const [quickHackInput, setQuickHackInput] = useState('');

  useEffect(() => {
    if (!classId || classId === 'unknown') return;
    const unsubQuests = subscribeToClassQuests(classId, setQuests, (error) =>
      console.error('Falha ao carregar missões:', error)
    );
    const unsubGuilds = subscribeToClassGuilds(classId, setGuilds, (error) =>
      console.error('Falha ao carregar guildas:', error)
    );
    // As duas próximas retornam vazio (sem erro) para alunos comuns — a
    // leitura é rules-restrita a GM/Admin, então isso é esperado, não uma
    // falha real (é o Painel do Mestre que realmente usa esses dois).
    const unsubSkillValidations = subscribeToClassSkillValidations(classId, setSkillValidations, () => {});
    const unsubSkillCompletions = subscribeToClassSkillCompletions(classId, setSkillCompletions, () => {});
    // Este sim funciona pra qualquer papel — escopado ao próprio uid.
    const unsubMySkillValidation = subscribeToMySkillValidation(
      classId,
      profile.uid,
      (validations) => setMyPendingSkillValidation(validations[0] ?? null),
      (error) => console.error('Falha ao carregar validação de habilidade:', error)
    );
    const unsubHardwareRequests = subscribeToClassHardwareRequests(classId, setHardwareRequests, () => {});
    const unsubMyHardwareRequests = subscribeToMyHardwareRequests(
      classId,
      profile.uid,
      setMyHardwareRequests,
      (error) => console.error('Falha ao carregar pedidos de material:', error)
    );
    return () => {
      unsubQuests();
      unsubGuilds();
      unsubSkillValidations();
      unsubSkillCompletions();
      unsubMySkillValidation();
      unsubHardwareRequests();
      unsubMyHardwareRequests();
    };
  }, [classId, profile.uid]);

  const debouncedSaveRef = useRef(
    debounce(
      (state: {
        catalog: HardwareItem[];
        curiosities: CuriosityCard[];
        campaign: BossRaidCampaign;
        quickHack: QuickHackAlert;
        bookings: ResourceBooking[];
      }) => {
        saveState(classKey(classId, 'catalog'), state.catalog);
        saveState(classKey(classId, 'curiosities'), state.curiosities);
        saveState(classKey(classId, 'campaign'), state.campaign);
        saveState(classKey(classId, 'quickHack'), state.quickHack);
        saveState(classKey(classId, 'bookings'), state.bookings);
      },
      300
    )
  );

  useEffect(() => {
    debouncedSaveRef.current({ catalog, curiosities, campaign, quickHack, bookings });
  }, [catalog, curiosities, campaign, quickHack, bookings]);

  const triggerConfetti = () => confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

  /**
   * Só abre o LevelUpCelebration quando newLevel realmente supera o nível
   * anterior — nunca chamar de dentro do updater de applyUserPatch(fn), que
   * o Firestore pode re-executar em retry de transação e abriria a tela
   * mais de uma vez pra um único level-up real.
   */
  const maybeCelebrateLevelUp = (previousLevel: number, newLevel: number) => {
    if (newLevel > previousLevel) setLevelUpInfo({ level: newLevel });
  };
  const handleCloseLevelUp = () => setLevelUpInfo(null);

  const grantXpAndCoins = (xp: number, coins: number) => {
    // Prévia calculada fora da transação só pra decidir se comemora o
    // level-up — cosmético, então uma divergência rara por escrita
    // concorrente não tem consequência real (o valor gravado de verdade
    // continua vindo só do updater abaixo, que lê o current autoritativo).
    const previewLevel = profile.xp + xp >= profile.xpToNextLevel ? profile.level + 1 : profile.level;
    maybeCelebrateLevelUp(profile.level, previewLevel);
    applyUserPatch((current) => {
      const newXp = current.xp + xp;
      let newLevel = current.level;
      let nextLevelXp = current.xpToNextLevel;
      if (newXp >= nextLevelXp) {
        newLevel += 1;
        nextLevelXp += 1000;
      }
      return { xp: newXp, level: newLevel, xpToNextLevel: nextLevelXp, izicoins: current.izicoins + coins };
    });
  };

  /** Combo cosmético do quiz da Trilha — sem bônus de XP/moedas (o valor de cada nó já vem validado pelo servidor). */
  const handleQuizAnswered = (correct: boolean) => {
    if (!correct) {
      applyUserPatch({ quizStreak: 0 });
      return;
    }
    const nextStreak = (profile.quizStreak ?? 0) + 1;
    applyUserPatch({ quizStreak: nextStreak, bestQuizStreak: Math.max(nextStreak, profile.bestQuizStreak ?? 0) });
    if (nextStreak === 3) grantBadge('streak-3');
    if (nextStreak === 5) grantBadge('streak-5');
    if (nextStreak === 10) grantBadge('streak-10');
  };

  // Concede uma conquista do catálogo (idempotente — ignora se já possuída
  // ou se o id não existe). profile.badges existia no tipo desde sempre mas
  // nenhum fluxo do app o preenchia; este é o único lugar que escreve nele.
  const grantBadge = (badgeId: string) => {
    const definition = BADGE_DEFINITIONS.find((b) => b.id === badgeId);
    if (!definition) return;
    applyUserPatch((current) => {
      if (current.badges.some((b) => b.id === badgeId)) return {};
      return { badges: [...current.badges, { ...definition, unlockedAt: new Date().toISOString() }] };
    });
  };

  const handleSignContract = () => {
    soundEngine.playLevelUp();
    triggerConfetti();
    applyUserPatch((current) => ({
      heroContractSigned: true,
      xp: current.xp + 100,
      izicoins: current.izicoins + 50
    }));
  };

  const handleUpdateAvatar = (avatarConfig: UserProfile['avatarConfig']) => {
    applyUserPatch({ avatarConfig });
  };

  /**
   * O arquétipo não concede vantagem de jogo replicável (ao contrário de
   * XP de missão, que pode ser "farmado") — por isso essa gravação é
   * client-side direta via applyUserPatch, igual handleSignContract, sem
   * precisar de Cloud Function. As respostas cruas vão pra uma coleção
   * separada (skillProfileAnswers) — minimização de dado (LGPD), só o
   * resultado calculado entra no perfil.
   */
  const handleCompleteSkillSurvey = async (selections: Record<string, string>) => {
    const result = computeArchetype(selections);
    await saveSkillProfileAnswers(profile, selections);
    soundEngine.playLevelUp();
    triggerConfetti();
    applyUserPatch((current) => {
      const isFirstTime = !current.skillArchetype;
      const badgeDef = BADGE_DEFINITIONS.find((b) => b.id === 'self-aware');
      const alreadyHasBadge = current.badges.some((b) => b.id === 'self-aware');
      return {
        // Firestore rejeita um campo com valor `undefined` explícito (o SDK não
        // descarta silenciosamente) — por isso `secondary` só entra no objeto
        // quando existe, nunca como `secondary: undefined`.
        skillArchetype: {
          primary: result.primary,
          ...(result.secondary ? { secondary: result.secondary } : {}),
          completedAt: new Date().toISOString(),
          surveyVersion: SURVEY_VERSION
        },
        ...(isFirstTime
          ? { xp: current.xp + SKILL_SURVEY_XP_REWARD, izicoins: current.izicoins + SKILL_SURVEY_COIN_REWARD }
          : {}),
        ...(!alreadyHasBadge && badgeDef
          ? { badges: [...current.badges, { ...badgeDef, unlockedAt: new Date().toISOString() }] }
          : {})
      };
    });
  };

  const handleSkipSkillSurvey = () => {
    applyUserPatch({ skillProfileSkippedAt: new Date().toISOString() });
  };

  /** Direito de exclusão (LGPD): apaga as respostas cruas e o resultado calculado do perfil. */
  const handleDeleteSkillProfile = async () => {
    await deleteSkillProfileAnswers(profile.uid);
    // deleteField() é um FieldValue sentinel — não cabe no tipo Partial<UserProfile>
    // de ApplyUserPatch sem esse cast pontual, mas é o jeito correto (não `undefined`)
    // de remover um campo via updateDoc.
    applyUserPatch({ skillArchetype: deleteField() } as unknown as Partial<UserProfile>);
  };

  const handleJoinGuild = (guildId: string, role: ScrumRole) => {
    applyUserPatch({ guildId, guildRole: role });
    void joinGuild(guildId, profile.uid, profile.adventureName, role, profile.avatarConfig.head);
  };

  const handleCreateGuild = async (name: string, motto: string, canvaLink: string) => {
    const newGuild = await createGuild(
      classId,
      schoolId,
      name,
      motto,
      canvaLink,
      profile.uid,
      profile.adventureName,
      profile.avatarConfig.head
    );
    applyUserPatch({ guildId: newGuild.id, guildRole: 'SCRUM_MASTER' });
    grantBadge('scrum-leader');
  };

  const ROBOTICS_SKILL_IDS = ['lego_wedo', 'lego_ev3', 'microbit_starter'];
  const SKILL_XP_REWARD = 200;
  const SKILL_COIN_REWARD = 40;

  const grantSkillBadges = (skillId: string) => {
    if (skillId === 'arduino_basico') grantBadge('circuit-master');
    if (ROBOTICS_SKILL_IDS.includes(skillId)) grantBadge('bot-builder');
  };

  /**
   * Passar no quiz do Desafio Relâmpago só ABRE o desafio — não desbloqueia
   * mais nada sozinho. unlockedSkills não é auto-gravável pelo cliente (ver
   * firestore.rules); a ClassLayout mostra a BattleScreen enquanto
   * activeChallenge existir, e só sai de lá cancelando ou completando por
   * link/código do professor (handleChooseSkill* abaixo).
   */
  const handleUnlockSkill = (skillId: string) => {
    if (profile.unlockedSkills.includes(skillId)) return;
    const skill = SKILL_NODES.find((s) => s.id === skillId);
    if (!skill) return;
    soundEngine.playWhoosh();
    setPendingSkillChoice({ skillId, skillTitle: skill.title, xpReward: SKILL_XP_REWARD, coinReward: SKILL_COIN_REWARD });
  };

  /** BattleScreen: aluno escolhe "enviar link do projeto" — resolve na hora, sem precisar do professor. */
  const handleCompleteSkillWithLink = async (projectLink: string) => {
    if (!firebaseUser || !pendingSkillChoice) return;
    setValidationError('');
    try {
      const result = await completeSkillWithLinkApi(
        firebaseUser,
        classId,
        schoolId,
        profile.adventureName,
        pendingSkillChoice.skillId,
        pendingSkillChoice.skillTitle,
        projectLink,
        pendingSkillChoice.xpReward,
        pendingSkillChoice.coinReward
      );
      soundEngine.playSuccess();
      triggerConfetti();
      maybeCelebrateLevelUp(profile.level, result.newLevel);
      grantSkillBadges(pendingSkillChoice.skillId);
      setPendingSkillChoice(null);
    } catch (err) {
      soundEngine.playErrorBeep();
      setValidationError(err instanceof Error ? err.message : 'Não foi possível enviar o link.');
    }
  };

  /** BattleScreen: aluno escolhe "pedir validação do professor" — cria o pedido pendente e o token que só o GM vê. */
  const handleRequestSkillTeacherValidation = async () => {
    if (!pendingSkillChoice) return;
    await requestSkillValidation(
      classId,
      schoolId,
      pendingSkillChoice.skillId,
      pendingSkillChoice.skillTitle,
      profile.uid,
      profile.adventureName,
      pendingSkillChoice.xpReward,
      pendingSkillChoice.coinReward
    );
    soundEngine.playWhoosh();
    // A partir daqui o desafio ativo passa a vir de myPendingSkillValidation
    // (Firestore), não mais deste estado local.
    setPendingSkillChoice(null);
  };

  /** Aluno digita o código que o professor falou/mostrou. */
  const handleValidateSkillToken = async (skillId: string, token: string) => {
    if (!firebaseUser) return;
    setValidationError('');
    try {
      const result = await submitSkillValidationCode(firebaseUser, classId, skillId, token);
      soundEngine.playSuccess();
      triggerConfetti();
      maybeCelebrateLevelUp(profile.level, result.newLevel);
      grantSkillBadges(skillId);
    } catch (err) {
      soundEngine.playErrorBeep();
      setValidationError(err instanceof Error ? err.message : 'Código incorreto.');
    }
  };

  /** BattleScreen: "Cancelar desafio" — larga a missão/habilidade em andamento, sem ganhar nada. */
  const handleCancelActiveChallenge = async () => {
    if (pendingSkillChoice) {
      setPendingSkillChoice(null);
      return;
    }
    if (myPendingSkillValidation) {
      await cancelSkillValidation(classId, profile.uid, myPendingSkillValidation.skillId);
      return;
    }
    const pendingQuest = quests.find(
      (q) => q.status === 'PENDING_VALIDATION' && q.pendingValidationStudentUid === profile.uid
    );
    if (pendingQuest) {
      await cancelQuestAcceptance(pendingQuest.id);
    }
  };

  /**
   * A "batalha" que trava a navegação (ver ClassLayout.tsx/BattleScreen.tsx)
   * — uma missão aceita (PENDING_VALIDATION) ou uma habilidade em qualquer
   * etapa (escolhendo método, ou já com um código pendente). Prioriza
   * pendingSkillChoice (mais recente/local) sobre o Firestore por design:
   * não faz sentido mostrar os dois ao mesmo tempo.
   */
  const activeChallenge: ActiveChallenge | null = pendingSkillChoice
    ? {
        kind: 'skill',
        skillId: pendingSkillChoice.skillId,
        title: pendingSkillChoice.skillTitle,
        xpReward: pendingSkillChoice.xpReward,
        coinReward: pendingSkillChoice.coinReward,
        awaitingMethod: true
      }
    : myPendingSkillValidation
      ? {
          kind: 'skill',
          skillId: myPendingSkillValidation.skillId,
          title: myPendingSkillValidation.skillTitle,
          xpReward: myPendingSkillValidation.xpReward,
          coinReward: myPendingSkillValidation.coinReward,
          awaitingMethod: false
        }
      : (() => {
          const pendingQuest = quests.find(
            (q) => q.status === 'PENDING_VALIDATION' && q.pendingValidationStudentUid === profile.uid
          );
          return pendingQuest
            ? {
                kind: 'quest' as const,
                questId: pendingQuest.id,
                title: pendingQuest.title,
                xpReward: pendingQuest.xpReward,
                coinReward: pendingQuest.coinReward
              }
            : null;
        })();

  const handleBookResource = (machine: ResourceBooking['machine'], timeSlot: string): boolean => {
    const today = new Date().toISOString().slice(0, 10);
    const guildName = guilds.find((g) => g.id === profile.guildId)?.name;
    const alreadyTaken = bookings.some((b) => b.machine === machine && b.date === today && b.timeSlot === timeSlot);
    if (alreadyTaken) return false;
    setBookings((prev) => [
      ...prev,
      { id: `booking-${Date.now()}`, machine, studentName: profile.adventureName, guildName, date: today, timeSlot }
    ]);
    return true;
  };

  const [validationError, setValidationError] = useState('');

  /** Student "accepts" an ACTIVE quest — generates the code the GM will reveal in person once the work is done. */
  const handleAcceptQuest = (questId: string, xpReward: number, coinReward: number) => {
    void acceptQuestFs(classId, schoolId, questId, profile.uid, profile.adventureName, xpReward, coinReward);
    grantBadge('first-code');
  };

  /** Student submits the code the GM told/showed them — grants XP/coins server-side only on a match. */
  const handleValidateQuest = async (questId: string, code: string) => {
    if (!firebaseUser) return;
    setValidationError('');
    try {
      // Captura os ODS da missão ANTES do servidor limpar seus campos de
      // validação — depois de COMPLETED não dá mais pra saber quem a
      // concluiu, então esse registro por aluno só pode acontecer aqui.
      const sdgGoals = quests.find((q) => q.id === questId)?.sdgGoals ?? [];
      const result = await submitValidationCode(firebaseUser, questId, code);
      soundEngine.playSuccess();
      triggerConfetti();
      maybeCelebrateLevelUp(profile.level, result.newLevel);
      if (sdgGoals.length > 0) {
        const merged = Array.from(new Set([...profile.completedQuestSdgGoals, ...sdgGoals]));
        applyUserPatch({ completedQuestSdgGoals: merged });
        if (merged.length >= 3) grantBadge('sdg-guardian');
      }
    } catch (err) {
      soundEngine.playErrorBeep();
      setValidationError(err instanceof Error ? err.message : 'Código incorreto.');
    }
  };

  const handleProposeQuest = (title: string, description: string, sdgGoals: SDGGoal[]) => {
    void proposeQuest(classId, schoolId, title, description, sdgGoals, profile.uid, profile.adventureName);
  };

  const isGmOfThisClass = profile.classIdsAsGameMaster.includes(classId);

  const handleGenerateAIQuest = async () => {
    const unlockedSkillTitles = SKILL_NODES.filter((s) => profile.unlockedSkills.includes(s.id)).map(
      (s) => s.title
    );
    const unlockedHardware = SKILL_NODES.filter((s) => profile.unlockedSkills.includes(s.id)).flatMap(
      (s) => s.hardwareUnlocked ?? []
    );
    // GM-suggested quests publish straight to the mural; student-suggested
    // ones go through the same PROPOSED -> GM-approval gate as a manually
    // proposed quest (firestore.rules only lets students create quests with
    // status PROPOSED, never ACTIVE directly).
    const statusFields = isGmOfThisClass
      ? { status: 'ACTIVE' as const }
      : { status: 'PROPOSED' as const, proposedByStudentId: profile.uid, proposedByStudentName: profile.adventureName };
    try {
      // Real LLM-generated quest via the NVIDIA-backed Vercel/Cloud Function.
      // Falls back to the local rules-based engine if that's unavailable, so
      // quest generation keeps working either way.
      const aiQuest = await generateQuestWithAI({
        unlockedSkillTitles,
        unlockedHardware,
        avoidTitles: quests.map((q) => q.title)
      });
      const { id: _discard, status: _status, ...fields } = aiQuest;
      await createQuest(classId, schoolId, { ...fields, ...statusFields });
    } catch {
      const fallbackQuest = generateAIQuest(profile, SKILL_NODES, quests, QUEST_TEMPLATES);
      const { id: _discard, status: _status, ...fields } = fallbackQuest;
      await createQuest(classId, schoolId, { ...fields, ...statusFields });
    }
    triggerConfetti();
  };

  const handleUnlockSecretQuest = (code: string): boolean => {
    if (code !== 'IZI-CYBER') return false;
    triggerConfetti();
    if (!profile.unlockedSkills.includes('secret_cypher_node')) {
      applyUserPatch((current) => {
        if (current.unlockedSkills.includes('secret_cypher_node')) return {};
        return {
          unlockedSkills: [...current.unlockedSkills, 'secret_cypher_node'],
          xp: current.xp + 600,
          izicoins: current.izicoins + 150
        };
      });
    }
    const secretQuest = quests.find((q) => q.isSecretQuest);
    if (secretQuest) void completeSecretQuest(secretQuest.id);
    return true;
  };

  /**
   * Antes decrementava o estoque local e concedia o item na hora — o Game
   * Master nunca via nada, porque tudo isso vivia só no localStorage do
   * navegador do aluno. Agora só cria um pedido PENDING no Firestore; quem
   * de fato debita Izicoins/concede o item é handleResolveHardwareRequest
   * (via server, quando o GM aprova) — ver hardwareRequestHandler.ts.
   */
  const handleRequestHardware = async (itemId: string) => {
    const item = catalog.find((i) => i.id === itemId);
    if (!item || item.stockQuantity <= 0) return;
    await requestHardware(classId, schoolId, profile.uid, profile.adventureName, item);
  };

  const handleCancelHardwareRequest = async (requestId: string) => {
    await cancelHardwareRequest(requestId);
  };

  /** Painel do Mestre: aprova (concede Izicoins/item via server) ou nega um pedido pendente. */
  const handleResolveHardwareRequest = async (requestId: string, decision: 'APPROVED' | 'DENIED') => {
    if (!firebaseUser) return;
    await resolveHardwareRequestApi(firebaseUser, requestId, decision);
  };

  const handleUnlockCuriosityCard = (code: string): boolean => {
    const card = curiosities.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (!card || card.unlocked) return false;
    triggerConfetti();
    setCuriosities((prev) =>
      prev.map((c) => (c.code.toUpperCase() === code.toUpperCase() ? { ...c, unlocked: true } : c))
    );
    applyUserPatch((current) => {
      if (current.unlockedCuriosities.includes(card.id)) return {};
      return { xp: current.xp + card.xpReward, unlockedCuriosities: [...current.unlockedCuriosities, card.id] };
    });
    return true;
  };

  // O "já concluído?" é decidido no chamador com o profile.completedWizards
  // síncrono (igual ao padrão de handleUnlockCuriosityCard) — a checagem
  // dentro da transação abaixo é só uma rede de segurança contra cliques
  // duplos, não a fonte da verdade do botão.
  const handleCompleteWizard = (wizardId: string, xpReward: number, coinReward: number) => {
    soundEngine.playLevelUp();
    triggerConfetti();
    applyUserPatch((current) => {
      if ((current.completedWizards ?? []).includes(wizardId)) return {};
      return {
        xp: current.xp + xpReward,
        izicoins: current.izicoins + coinReward,
        completedWizards: [...(current.completedWizards ?? []), wizardId]
      };
    });
  };

  // Recompensa dos pontos de encontro do Mundo (Overworld) — puzzle de
  // sequência resolvido ao esbarrar em um marcador no mapa andável.
  // "Já coletado?" fica a cargo do estado local do próprio Overworld (um Set
  // por sessão de navegação), então aqui é só conceder e comemorar.
  const handleCollectEncounter = (xpReward: number, coinReward: number) => {
    soundEngine.playCorrect();
    triggerConfetti();
    grantXpAndCoins(xpReward, coinReward);
  };

  const handleAttackBoss = (damage: number, guildName: string) => {
    grantBadge('hackathon-slayer');
    setCampaign((prev) => {
      const nextHp = Math.max(0, prev.bossCurrentHp - damage);
      return {
        ...prev,
        bossCurrentHp: nextHp,
        recentLogs: [
          {
            id: `log-${Date.now()}`,
            text: `Guilda "${guildName}" desferiu ataque de ${damage} de dano!`,
            time: new Date().toLocaleTimeString().slice(0, 5),
            guildName
          },
          ...prev.recentLogs.slice(0, 4)
        ]
      };
    });
  };

  const handleApproveQuest = (questId: string) => {
    void approveQuestFs(questId);
  };

  const handleTriggerQuickHack = () => {
    setQuickHack((prev) => ({ ...prev, active: true }));
  };

  const handleQuickHackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickHackInput.trim().toUpperCase() === quickHack.answerHash.toUpperCase()) {
      soundEngine.playLevelUp();
      triggerConfetti();
      grantXpAndCoins(quickHack.xpReward, 50);
      setQuickHack((prev) => ({ ...prev, active: false }));
      setQuickHackInput('');
    } else {
      soundEngine.playErrorBeep();
    }
  };

  return {
    skills: SKILL_NODES,
    guilds,
    quests,
    catalog,
    curiosities,
    campaign,
    quickHack,
    bookings,
    quickHackInput,
    setQuickHackInput,
    validationError,
    activeChallenge,
    skillValidations,
    skillCompletions,
    hardwareRequests,
    myHardwareRequests,
    levelUpInfo,
    handleCloseLevelUp,
    handleQuizAnswered,
    handleSignContract,
    handleUpdateAvatar,
    handleCompleteSkillSurvey,
    handleSkipSkillSurvey,
    handleDeleteSkillProfile,
    handleJoinGuild,
    handleCreateGuild,
    handleUnlockSkill,
    handleCompleteSkillWithLink,
    handleRequestSkillTeacherValidation,
    handleValidateSkillToken,
    handleCancelActiveChallenge,
    handleBookResource,
    handleAcceptQuest,
    handleValidateQuest,
    handleProposeQuest,
    handleGenerateAIQuest,
    handleUnlockSecretQuest,
    handleRequestHardware,
    handleCancelHardwareRequest,
    handleResolveHardwareRequest,
    handleUnlockCuriosityCard,
    handleCompleteWizard,
    handleCollectEncounter,
    handleAttackBoss,
    handleApproveQuest,
    handleTriggerQuickHack,
    handleQuickHackSubmit
  };
}
