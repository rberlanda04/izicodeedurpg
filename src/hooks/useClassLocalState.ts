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
import { SKILL_NODES } from '../data/mockData';
import { generateAIQuest } from '../services/questEngine';
import { generateQuestWithAI } from '../services/aiContentService';
import {
  subscribeToClassQuests,
  proposeQuest,
  createQuest,
  approveQuest as approveQuestFs,
  completeSecretQuest,
  acceptQuest as acceptQuestFs
} from '../services/questRepo';
import { submitValidationCode } from '../services/questValidationService';
import { subscribeToClassGuilds, createGuild, joinGuild } from '../services/guildRepo';
import { loadState, saveState, debounce, NAMESPACE } from '../services/persistence';
import { soundEngine } from '../services/soundEngine';
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
  const [catalog, setCatalog] = useState<HardwareItem[]>(() =>
    loadState(classKey(classId, 'catalog'), HARDWARE_CATALOG)
  );
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
    return () => {
      unsubQuests();
      unsubGuilds();
    };
  }, [classId]);

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

  const grantXpAndCoins = (xp: number, coins: number) => {
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
  };

  const handleUnlockSkill = (skillId: string) => {
    if (profile.unlockedSkills.includes(skillId)) return;
    soundEngine.playLevelUp();
    triggerConfetti();
    applyUserPatch((current) => {
      if (current.unlockedSkills.includes(skillId)) return {};
      const newXp = current.xp + 200;
      let newLevel = current.level;
      let nextLevelXp = current.xpToNextLevel;
      if (newXp >= nextLevelXp) {
        newLevel += 1;
        nextLevelXp += 1000;
      }
      return {
        unlockedSkills: [...current.unlockedSkills, skillId],
        xp: newXp,
        level: newLevel,
        xpToNextLevel: nextLevelXp,
        izicoins: current.izicoins + 40
      };
    });
  };

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
  };

  /** Student submits the code the GM told/showed them — grants XP/coins server-side only on a match. */
  const handleValidateQuest = async (questId: string, code: string) => {
    if (!firebaseUser) return;
    setValidationError('');
    try {
      await submitValidationCode(firebaseUser, questId, code);
      soundEngine.playLevelUp();
      triggerConfetti();
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

  const handleRequestHardware = (itemId: string, cost: number) => {
    const item = catalog.find((i) => i.id === itemId);
    if (!item || item.stockQuantity <= 0) return;
    setCatalog((prev) => prev.map((i) => (i.id === itemId ? { ...i, stockQuantity: i.stockQuantity - 1 } : i)));
    applyUserPatch((current) => {
      const alreadyOwned = current.inventory.find((inv) => inv.itemId === itemId);
      const nextInventory = alreadyOwned
        ? current.inventory.map((inv) => (inv.itemId === itemId ? { ...inv, qty: inv.qty + 1 } : inv))
        : [...current.inventory, { itemId: item.id, name: item.name, qty: 1, icon: item.icon }];
      return { izicoins: current.izicoins - cost, inventory: nextInventory };
    });
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
    handleSignContract,
    handleUpdateAvatar,
    handleJoinGuild,
    handleCreateGuild,
    handleUnlockSkill,
    handleBookResource,
    handleAcceptQuest,
    handleValidateQuest,
    handleProposeQuest,
    handleGenerateAIQuest,
    handleUnlockSecretQuest,
    handleRequestHardware,
    handleUnlockCuriosityCard,
    handleCompleteWizard,
    handleCollectEncounter,
    handleAttackBoss,
    handleApproveQuest,
    handleTriggerQuickHack,
    handleQuickHackSubmit
  };
}
