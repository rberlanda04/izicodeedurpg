import React from 'react';
import { NavLink } from 'react-router-dom';
import { Map, Scroll, Users, Wrench, Compass, Swords, UserCircle, Crown, ShieldCheck, Globe2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const linkBase =
  'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-display font-semibold transition-colors';
const linkActive = 'bg-stem-teal text-white';
const linkInactive = 'text-stem-ink-soft hover:bg-stem-mist';

export const Sidebar: React.FC<{ classId: string }> = ({ classId }) => {
  const { isGmOfClass, profile } = useAuth();
  const base = `/app/${classId}`;
  const adminSchoolId = profile?.schoolAdminOf[0];

  const items = [
    { to: `${base}/trilha`, label: 'Trilha', icon: Map },
    { to: `${base}/missoes`, label: 'Missões', icon: Scroll },
    { to: `${base}/guildas`, label: 'Guildas', icon: Users },
    { to: `${base}/lab`, label: 'Maker Lab', icon: Wrench },
    { to: `${base}/curiosidades`, label: 'Curiosidades', icon: Compass },
    { to: `${base}/hackathon`, label: 'Hackathon', icon: Swords },
    { to: `${base}/portais`, label: 'Portais de Desafios', icon: Globe2 },
    { to: `${base}/perfil`, label: 'Meu Perfil', icon: UserCircle }
  ];

  return (
    <nav className="w-56 shrink-0 hidden lg:flex flex-col gap-1 py-6 pr-4">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>
          <Icon className="w-5 h-5" />
          {label}
        </NavLink>
      ))}

      {isGmOfClass(classId) && (
        <NavLink
          to={`/gm/${classId}`}
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
    </nav>
  );
};
