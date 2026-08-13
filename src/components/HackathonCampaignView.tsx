import React, { useState, useEffect } from 'react';
import type { BossRaidCampaign } from '../types';
import { soundEngine } from '../services/soundEngine';
import { Swords, Flame, Users, Zap, Radio } from 'lucide-react';

interface HackathonCampaignViewProps {
  campaign: BossRaidCampaign;
  onAttackBoss: (damage: number, guildName: string) => void;
}

export const HackathonCampaignView: React.FC<HackathonCampaignViewProps> = ({
  campaign,
  onAttackBoss
}) => {
  const [bossHp, setBossHp] = useState(campaign.bossCurrentHp);
  const [concurrencyRps, setConcurrencyRps] = useState(campaign.concurrencyRps);
  const [hitEffect, setHitEffect] = useState(false);

  const hpPercent = Math.max(0, Math.min(100, Math.round((bossHp / campaign.bossMaxHp) * 100)));

  // Simulate real-time concurrency traffic from 350+ students in 44 teams
  useEffect(() => {
    const interval = setInterval(() => {
      setConcurrencyRps(170 + Math.floor(Math.random() * 35));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleGuildAttack = () => {
    soundEngine.playBossHit();
    const damage = 250 + Math.floor(Math.random() * 150);
    const nextHp = Math.max(0, bossHp - damage);
    setBossHp(nextHp);
    setHitEffect(true);
    setTimeout(() => setHitEffect(false), 500);

    onAttackBoss(damage, 'Mágicos do Solder');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="pixel-box pixel-box-pink p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-pixel text-xs bg-pink-600 text-white px-2 py-0.5 animate-pulse">
              MODO CAMPANHA ÉPICA ATIVO
            </span>
            <span className="font-mono text-xs text-[#00ffaa]">🔴 AO VIVO EM SALA</span>
          </div>
          <h2 className="font-pixel text-lg text-white mt-1 flex items-center gap-2">
            <Swords className="w-5 h-5 text-[#ff007f]" /> {campaign.title}
          </h2>
          <p className="font-body text-xs text-slate-300 mt-1">
            Evento simultâneo de larga escala unindo 350+ alunos em 44 equipes de alta performance.
          </p>
        </div>

        {/* Real-time Infrastructure Metrics */}
        <div className="bg-[#090c15] px-4 py-2 border-2 border-[#00e1ff] flex items-center gap-4 text-xs font-mono">
          <div>
            <p className="text-slate-400 text-[10px]">EQUIPES / ALUNOS:</p>
            <p className="text-[#00e1ff] font-bold flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> 44 Guildas ({campaign.totalStudentsCount} Alunos)
            </p>
          </div>
          <div className="border-l border-[#2e3859] pl-4">
            <p className="text-slate-400 text-[10px]">FIREBASE RPS (WRITE BATCH):</p>
            <p className="text-[#00ffaa] font-bold flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 animate-pulse" /> {concurrencyRps} req/seg
            </p>
          </div>
        </div>
      </div>

      {/* Boss Raid Card */}
      <div className={`pixel-box p-8 bg-[#161b2e] border-4 ${hitEffect ? 'border-red-500 scale-[0.99]' : 'border-[#ff007f]'} transition-all text-center space-y-6 relative overflow-hidden`}>
        <div className="space-y-2">
          <span className="font-pixel text-xs text-[#ff007f] tracking-widest uppercase">
            DESAFIO GLOBAL DA ESCOLA
          </span>
          <h3 className="font-pixel text-xl text-white flex items-center justify-center gap-3">
            <Flame className="w-7 h-7 text-red-500 animate-bounce" />
            <span>{campaign.bossName}</span>
            <Flame className="w-7 h-7 text-red-500 animate-bounce" />
          </h3>
        </div>

        {/* Boss Visual Sprite & HP Bar */}
        <div className="max-w-xl mx-auto space-y-3">
          <div className="text-7xl my-4 animate-pulse">👹⚡</div>

          <div className="flex justify-between items-center font-pixel text-xs mb-1">
            <span className="text-red-400">BARRA DE HP DO BOSS:</span>
            <span className="text-white">{bossHp} / {campaign.bossMaxHp} HP ({hpPercent}%)</span>
          </div>

          <div className="pixel-progress-bg h-6">
            <div
              className="pixel-progress-fill pixel-progress-fill-hp"
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>

        {/* Attack Action */}
        <div className="pt-2">
          <button
            onClick={handleGuildAttack}
            className="pixel-btn pixel-btn-secondary text-sm py-3 px-8 text-white font-pixel"
          >
            ⚔️ ENVIAR ATAQUE DA GUILDA! (-250 HP)
          </button>
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="pixel-box p-6 bg-[#090c15] border-2 border-[#2e3859] space-y-3">
        <h4 className="font-pixel text-xs text-[#00e1ff] flex items-center gap-2">
          <Zap className="w-4 h-4" /> FEED EM TEMPO REAL DAS GUILDAS (CONCORRÊNCIA EM LOTE):
        </h4>

        <div className="space-y-2 font-mono text-xs">
          {campaign.recentLogs.map((log) => (
            <div key={log.id} className="bg-[#161b2e] p-2.5 border border-[#2e3859] flex items-center justify-between">
              <span className="text-slate-300">
                🛡️ <strong className="text-[#ffb700]">{log.guildName}</strong>: {log.text}
              </span>
              <span className="text-slate-500 text-[10px]">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
