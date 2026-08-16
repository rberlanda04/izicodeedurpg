import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Moon, Sun, LogOut, Globe2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ClassSwitcher } from './ClassSwitcher';

export const TopNav: React.FC<{ onOpenTerminal?: () => void }> = ({ onOpenTerminal }) => {
  const { profile, signOut } = useAuth();
  const { mode, toggleMode } = useTheme();

  if (!profile) return null;

  const xpPercent = Math.min(100, Math.round((profile.xp / profile.xpToNextLevel) * 100));

  return (
    <header className="sticky top-0 z-40 bg-stem-cloud/90 backdrop-blur border-b-2 border-stem-line">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/app" className="flex items-center">
          <img src="/marketing/rpgmaker-logo.png" alt="Izicode Maker RPG" className="h-9 w-auto object-contain" />
        </Link>

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

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 bg-stem-mist rounded-xl px-3 py-1.5 text-sm font-display font-bold text-stem-amber">
            🪙 {profile.izicoins}
          </div>

          <ClassSwitcher />

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
