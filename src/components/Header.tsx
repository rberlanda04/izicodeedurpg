import React from 'react';
import type { UserProfile, UserRole } from '../types';
import { soundEngine } from '../services/soundEngine';
import { Terminal, Volume2, VolumeX, Shield, Users, GitFork, Scroll, Wrench, Compass, Swords, Crown, Key } from 'lucide-react';

interface HeaderProps {
  user: UserProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenTerminal: () => void;
  onOpenPasscodeModal: () => void;
  soundOn: boolean;
  setSoundOn: (val: boolean) => void;
  roomPasscode: string;
  onChangeRole: (role: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activeTab,
  setActiveTab,
  onOpenTerminal,
  onOpenPasscodeModal,
  soundOn,
  setSoundOn,
  roomPasscode,
  onChangeRole
}) => {
  const xpPercent = Math.min(100, Math.round((user.xp / user.xpToNextLevel) * 100));
  const isGameMaster = user.role === 'GAME_MASTER' || user.role === 'ADMIN';

  const navItems = [
    { id: 'profile', label: 'Ficha', icon: Shield },
    { id: 'guilds', label: 'Guildas', icon: Users },
    { id: 'skilltree', label: 'Skill Tree', icon: GitFork },
    { id: 'quests', label: 'Quests ODS', icon: Scroll },
    { id: 'hardware', label: 'Maker Lab', icon: Wrench },
    { id: 'curiosities', label: 'Curiosidades', icon: Compass },
    { id: 'hackathon', label: 'Hackathon (350+)', icon: Swords },
    ...(isGameMaster ? [{ id: 'gamemaster', label: 'Painel Mestre', icon: Crown }] : []),
  ];

  const handleTabClick = (tabId: string) => {
    soundEngine.playItemCollect();
    setActiveTab(tabId);
  };

  const toggleSound = () => {
    const next = !soundOn;
    soundEngine.soundEnabled = next;
    setSoundOn(next);
    if (next) soundEngine.playBeep(880, 'sine', 0.1);
  };

  return (
    <header className="bg-[#121626] border-b-4 border-[#2e3859] sticky top-0 z-40 shadow-xl">
      {/* Top Status Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Room Passcode */}
        <div className="flex items-center gap-3">
          <div className="bg-[#0d0f18] p-2 border-2 border-[#00ffaa] flex items-center gap-2">
            <span className="text-2xl animate-pulse">🎮</span>
            <div>
              <h1 className="font-pixel text-xs text-[#00ffaa] tracking-wider uppercase">IZICODE MAKER</h1>
              <p className="font-retro text-[10px] text-[#ff007f]">RPG LEARNING SYSTEM</p>
            </div>
          </div>

          {/* Quick Access Passcode Badge */}
          <button
            onClick={onOpenPasscodeModal}
            className="flex items-center gap-2 bg-[#1a2238] border-2 border-[#00e1ff] px-3 py-1.5 hover:bg-[#00e1ff]/20 transition-all cursor-pointer"
            title="Código de Sala para Alunos (Acesso Instantâneo)"
          >
            <Key className="w-4 h-4 text-[#00e1ff]" />
            <span className="font-pixel text-[10px] text-[#94a3b8]">SALA:</span>
            <span className="font-mono font-bold text-xs text-[#00e1ff] tracking-widest">{roomPasscode}</span>
          </button>
        </div>

        {/* User Stats HUD */}
        <div className="flex items-center gap-4 bg-[#090c15] px-4 py-1.5 border-2 border-[#2e3859]">
          {/* Avatar Icon */}
          <div className="text-2xl bg-[#161b2e] p-1 border border-[#00ffaa]">
            {user.avatarConfig.head}
          </div>

          {/* User Level & XP */}
          <div className="w-36">
            <div className="flex justify-between items-center text-[10px] font-pixel mb-1">
              <span className="text-[#00ffaa]">{user.adventureName}</span>
              <span className="text-[#ffb700]">LVL {user.level}</span>
            </div>
            <div className="pixel-progress-bg">
              <div
                className="pixel-progress-fill pixel-progress-fill-xp"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-0.5">
              <span>XP {user.xp}</span>
              <span>{user.xpToNextLevel} XP</span>
            </div>
          </div>

          {/* Izicoins */}
          <div className="flex items-center gap-1.5 bg-[#161b2e] px-2.5 py-1 border border-[#ffb700]">
            <span className="text-sm">🪙</span>
            <span className="font-pixel text-xs text-[#ffb700]">{user.izicoins}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* DEV-ONLY Role Switcher — temporary affordance, replace with Firebase Auth custom claims later */}
          <div
            className="flex items-center gap-1 bg-transparent border border-dashed border-slate-600 px-1.5 py-1 opacity-70 hover:opacity-100 transition-opacity"
            title="Ferramenta temporária de desenvolvimento — substituir por Firebase Auth (custom claims) antes de produção."
          >
            <span className="font-mono text-[9px] text-slate-500 whitespace-nowrap">🛠 DEV: Papel de Teste</span>
            <select
              value={user.role}
              onChange={(e) => onChangeRole(e.target.value as UserRole)}
              className="bg-[#0d0f18] border border-slate-600 text-slate-400 font-mono text-[9px] px-1 py-0.5 outline-none cursor-pointer"
            >
              <option value="ADVENTURER">ADVENTURER</option>
              <option value="GAME_MASTER">GAME_MASTER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          {/* Terminal CLI Toggle */}
          <button
            onClick={onOpenTerminal}
            className="pixel-btn bg-[#030a05] text-[#00ff66] border-[#00ff66] hover:bg-[#00ff66] hover:text-[#030a05] text-xs py-1.5 px-3"
            title="Abrir Terminal CLI Hacker (Atalho: CTRL + ~)"
          >
            <Terminal className="w-4 h-4" />
            <span className="hidden sm:inline">TERMINAL CLI</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 bg-[#1a2238] border-2 border-[#2e3859] text-slate-300 hover:text-white hover:border-[#00e1ff]"
            title={soundOn ? 'Desativar Sons 8-bit' : 'Ativar Sons 8-bit'}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-[#00ffaa]" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-[#0d0f18] border-t border-[#2e3859] px-4 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-1 py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-pixel whitespace-nowrap transition-all border-b-2 ${
                  isActive
                    ? 'border-[#00ffaa] text-[#00ffaa] bg-[#161b2e]'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#121626]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#00ffaa]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
