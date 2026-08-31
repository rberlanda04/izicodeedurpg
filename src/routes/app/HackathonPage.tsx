import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Swords, Flame, Users, Trophy } from 'lucide-react';
import { Card } from '../../components/stem/Card';
import { Button } from '../../components/stem/Button';
import { useAuth } from '../../contexts/AuthContext';
import type { ClassOutletContext } from './ClassLayout';

export const HackathonPage: React.FC = () => {
  const { campaign, guilds, handleAttackBoss } = useOutletContext<ClassOutletContext>();
  const { profile } = useAuth();
  const hpPercent = Math.max(0, Math.round((campaign.bossCurrentHp / campaign.bossMaxHp) * 100));
  const myGuild = guilds.find((g) => g.id === profile?.guildId);
  const bossDefeated = campaign.bossCurrentHp <= 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-stem-ink flex items-center gap-2">
          <Swords className="w-6 h-6 text-stem-coral" /> {campaign.title}
        </h1>
        <p className="font-body-stem text-sm text-stem-ink-soft">{campaign.bossName}</p>
      </div>

      {bossDefeated ? (
        <Card accent="amber" className="text-center py-8">
          <img src="/game/victory-banner.svg" alt="Boss derrotado!" className="max-w-md w-full mx-auto mb-4" />
          <h2 className="font-display font-extrabold text-xl text-stem-ink flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6 text-stem-amber" /> Boss derrotado pela turma!
          </h2>
          <p className="font-body-stem text-sm text-stem-ink-soft mt-2 max-w-md mx-auto">
            {campaign.participatingGuildsCount} guildas e {campaign.totalStudentsCount} aventureiros uniram forças
            contra {campaign.bossName.toLowerCase()}. Fique de olho no próximo Hackathon Épico!
          </p>
        </Card>
      ) : (
        <Card accent="coral">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-4">
            <div className="w-full md:w-56 h-44 flex items-center justify-center bg-[#1a1508] rounded-2xl border-2 border-stem-coral/40 p-2 overflow-hidden shadow-inner relative group">
              <img
                src="/game/boss-energy-waste.svg"
                alt={campaign.bossName}
                className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(199,255,0,0.5)] transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between text-sm font-display font-bold mb-2">
                <span className="text-stem-coral">HP do Boss</span>
                <span className="text-stem-ink-soft">
                  {campaign.bossCurrentHp} / {campaign.bossMaxHp}
                </span>
              </div>
              <div className="h-4 rounded-full bg-stem-mist overflow-hidden">
                <div className="h-full bg-stem-coral rounded-full transition-all duration-300" style={{ width: `${hpPercent}%` }} />
              </div>

              <div className="flex items-center gap-6 mt-4 text-sm font-body-stem text-stem-ink-soft">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" /> {campaign.participatingGuildsCount} guildas
                </span>
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-stem-amber" /> {campaign.totalStudentsCount} aventureiros
                </span>
              </div>

              {myGuild && (
                <Button
                  className="mt-4 w-full sm:w-auto"
                  variant="danger"
                  onClick={() => handleAttackBoss(250, myGuild.name)}
                >
                  <Swords className="w-4 h-4" /> Atacar o Boss (Guilda {myGuild.name})
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      <Card>
        <h3 className="font-display font-bold text-stem-ink mb-3">Log de batalha</h3>
        <div className="space-y-2">
          {campaign.recentLogs.map((log) => (
            <p key={log.id} className="text-sm font-body-stem text-stem-ink-soft">
              <span className="text-stem-ink-soft/70">[{log.time}]</span> {log.text}
            </p>
          ))}
        </div>
      </Card>
    </div>
  );
};
