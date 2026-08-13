import React, { useState } from 'react';
import type { Quest, QuickHackAlert } from '../types';
import { soundEngine } from '../services/soundEngine';
import { Crown, Key, Zap, CheckCircle, RefreshCw, Send, Users, ShieldAlert, Award } from 'lucide-react';

interface GameMasterControlViewProps {
  roomPasscode: string;
  onChangePasscode: (newCode: string) => void;
  proposedQuests: Quest[];
  onApproveQuest: (questId: string) => void;
  onTriggerQuickHack: () => void;
  onAwardXP: (amount: number) => void;
}

export const GameMasterControlView: React.FC<GameMasterControlViewProps> = ({
  roomPasscode,
  onChangePasscode,
  proposedQuests,
  onApproveQuest,
  onTriggerQuickHack,
  onAwardXP
}) => {
  const [newPasscode, setNewPasscode] = useState(roomPasscode);
  const [passcodeMsg, setPasscodeMsg] = useState('');
  const [customXp, setCustomXp] = useState(100);
  const [xpMsg, setXpMsg] = useState('');

  const handleUpdatePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasscode.trim()) return;

    soundEngine.playLevelUp();
    onChangePasscode(newPasscode.toUpperCase());
    setPasscodeMsg('✅ Código da Sala Atualizado com Sucesso!');
    setTimeout(() => setPasscodeMsg(''), 2500);
  };

  const handleGenerateRandomPasscode = () => {
    soundEngine.playItemCollect();
    const rand = 'IZI-' + Math.floor(1000 + Math.random() * 9000);
    setNewPasscode(rand);
    onChangePasscode(rand);
    setPasscodeMsg(`✅ Novo código projetado: ${rand}`);
    setTimeout(() => setPasscodeMsg(''), 2500);
  };

  const handleTriggerHack = () => {
    soundEngine.playBossHit();
    onTriggerQuickHack();
  };

  const handleAwardXp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customXp || customXp <= 0) return;

    soundEngine.playLevelUp();
    onAwardXP(customXp);
    setXpMsg(`✅ +${customXp} XP concedido em tempo real para a turma!`);
    setTimeout(() => setXpMsg(''), 2500);
  };

  const handleQuickAward = (amount: number) => {
    soundEngine.playItemCollect();
    onAwardXP(amount);
    setXpMsg(`✅ +${amount} XP concedido em tempo real para a turma!`);
    setTimeout(() => setXpMsg(''), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="pixel-box pixel-box-gold p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[10px] bg-[#ffb700] text-[#0d0f18] px-2 py-0.5 font-bold">
              MODO GAME MASTER (PROFESSOR)
            </span>
          </div>
          <h2 className="font-pixel text-lg text-[#ffb700] mt-1 flex items-center gap-2">
            <Crown className="w-5 h-5" /> PAINEL DE CONTROLE DE SALA DE AULA
          </h2>
          <p className="font-body text-xs text-slate-300 mt-1">
            Gerencie o código de acesso da turma, projeta eventos relâmpago e aprove entregas com liberação de XP instantâneo.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Room Passcode Control */}
        <div className="pixel-box p-6 bg-[#161b2e] border-2 border-[#00e1ff] space-y-4">
          <h3 className="font-pixel text-sm text-[#00e1ff] flex items-center gap-2">
            <Key className="w-4 h-4" /> CÓDIGO DE ACESSO DA SALA (PROJETOR)
          </h3>

          <form onSubmit={handleUpdatePasscode} className="space-y-3">
            <div>
              <label className="block font-pixel text-[10px] text-slate-300 mb-1">CÓDIGO ATIVO:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPasscode}
                  onChange={(e) => setNewPasscode(e.target.value.toUpperCase())}
                  className="flex-1 bg-[#090c15] border-2 border-[#2e3859] focus:border-[#00e1ff] p-2.5 text-center font-mono text-xl font-bold text-[#00e1ff] tracking-widest outline-none"
                  maxLength={8}
                />
                <button
                  type="button"
                  onClick={handleGenerateRandomPasscode}
                  className="p-2 bg-[#1a2238] border-2 border-[#00e1ff] text-[#00e1ff] hover:bg-[#00e1ff] hover:text-[#090c15]"
                  title="Gerar código aleatório"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>

            {passcodeMsg && (
              <p className="font-mono text-xs text-[#00ffaa] text-center">{passcodeMsg}</p>
            )}

            <button type="submit" className="w-full pixel-btn pixel-btn-primary justify-center">
              ATUALIZAR CÓDIGO DA SALA
            </button>
          </form>
        </div>

        {/* Classroom Quick Hack Broadcast */}
        <div className="pixel-box p-6 bg-[#161b2e] border-2 border-pink-500 space-y-4">
          <h3 className="font-pixel text-sm text-pink-400 flex items-center gap-2">
            <Zap className="w-4 h-4" /> DISPARAR QUICK-HACK (DESAFIO DE 3 MINUTOS)
          </h3>
          <p className="font-body text-xs text-slate-300 bg-[#090c15] p-3 border border-pink-500/40">
            Transmita instantaneamente um enigma de binário para os monitores de todas as 44 guildas da sala!
          </p>

          <button
            onClick={handleTriggerHack}
            className="w-full pixel-btn pixel-btn-secondary justify-center text-xs py-3"
          >
            ⚡ TRANSMITIR ALERTA DE DESAFIO PARA A SALA!
          </button>
        </div>

        {/* Live XP Award */}
        <div className="pixel-box p-6 bg-[#161b2e] border-2 border-[#00ffaa] space-y-4 md:col-span-2">
          <h3 className="font-pixel text-sm text-[#00ffaa] flex items-center gap-2">
            <Award className="w-4 h-4" /> CONCEDER XP AO VIVO
          </h3>
          <p className="font-body text-xs text-slate-300 bg-[#090c15] p-3 border border-[#00ffaa]/40">
            Distribua pontos de experiência instantaneamente para recompensar participação, esforço ou acertos rápidos durante a aula.
          </p>

          <form onSubmit={handleAwardXp} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
            <div className="flex-1">
              <label className="block font-pixel text-[10px] text-slate-300 mb-1">QUANTIDADE DE XP:</label>
              <input
                type="number"
                min={1}
                step={10}
                value={customXp}
                onChange={(e) => setCustomXp(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full bg-[#090c15] border-2 border-[#2e3859] focus:border-[#00ffaa] p-2.5 text-center font-mono text-lg font-bold text-[#00ffaa] outline-none"
              />
            </div>
            <button type="submit" className="pixel-btn pixel-btn-primary justify-center whitespace-nowrap">
              <Zap className="w-4 h-4" /> CONCEDER {customXp} XP
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {[10, 25, 50, 100].map((amount) => (
              <button
                key={amount}
                onClick={() => handleQuickAward(amount)}
                className="pixel-btn text-[10px] py-1.5 px-3 bg-[#1a2238] border-[#00ffaa] text-[#00ffaa] hover:bg-[#00ffaa] hover:text-[#0d0f18]"
              >
                +{amount} XP RÁPIDO
              </button>
            ))}
          </div>

          {xpMsg && (
            <p className="font-mono text-xs text-[#00ffaa] text-center">{xpMsg}</p>
          )}
        </div>
      </div>

      {/* Propose Quests Approvals */}
      <div className="pixel-box p-6 bg-[#161b2e] border-2 border-[#2e3859] space-y-4">
        <h3 className="font-pixel text-sm text-[#ffb700] flex items-center gap-2">
          <Award className="w-4 h-4" /> MISSÕES PROPOSTAS POR ALUNOS (AGUARDANDO APROVAÇÃO DO MESTRE)
        </h3>

        {proposedQuests.length === 0 ? (
          <div className="bg-[#090c15] p-4 text-center font-mono text-xs text-slate-400 border border-[#2e3859]">
            Nenhuma missão pendente de aprovação.
          </div>
        ) : (
          <div className="space-y-3">
            {proposedQuests.map((q) => (
              <div key={q.id} className="bg-[#090c15] p-4 border border-[#ffb700] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h4 className="font-pixel text-xs text-white">{q.title}</h4>
                  <p className="font-body text-xs text-slate-300 mt-1">{q.description}</p>
                  <p className="font-mono text-[10px] text-[#00ffaa] mt-1">Alinhamento ODS: {q.sdgGoals.join(', ')}</p>
                </div>

                <button
                  onClick={() => {
                    soundEngine.playLevelUp();
                    onApproveQuest(q.id);
                  }}
                  className="pixel-btn pixel-btn-primary whitespace-nowrap"
                >
                  <CheckCircle className="w-4 h-4" /> APROVAR MISSÃO (+100 XP GUILDA)
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
