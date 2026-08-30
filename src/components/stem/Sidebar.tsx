import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Map,
  GitBranch,
  Scroll,
  Users,
  Wrench,
  Compass,
  Swords,
  UserCircle,
  Crown,
  ShieldCheck,
  Globe2,
  X,
  Terminal,
  Moon,
  Sun,
  LogOut,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { soundEngine } from '../../services/soundEngine';

const linkBase =
  'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-display font-semibold transition-colors';
const linkActive = 'bg-stem-teal text-white';
const linkInactive = 'text-stem-ink-soft hover:bg-stem-mist';

interface SidebarProps {
  classId: string;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenTerminal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ classId, mobileOpen, onCloseMobile, onOpenTerminal }) => {
  const { isGmOfClass, profile, signOut } = useAuth();
  const { mode, toggleMode } = useTheme();
  const [soundOn, setSoundOn] = useState(soundEngine.soundEnabled);
  const base = `/app/${classId}`;
  const adminSchoolId = profile?.schoolAdminOf[0];

  const items = [
    { to: `${base}/mundo`, label: 'Mundo', icon: Map },
    { to: `${base}/trilha`, label: 'Trilha', icon: GitBranch },
    { to: `${base}/missoes`, label: 'Missões', icon: Scroll },
    { to: `${base}/guildas`, label: 'Guildas', icon: Users },
    { to: `${base}/lab`, label: 'Maker Lab', icon: Wrench },
    { to: `${base}/curiosidades`, label: 'Curiosidades', icon: Compass },
    { to: `${base}/hackathon`, label: 'Hackathon', icon: Swords },
    { to: `${base}/portais`, label: 'Portais de Desafios', icon: Globe2 },
    { to: `${base}/perfil`, label: 'Meu Perfil', icon: UserCircle }
  ];

  const navList = (onNavigate?: () => void) => (
    <>
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
        >
          <Icon className="w-5 h-5" />
          {label}
        </NavLink>
      ))}

      {isGmOfClass(classId) && (
        <NavLink
          to={`/gm/${classId}`}
          onClick={onNavigate}
          className={({ isActive }) =>
            `${linkBase} mt-4 border-t-2 border-stem-line pt-4 ${isActive ? linkActive : 'text-stem-amber hover:bg-stem-mist'}`
          }
        >
          <Crown className="w-5 h-5" />
          Painel do Mestre
        </NavLink>
      )}

      {adminSchoolId && (
        <NavLink
          to={`/admin/${adminSchoolId}`}
          onClick={onNavigate}
          className={({ isActive }) =>
            `${linkBase} ${isGmOfClass(classId) ? '' : 'mt-4 border-t-2 border-stem-line pt-4'} ${
              isActive ? linkActive : 'text-stem-violet hover:bg-stem-mist'
            }`
          }
        >
          <ShieldCheck className="w-5 h-5" />
          Painel Admin
        </NavLink>
      )}
    </>
  );

  return (
    <>
      {/* Desktop: coluna fixa ao lado do conteúdo */}
      <nav className="w-56 shrink-0 hidden lg:flex flex-col gap-1 py-6 pr-4">{navList()}</nav>

      {/* Mobile/tablet: menu em gaveta, aberto pelo botão hambúrguer do TopNav.
          Sempre montado (não só quando aberto) para a transição de slide
          funcionar; pointer-events desliga quando fechado para não bloquear
          cliques no conteúdo por trás do backdrop transparente. */}
      <div
        className={`fixed inset-0 z-[70] lg:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
      >
        <div className="absolute inset-0 bg-stem-ink/50 backdrop-blur-sm" onClick={onCloseMobile} />
        <div
          className={`absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-stem-cloud shadow-xl flex flex-col transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b-2 border-stem-line shrink-0">
            <img src="/marketing/rpgmaker-logo.png" alt="Izicode Maker RPG" className="h-8 w-auto object-contain" />
            <button
              onClick={onCloseMobile}
              aria-label="Fechar menu"
              className="p-2 rounded-xl text-stem-ink-soft hover:bg-stem-mist hover:text-stem-ink transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col gap-1 p-4 overflow-y-auto">
            {navList(onCloseMobile)}

            {/* Ações que no desktop ficam no TopNav (>= lg) — aqui embaixo
                para caberem em telas pequenas sem lotar a barra superior. */}
            <div className="mt-4 pt-4 border-t-2 border-stem-line flex flex-col gap-1">
              <NavLink
                to="/eventos"
                onClick={onCloseMobile}
                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
              >
                <Globe2 className="w-5 h-5" />
                Eventos Maker
              </NavLink>

              {onOpenTerminal && (
                <button
                  onClick={() => {
                    onOpenTerminal();
                    onCloseMobile();
                  }}
                  className={`${linkBase} ${linkInactive}`}
                >
                  <Terminal className="w-5 h-5" />
                  Terminal Hacker
                </button>
              )}

              <button onClick={toggleMode} className={`${linkBase} ${linkInactive}`}>
                {mode === 'stem' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                {mode === 'stem' ? 'Ativar Modo Hacker' : 'Voltar ao visual padrão'}
              </button>

              <button onClick={() => setSoundOn(soundEngine.toggleSound())} className={`${linkBase} ${linkInactive}`}>
                {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                {soundOn ? 'Desativar sons' : 'Ativar sons'}
              </button>

              <button onClick={() => signOut()} className={`${linkBase} text-stem-coral hover:bg-stem-coral/10`}>
                <LogOut className="w-5 h-5" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
