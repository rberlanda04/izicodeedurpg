import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { Card } from '../../components/stem/Card';
import { Button } from '../../components/stem/Button';
import { useAuth } from '../../contexts/AuthContext';
import type { ClassOutletContext } from './ClassLayout';

export const PerfilPage: React.FC = () => {
  const { handleSignContract } = useOutletContext<ClassOutletContext>();
  const { profile } = useAuth();
  if (!profile) return null;

  const xpPercent = Math.min(100, Math.round((profile.xp / profile.xpToNextLevel) * 100));

  return (
    <div className="space-y-6">
      <Card accent="teal">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <span className="text-6xl bg-stem-mist rounded-3xl p-4">{profile.avatarConfig.head}</span>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="font-display font-extrabold text-2xl text-stem-ink">{profile.adventureName}</h1>
            <p className="text-xs font-body-stem text-stem-ink-soft">
              Nome real: {profile.realName || '—'} (visível apenas ao Game Master)
            </p>
            <div className="flex items-center gap-3 mt-3 justify-center sm:justify-start">
              <span className="text-sm font-display font-bold text-stem-amber">Nível {profile.level}</span>
              <span className="text-sm font-display font-bold text-stem-amber">🪙 {profile.izicoins}</span>
            </div>
            <div className="h-2 rounded-full bg-stem-mist overflow-hidden mt-2 max-w-xs mx-auto sm:mx-0">
              <div className="h-full bg-stem-violet rounded-full" style={{ width: `${xpPercent}%` }} />
            </div>
            <p className="text-xs font-body-stem text-stem-ink-soft mt-1">
              {profile.xp} / {profile.xpToNextLevel} XP
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="font-display font-bold text-stem-ink mb-4">Galeria de badges ({profile.badges.length})</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {profile.badges.map((b) => (
            <div key={b.id} className="rounded-2xl bg-stem-mist p-3 text-center">
              <span className="text-2xl">{b.icon}</span>
              <p className="text-xs font-display font-bold text-stem-ink mt-1">{b.name}</p>
              <p className="text-[11px] font-body-stem text-stem-ink-soft">{b.description}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card accent="violet">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-stem-ink flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-stem-violet" /> Pacto dos Heróis (LGPD)
          </h3>
          {profile.heroContractSigned && (
            <span className="flex items-center gap-1 text-stem-teal text-sm font-display font-bold">
              <CheckCircle2 className="w-4 h-4" /> Assinado
            </span>
          )}
        </div>
        <ul className="text-sm font-body-stem text-stem-ink-soft mt-3 space-y-1 list-disc list-inside">
          <li>Seu nome real só é visível ao seu Game Master.</li>
          <li>Sua guilda usa codinomes públicos nos placares e eventos.</li>
        </ul>
        {!profile.heroContractSigned && (
          <Button className="mt-4" onClick={handleSignContract}>
            Assinar pacto (+100 XP)
          </Button>
        )}
      </Card>
    </div>
  );
};
