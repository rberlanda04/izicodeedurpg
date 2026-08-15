import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  QUESTS,
  INITIAL_GUILDS,
  HARDWARE_CATALOG,
  CURIOSITY_CARDS,
  HACKATHON_CAMPAIGN,
  QUICK_HACK_ALERT,
  QUEST_TEMPLATES
} from '../data/mockData';
import { SKILL_NODES } from '../data/mockData';
import { generateAIQuest } from '../services/questEngine';
import { generateQuestWithAI } from '../services/aiContentService';
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
 * Local (per-class, localStorage-backed) state for the parts of the app not
 * yet migrated to Firestore this pass: guilds, quests, hardware catalog,
 * curiosities, the hackathon boss raid and quick-hacks. Keyed by `classId`
 * so switching between turmas doesn't clobber each other's data, even
 * though none of it is cloud-synced yet — see PLANO_DESENVOLVIMENTO.md and
 * the "Fase 1 / Fase 2" split this mirrors.
 *
 * `profile`/`applyUserPatch` come from Firestore (AuthContext) — anything
 * that changes XP, Izicoins, unlocked skills, badges or inventory goes
 * through `applyUserPatch`, never local state, because the user profile is
 * global across classes/years, not per-turma.
 */
export function useClassLocalState(classId: string, profile: UserProfile, applyUserPatch: ApplyUserPatch) {
  const [guilds, setGuilds] = useState<Guild[]>(() => loadState(classKey(classId, 'guilds'), INITIAL_GUILDS));
  const [quests, setQuests] = useState<Quest[]>(() => loadState(classKey(classId, 'quests'), QUESTS));
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

  const debouncedSaveRef = useRef(
    debounce(
      (state: {
        guilds: Guild[];
        quests: Quest[];
        catalog: HardwareItem[];
        curiosities: CuriosityCard[];
        campaign: BossRaidCampaign;
        quickHack: QuickHackAlert;
        bookings: ResourceBooking[];
      }) => {
        saveState(classKey(classId, 'guilds'), state.guilds);
        saveState(classKey(classId, 'quests'), state.quests);
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
    debouncedSaveRef.current({ guilds, quests, catalog, curiosities, campaign, quickHack, bookings });
  }, [guilds, quests, catalog, curiosities, campaign, quickHack, bookings]);

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
    setGuilds((prev) =>
      prev.map((g) =>
        g.id === guildId
          ? {
              ...g,
              members: [
                ...g.members,
                { uid: profile.uid, name: profile.adventureName, role, avatarHead: profile.avatarConfig.head }
              ]
            }
          : g
      )
    );
  };

  const handleCreateGuild = (name: string, motto: string, canvaLink: string) => {
    const newGuild: Guild = {
      id: `guild-${Date.now()}`,
      name,
      motto,
      emblemUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&auto=format&fit=crop&q=80',
      leaderId: profile.uid,
      leaderName: profile.adventureName,
      members: [{ uid: profile.uid, name: profile.adventureName, role: 'SCRUM_MASTER', avatarHead: profile.avatarConfig.head }],
      score: 500,
      canvaFigmaLink: canvaLink
    };
    setGuilds((prev) => [newGuild, ...prev]);
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

  const handleCompleteQuest = (questId: string, xpReward: number, coinReward: number) => {
    triggerConfetti();
    setQuests((prev) => prev.map((q) => (q.id === questId ? { ...q, status: 'COMPLETED' } : q)));
    grantXpAndCoins(xpReward, coinReward);
  };

  const handleProposeQuest = (title: string, description: string, sdgGoals: SDGGoal[]) => {
    const newQuest: Quest = {
      id: `quest-prop-${Date.now()}`,
      title,
      description,
      tier: 'INTERMEDIATE',
      requiredSkills: [],
      sdgGoals,
      xpReward: 300,
      coinReward: 80,
      hardwareRequired: [],
      proposedByStudentId: profile.uid,
      proposedByStudentName: profile.adventureName,
      status: 'PROPOSED',
      validationSteps: ['Revisão pelo Game Master na sala.']
    };
    setQuests((prev) => [newQuest, ...prev]);
  };

  const handleGenerateAIQuest = async () => {
    const unlockedSkillTitles = SKILL_NODES.filter((s) => profile.unlockedSkills.includes(s.id)).map(
      (s) => s.title
    );
    const unlockedHardware = SKILL_NODES.filter((s) => profile.unlockedSkills.includes(s.id)).flatMap(
      (s) => s.hardwareUnlocked ?? []
    );
    try {
      // Real LLM-generated quest via the NVIDIA-backed Cloud Function. Only
      // works once that function is deployed (Blaze plan + secret set) —
      // falls back to the local rules-based engine otherwise, so quest
      // generation keeps working even before that infra is live.
      const aiQuest = await generateQuestWithAI({
        unlockedSkillTitles,
        unlockedHardware,
        avoidTitles: quests.map((q) => q.title)
      });
      setQuests((prev) => [aiQuest, ...prev]);
    } catch {
      const fallbackQuest = generateAIQuest(profile, SKILL_NODES, quests, QUEST_TEMPLATES);
      setQuests((prev) => [fallbackQuest, ...prev]);
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
    setQuests((prev) => prev.map((q) => (q.id === 'quest-secret-1' ? { ...q, status: 'COMPLETED' } : q)));
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
    setQuests((prev) => prev.map((q) => (q.id === questId ? { ...q, status: 'ACTIVE' } : q)));
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
    handleSignContract,
    handleUpdateAvatar,
    handleJoinGuild,
    handleCreateGuild,
    handleUnlockSkill,
    handleBookResource,
    handleCompleteQuest,
    handleProposeQuest,
    handleGenerateAIQuest,
    handleUnlockSecretQuest,
    handleRequestHardware,
    handleUnlockCuriosityCard,
    handleAttackBoss,
    handleApproveQuest,
    handleTriggerQuickHack,
    handleQuickHackSubmit
  };
}
