import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { PasscodeModal } from './components/PasscodeModal';
import { HackerTerminalModal } from './components/HackerTerminalModal';
import { AdventurerProfileView } from './components/AdventurerProfileView';
import { GuildsView } from './components/GuildsView';
import { SkillTreeView } from './components/SkillTreeView';
import { QuestBoardView } from './components/QuestBoardView';
import { HardwareInventoryView } from './components/HardwareInventoryView';
import { CuriosityRadarView } from './components/CuriosityRadarView';
import { HackathonCampaignView } from './components/HackathonCampaignView';
import { GameMasterControlView } from './components/GameMasterControlView';

import {
  INITIAL_USER,
  INITIAL_GUILDS,
  SKILL_NODES,
  QUESTS,
  HARDWARE_CATALOG,
  CURIOSITY_CARDS,
  HACKATHON_CAMPAIGN,
  QUICK_HACK_ALERT,
  QUEST_TEMPLATES
} from './data/mockData';
import type { UserProfile, UserRole, Guild, SkillNode, Quest, HardwareItem, CuriosityCard, BossRaidCampaign, SDGGoal, QuickHackAlert, ResourceBooking } from './types';
import { soundEngine } from './services/soundEngine';
import { loadState, saveState, debounce } from './services/persistence';
import { generateAIQuest } from './services/questEngine';

import './styles/pixel.css';
import { Zap, X, ShieldAlert } from 'lucide-react';

export function App() {
  const [user, setUser] = useState<UserProfile>(() => loadState('izicode:v1:user', INITIAL_USER));
  const [guilds, setGuilds] = useState<Guild[]>(() => loadState('izicode:v1:guilds', INITIAL_GUILDS));
  const [skills, setSkills] = useState<SkillNode[]>(() => loadState('izicode:v1:skills', SKILL_NODES));
  const [quests, setQuests] = useState<Quest[]>(() => loadState('izicode:v1:quests', QUESTS));
  const [catalog, setCatalog] = useState<HardwareItem[]>(() => loadState('izicode:v1:catalog', HARDWARE_CATALOG));
  const [curiosities, setCuriosities] = useState<CuriosityCard[]>(() =>
    loadState('izicode:v1:curiosities', CURIOSITY_CARDS)
  );
  const [campaign, setCampaign] = useState<BossRaidCampaign>(() =>
    loadState('izicode:v1:campaign', HACKATHON_CAMPAIGN)
  );
  const [roomPasscode, setRoomPasscode] = useState<string>(() =>
    loadState('izicode:v1:roomPasscode', 'IZI-9482')
  );
  const [quickHack, setQuickHack] = useState<QuickHackAlert>(() =>
    loadState('izicode:v1:quickHack', QUICK_HACK_ALERT)
  );
  const [quickHackInput, setQuickHackInput] = useState('');
  // Tracks whether THIS student session has confirmed the room passcode —
  // distinct from roomPasscode itself, which is the code the Game Master
  // broadcasts. Joining a room must never mutate the broadcast code.
  const [hasJoinedRoom, setHasJoinedRoom] = useState<boolean>(() =>
    loadState('izicode:v1:hasJoinedRoom', false)
  );
  const [bookings, setBookings] = useState<ResourceBooking[]>(() =>
    loadState('izicode:v1:bookings', [])
  );

  const [activeTab, setActiveTab] = useState('profile');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  // Persist state to localStorage, debounced so rapid successive updates
  // (e.g. several setState calls in one handler) collapse into one write.
  const debouncedSaveRef = useRef(
    debounce(
      (state: {
        user: UserProfile;
        guilds: Guild[];
        skills: SkillNode[];
        quests: Quest[];
        catalog: HardwareItem[];
        curiosities: CuriosityCard[];
        campaign: BossRaidCampaign;
        roomPasscode: string;
        quickHack: QuickHackAlert;
        hasJoinedRoom: boolean;
        bookings: ResourceBooking[];
      }) => {
        saveState('izicode:v1:user', state.user);
        saveState('izicode:v1:guilds', state.guilds);
        saveState('izicode:v1:skills', state.skills);
        saveState('izicode:v1:quests', state.quests);
        saveState('izicode:v1:catalog', state.catalog);
        saveState('izicode:v1:curiosities', state.curiosities);
        saveState('izicode:v1:campaign', state.campaign);
        saveState('izicode:v1:roomPasscode', state.roomPasscode);
        saveState('izicode:v1:quickHack', state.quickHack);
        saveState('izicode:v1:hasJoinedRoom', state.hasJoinedRoom);
        saveState('izicode:v1:bookings', state.bookings);
      },
      300
    )
  );

  useEffect(() => {
    debouncedSaveRef.current({
      user,
      guilds,
      skills,
      quests,
      catalog,
      curiosities,
      campaign,
      roomPasscode,
      quickHack,
      hasJoinedRoom,
      bookings
    });
  }, [user, guilds, skills, quests, catalog, curiosities, campaign, roomPasscode, quickHack, hasJoinedRoom, bookings]);

  // Global Keyboard Listener for CTRL + ~ to trigger Hacker Terminal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === '~' || e.key === '`')) {
        e.preventDefault();
        soundEngine.playTerminalBeep();
        setIsTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Avatar Update
  const handleUpdateAvatar = (newAvatarConfig: UserProfile['avatarConfig']) => {
    setUser((prev) => ({
      ...prev,
      avatarConfig: newAvatarConfig
    }));
  };

  // Sign Hero LGPD Contract
  const handleSignContract = () => {
    soundEngine.playLevelUp();
    triggerConfetti();
    setUser((prev) => ({
      ...prev,
      heroContractSigned: true,
      xp: prev.xp + 100,
      izicoins: prev.izicoins + 50
    }));
  };

  // Join Guild
  const handleJoinGuild = (guildId: string, role: any) => {
    setUser((prev) => ({
      ...prev,
      guildId,
      guildRole: role
    }));
  };

  // Create Guild
  const handleCreateGuild = (name: string, motto: string, canvaLink: string) => {
    const newG: Guild = {
      id: `guild-${Date.now()}`,
      name,
      motto,
      emblemUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&auto=format&fit=crop&q=80',
      leaderId: user.uid,
      leaderName: user.adventureName,
      members: [
        { uid: user.uid, name: user.adventureName, role: 'SCRUM_MASTER', avatarHead: user.avatarConfig.head }
      ],
      score: 500,
      canvaFigmaLink: canvaLink
    };
    setGuilds((prev) => [newG, ...prev]);
    setUser((prev) => ({ ...prev, guildId: newG.id, guildRole: 'SCRUM_MASTER' }));
  };

  // Unlock Skill Node
  const handleUnlockSkill = (skillId: string) => {
    if (user.unlockedSkills.includes(skillId)) return;

    soundEngine.playLevelUp();
    triggerConfetti();

    setUser((prev) => {
      const nextSkills = [...prev.unlockedSkills, skillId];
      const newXp = prev.xp + 200;
      let newLevel = prev.level;
      let nextLevelXp = prev.xpToNextLevel;

      if (newXp >= nextLevelXp) {
        newLevel += 1;
        nextLevelXp += 1000;
      }

      return {
        ...prev,
        unlockedSkills: nextSkills,
        xp: newXp,
        level: newLevel,
        xpToNextLevel: nextLevelXp,
        izicoins: prev.izicoins + 40
      };
    });
  };

  // DEV-ONLY: switch role for testing UI gating (to be replaced by Firebase Auth custom claims)
  const handleChangeRole = (role: UserRole) => {
    setUser((prev) => ({ ...prev, role }));
    if (role === 'ADVENTURER' && activeTab === 'gamemaster') {
      setActiveTab('profile');
    }
  };

  // Book Maquinário (FabLab resource reservation — guards against double-booking)
  const handleBookResource = (machine: ResourceBooking['machine'], timeSlot: string): boolean => {
    const today = new Date().toISOString().slice(0, 10);
    const guildName = guilds.find((g) => g.id === user.guildId)?.name;

    const alreadyTaken = bookings.some(
      (b) => b.machine === machine && b.date === today && b.timeSlot === timeSlot
    );
    if (alreadyTaken) return false;

    const newBooking: ResourceBooking = {
      id: `booking-${Date.now()}`,
      machine,
      studentName: user.adventureName,
      guildName,
      date: today,
      timeSlot
    };
    setBookings((prev) => [...prev, newBooking]);
    return true;
  };

  // Complete Quest
  const handleCompleteQuest = (questId: string, xpReward: number, coinReward: number) => {
    triggerConfetti();
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, status: 'COMPLETED' } : q))
    );

    setUser((prev) => {
      const newXp = prev.xp + xpReward;
      let newLevel = prev.level;
      let nextLevelXp = prev.xpToNextLevel;

      if (newXp >= nextLevelXp) {
        newLevel += 1;
        nextLevelXp += 1000;
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        xpToNextLevel: nextLevelXp,
        izicoins: prev.izicoins + coinReward
      };
    });
  };

  // Propose Quest
  const handleProposeQuest = (title: string, description: string, sdgGoals: SDGGoal[]) => {
    const newQ: Quest = {
      id: `quest-prop-${Date.now()}`,
      title,
      description,
      tier: 'INTERMEDIATE',
      requiredSkills: [],
      sdgGoals,
      xpReward: 300,
      coinReward: 80,
      hardwareRequired: [],
      proposedByStudentId: user.uid,
      proposedByStudentName: user.adventureName,
      status: 'PROPOSED',
      validationSteps: ['Revisão pelo Game Master na sala.']
    };
    setQuests((prev) => [newQ, ...prev]);
  };

  // AI Quest Generator
  const handleGenerateAIQuest = () => {
    const aiQuest = generateAIQuest(user, skills, quests, QUEST_TEMPLATES);
    setQuests((prev) => [aiQuest, ...prev]);
    triggerConfetti();
  };

  // Terminal Unlock Secret Quest
  const handleUnlockSecretQuest = (code: string) => {
    if (code === 'IZI-CYBER') {
      triggerConfetti();

      // Unlock Secret Skill Node
      if (!user.unlockedSkills.includes('secret_cypher_node')) {
        setUser((prev) => ({
          ...prev,
          unlockedSkills: [...prev.unlockedSkills, 'secret_cypher_node'],
          xp: prev.xp + 600,
          izicoins: prev.izicoins + 150
        }));
      }

      setQuests((prev) =>
        prev.map((q) => (q.id === 'quest-secret-1' ? { ...q, status: 'COMPLETED' } : q))
      );
      return true;
    }
    return false;
  };

  // Request Hardware
  const handleRequestHardware = (itemId: string, cost: number) => {
    const item = catalog.find((i) => i.id === itemId);

    // Item unknown or already out of stock: block the request entirely, no coin deduction.
    if (!item || item.stockQuantity <= 0) return;

    setCatalog((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, stockQuantity: i.stockQuantity - 1 } : i))
    );

    setUser((prev) => {
      const alreadyOwned = prev.inventory.find((inv) => inv.itemId === itemId);
      const nextInventory = alreadyOwned
        ? prev.inventory.map((inv) =>
            inv.itemId === itemId ? { ...inv, qty: inv.qty + 1 } : inv
          )
        : [...prev.inventory, { itemId: item.id, name: item.name, qty: 1, icon: item.icon }];

      return {
        ...prev,
        izicoins: prev.izicoins - cost,
        inventory: nextInventory
      };
    });
  };

  // Unlock Curiosity Card
  const handleUnlockCuriosityCard = (code: string) => {
    const card = curiosities.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (card && !card.unlocked) {
      triggerConfetti();
      setCuriosities((prev) =>
        prev.map((c) => (c.code.toUpperCase() === code.toUpperCase() ? { ...c, unlocked: true } : c))
      );
      setUser((prev) => ({
        ...prev,
        xp: prev.xp + card.xpReward,
        unlockedCuriosities: [...prev.unlockedCuriosities, card.id]
      }));
      return true;
    }
    return false;
  };

  // Attack Hackathon Boss
  const handleAttackBoss = (damage: number, guildName: string) => {
    setCampaign((prev) => {
      const nextHp = Math.max(0, prev.bossCurrentHp - damage);
      const newLog = {
        id: `log-${Date.now()}`,
        text: `Guilda "${guildName}" desferiu ataque de ${damage} de dano!`,
        time: new Date().toLocaleTimeString().slice(0, 5),
        guildName
      };
      return {
        ...prev,
        bossCurrentHp: nextHp,
        recentLogs: [newLog, ...prev.recentLogs.slice(0, 4)]
      };
    });
  };

  // Teacher Approval of Proposed Quest
  const handleApproveQuest = (questId: string) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, status: 'ACTIVE' } : q))
    );
  };

  // Trigger Quick Hack Alert
  const handleTriggerQuickHack = () => {
    setQuickHack((prev) => ({ ...prev, active: true }));
  };

  // Submit Quick Hack Answer
  const handleQuickHackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickHackInput.trim().toUpperCase() === quickHack.answerHash.toUpperCase()) {
      soundEngine.playLevelUp();
      triggerConfetti();
      setUser((prev) => ({
        ...prev,
        xp: prev.xp + quickHack.xpReward,
        izicoins: prev.izicoins + 50
      }));
      setQuickHack((prev) => ({ ...prev, active: false }));
      setQuickHackInput('');
    } else {
      soundEngine.playErrorBeep();
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f18] text-slate-100 flex flex-col relative pb-12">
      {/* CRT Overlay Effect */}
      <div className="crt-overlay" />

      {/* Header */}
      <Header
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onOpenPasscodeModal={() => setIsPasscodeModalOpen(true)}
        soundOn={soundOn}
        setSoundOn={setSoundOn}
        roomPasscode={roomPasscode}
        onChangeRole={handleChangeRole}
      />

      {/* Quick Hack Active Broadcast Banner */}
      {quickHack.active && (
        <div className="bg-pink-600 border-b-4 border-pink-400 p-4 text-white z-30 animate-pulse">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-[#00ffaa] animate-bounce" />
              <div>
                <h3 className="font-pixel text-xs text-white">{quickHack.title}</h3>
                <p className="font-body text-xs text-pink-100">{quickHack.riddle}</p>
              </div>
            </div>

            <form onSubmit={handleQuickHackSubmit} className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={quickHackInput}
                onChange={(e) => setQuickHackInput(e.target.value)}
                placeholder="Resposta em ASCII..."
                className="bg-[#090c15] border border-white p-2 text-xs font-mono text-white outline-none"
              />
              <button type="submit" className="pixel-btn pixel-btn-primary text-xs py-1.5 px-3">
                ENVIAR
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 pt-6 flex-1 w-full">
        {activeTab === 'profile' && (
          <AdventurerProfileView
            user={user}
            onUpdateAvatar={handleUpdateAvatar}
            onSignContract={handleSignContract}
          />
        )}

        {activeTab === 'guilds' && (
          <GuildsView
            guilds={guilds}
            currentUserId={user.uid}
            onJoinGuild={handleJoinGuild}
            onCreateGuild={handleCreateGuild}
          />
        )}

        {activeTab === 'skilltree' && (
          <SkillTreeView
            skills={skills}
            unlockedSkillIds={user.unlockedSkills}
            onUnlockSkill={handleUnlockSkill}
            bookings={bookings}
            onBookResource={handleBookResource}
          />
        )}

        {activeTab === 'quests' && (
          <QuestBoardView
            quests={quests}
            unlockedSkills={user.unlockedSkills}
            onCompleteQuest={handleCompleteQuest}
            onProposeQuest={handleProposeQuest}
            onGenerateAIQuest={handleGenerateAIQuest}
          />
        )}

        {activeTab === 'hardware' && (
          <HardwareInventoryView
            catalog={catalog}
            userCoins={user.izicoins}
            onRequestHardware={handleRequestHardware}
          />
        )}

        {activeTab === 'curiosities' && (
          <CuriosityRadarView
            cards={curiosities}
            onUnlockCard={handleUnlockCuriosityCard}
          />
        )}

        {activeTab === 'hackathon' && (
          <HackathonCampaignView
            campaign={campaign}
            onAttackBoss={handleAttackBoss}
          />
        )}

        {activeTab === 'gamemaster' && (user.role === 'GAME_MASTER' || user.role === 'ADMIN') && (
          <GameMasterControlView
            roomPasscode={roomPasscode}
            onChangePasscode={(code) => setRoomPasscode(code)}
            proposedQuests={quests.filter((q) => q.status === 'PROPOSED')}
            onApproveQuest={handleApproveQuest}
            onTriggerQuickHack={handleTriggerQuickHack}
            onAwardXP={(amount) =>
              setUser((prev) => ({ ...prev, xp: prev.xp + amount }))
            }
          />
        )}
      </main>

      {/* Modals */}
      <PasscodeModal
        isOpen={isPasscodeModalOpen}
        onClose={() => setIsPasscodeModalOpen(false)}
        currentPasscode={roomPasscode}
        hasJoinedRoom={hasJoinedRoom}
        onJoinRoom={() => setHasJoinedRoom(true)}
      />

      <HackerTerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        user={user}
        onUnlockSecretQuest={handleUnlockSecretQuest}
      />
    </div>
  );
}

export default App;
