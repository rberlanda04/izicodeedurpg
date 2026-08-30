import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Moon, Sun, LogOut, Globe2, Menu, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { soundEngine } from '../../services/soundEngine';
import { ClassSwitcher } from './ClassSwitcher';

interface TopNavProps {
  onOpenTerminal?: () => void;
  onOpenMenu?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onOpenTerminal, onOpenMenu }) => {
  const { profile, signOut } = useAuth();
  const { mode, toggleMode } = useTheme();
  const [soundOn, setSoundOn] = useState(soundEngine.soundEnabled);

  if (!profile) return null;

  const xpPercent = Math.min(100, Math.round((profile.xp / profile.xpToNextLevel) * 100));

  return (
    <header className="sticky top-0 z-40 bg-stem-cloud/90 backdrop-blur border-b-2 border-stem-line">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 min-w-0">
          {onOpenMenu && (
            <button
              onClick={onOpenMenu}
              aria-label="Abrir menu"
              className="lg:hidden p-2 -ml-1 rounded-xl text-stem-ink-soft hover:bg-stem-mist hover:text-stem-ink transition-colors shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <Link to="/app" className="flex items-center shrink-0">
            <img src="/marketing/rpgmaker-logo.png" alt="Izicode Maker RPG" className="h-8 sm:h-9 w-auto object-contain" />
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3 flex-1 max-w-xs">
          <span className="text-2xl">{profile.avatarConfig.head}</span>
          <div className="flex-1">
            <div className="flex justify-between text-xs font-display font-semibold text-stem-ink-soft mb-1">
              <span>{profile.adventureName}</span>
              <span>Nv. {profile.level}</span>
            </div>
            <div className="h-2 rounded-full bg-stem-mist overflow-hidden">
              <div className="h-full bg-stem-violet rounded-full transition-all" style={{ width: `${xpPercent}%` }} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1 bg-stem-mist rounded-xl px-3 py-1.5 text-sm font-display font-bold text-stem-amber">
            🪙 {profile.izicoins}
          </div>

          <ClassSwitcher />

          {/* Em telas < lg estes ficam na gaveta do menu (Sidebar) para não
              lotar a barra — só o essencial (turma + sair) fica sempre à vista. */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              to="/eventos"
              title="Eventos Maker (hackathons)"
              className="p-2 rounded-xl border-2 border-stem-line hover:border-stem-teal text-stem-ink-soft hover:text-stem-teal transition-colors"
            >
              <Globe2 className="w-4 h-4" />
            </Link>

            {onOpenTerminal && (
              <button
                onClick={onOpenTerminal}
                title="Modo Hacker: Terminal CLI"
                className="p-2 rounded-xl border-2 border-stem-line hover:border-stem-teal text-stem-ink-soft hover:text-stem-teal transition-colors"
              >
                <Terminal className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={toggleMode}
              title={mode === 'stem' ? 'Ativar Modo Hacker' : 'Voltar ao visual padrão'}
              className="p-2 rounded-xl border-2 border-stem-line hover:border-stem-teal text-stem-ink-soft hover:text-stem-teal transition-colors"
            >
              {mode === 'stem' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setSoundOn(soundEngine.toggleSound())}
              title={soundOn ? 'Desativar sons' : 'Ativar sons'}
              className="p-2 rounded-xl border-2 border-stem-line hover:border-stem-teal text-stem-ink-soft hover:text-stem-teal transition-colors"
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          <button
            onClick={() => signOut()}
            title="Sair"
            className="p-2 rounded-xl border-2 border-stem-line hover:border-stem-coral text-stem-ink-soft hover:text-stem-coral transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
