import React, { useState } from 'react';
import type { Quest, SDGGoal } from '../types';
import { soundEngine } from '../services/soundEngine';
import { Scroll, PlusCircle, CheckCircle, Globe, Bot } from 'lucide-react';

interface QuestBoardViewProps {
  quests: Quest[];
  unlockedSkills: string[];
  onCompleteQuest: (questId: string, xp: number, coins: number) => void;
  onProposeQuest: (title: string, desc: string, sdgs: SDGGoal[]) => void;
  onGenerateAIQuest: () => void;
}

export const QuestBoardView: React.FC<QuestBoardViewProps> = ({
  quests,
  onCompleteQuest,
  onProposeQuest,
  onGenerateAIQuest
}) => {
  const [selectedSDG, setSelectedSDG] = useState<string>('ALL');
  const [showProposeModal, setShowProposeModal] = useState(false);
  const [propTitle, setPropTitle] = useState('');
  const [propDesc, setPropDesc] = useState('');
  const [propSDG, setPropSDG] = useState<SDGGoal>('7.a');
  const [aiGenerating, setAiGenerating] = useState(false);

  const sdgInfo: Record<SDGGoal, { label: string; color: string; desc: string }> = {
    '4.3': { label: 'ODS 4.3 - Educação Técnica', color: '#ff007f', desc: 'Garantir acesso a soluções de tecnologia e formação Maker' },
    '7.a': { label: 'ODS 7.a - Energia Limpa', color: '#ffb700', desc: 'Pesquisa e inovação em energia renovável' },
    '12.c': { label: 'ODS 12.c - Consumo Sustentável', color: '#00ffaa', desc: 'Racionalização e medidores de consumo de recursos' },
    '13.a': { label: 'ODS 13.a - Ação Climática', color: '#00e1ff', desc: 'Estações meteorológicas e alertas de risco' }
  };

  const filteredQuests = quests.filter((q) => {
    if (selectedSDG === 'ALL') return true;
    return q.sdgGoals.includes(selectedSDG as SDGGoal);
  });

  const handleProposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propTitle.trim()) return;

    soundEngine.playItemCollect();
    onProposeQuest(propTitle, propDesc, [propSDG]);
    setShowProposeModal(false);
    setPropTitle('');
    setPropDesc('');
  };

  const handleAIQuestClick = () => {
    soundEngine.playTerminalBeep();
    setAiGenerating(true);
    setTimeout(() => {
      onGenerateAIQuest();
      soundEngine.playLevelUp();
      setAiGenerating(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="pixel-box pixel-box-gold p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-pixel text-lg text-[#ffb700] flex items-center gap-2">
            <Scroll className="w-5 h-5" /> MURAL DE MISSÕES (QUEST BOARD) & ODS ONU
          </h2>
          <p className="font-body text-xs text-slate-300 mt-1">
            Resolva desafios reais integrando hardware com as metas mundiais de desenvolvimento sustentável da ONU.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* AI Generator Button */}
          <button
            onClick={handleAIQuestClick}
            disabled={aiGenerating}
            className="pixel-btn bg-[#7b2cbf] border-[#c77dff] text-white hover:bg-[#c77dff] hover:text-[#0d0f18]"
          >
            <Bot className="w-4 h-4" />
            <span>{aiGenerating ? 'GERANDO QUEST IA...' : 'MOTOR IA (ODS)'}</span>
          </button>

          {/* Propose Quest */}
          <button
            onClick={() => setShowProposeModal(true)}
            className="pixel-btn pixel-btn-primary"
          >
            <PlusCircle className="w-4 h-4" /> PROPOR MISSÃO
          </button>
        </div>
      </div>

      {/* ODS Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-[#090c15] p-3 border-2 border-[#2e3859]">
        <span className="font-pixel text-xs text-slate-400 mr-2 flex items-center gap-1">
          <Globe className="w-4 h-4 text-[#00e1ff]" /> FILTRAR POR METAS ODS:
        </span>
        <button
          onClick={() => setSelectedSDG('ALL')}
          className={`font-pixel text-[11px] px-3 py-1 border ${
            selectedSDG === 'ALL' ? 'border-[#00ffaa] bg-[#00ffaa]/20 text-[#00ffaa]' : 'border-slate-700 text-slate-400'
          }`}
        >
          TODAS AS QUESTS
        </button>
        {(Object.keys(sdgInfo) as SDGGoal[]).map((sdgKey) => {
          const info = sdgInfo[sdgKey];
          return (
            <button
              key={sdgKey}
              onClick={() => setSelectedSDG(sdgKey)}
              className={`font-pixel text-[11px] px-3 py-1 border transition-all ${
                selectedSDG === sdgKey ? 'bg-[#161b2e] text-white' : 'border-slate-700 text-slate-400'
              }`}
              style={{ borderColor: selectedSDG === sdgKey ? info.color : undefined, color: selectedSDG === sdgKey ? info.color : undefined }}
            >
              {sdgKey}
            </button>
          );
        })}
      </div>

      {/* Quests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredQuests.map((q) => {
          const isCompleted = q.status === 'COMPLETED';
          const isSecret = q.isSecretQuest;

          return (
            <div
              key={q.id}
              className={`pixel-box p-6 space-y-4 flex flex-col justify-between ${
                isCompleted
                  ? 'border-emerald-500/50 bg-[#0d1813]'
                  : isSecret
                  ? 'border-pink-500 bg-[#190d1f]'
                  : 'pixel-box-gold'
              }`}
            >
              <div className="space-y-3">
                {/* Header Badge & Rewards */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {isSecret && (
                      <span className="font-pixel text-[9px] bg-pink-500 text-white px-2 py-0.5 uppercase tracking-wider mb-1 inline-block">
                        🕵️ QUEST SECRETA (HACKER)
                      </span>
                    )}
                    <h3 className="font-pixel text-sm text-white">{q.title}</h3>
                    <p className="font-mono text-[10px] text-slate-400 mt-0.5">Tier: {q.tier}</p>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <span className="font-pixel text-xs text-[#c77dff] bg-[#7b2cbf]/20 px-2 py-0.5 border border-[#c77dff]">
                      +{q.xpReward} XP
                    </span>
                    <span className="font-pixel text-xs text-[#ffb700] mt-1">
                      🪙 +{q.coinReward}
                    </span>
                  </div>
                </div>

                <p className="font-body text-xs text-slate-300 bg-[#090c15] p-3 border border-[#2e3859]">
                  {q.description}
                </p>

                {/* SDG Goals Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {q.sdgGoals.map((sdg) => {
                    const info = sdgInfo[sdg];
                    return (
                      <span
                        key={sdg}
                        className="font-pixel text-[10px] px-2 py-0.5 border bg-[#090c15]"
                        style={{ borderColor: info.color, color: info.color }}
                      >
                        {sdg}
                      </span>
                    );
                  })}
                </div>

                {/* Hardware Requirements */}
                {q.hardwareRequired.length > 0 && (
                  <div className="text-[11px] font-mono text-slate-400">
                    <span className="text-slate-300">Hardware Exigido:</span> {q.hardwareRequired.join(', ')}
                  </div>
                )}

                {/* Validation Steps */}
                <div className="space-y-1 bg-[#090c15] p-2 border border-[#2e3859]">
                  <p className="font-pixel text-[9px] text-slate-400 uppercase">Validação pelo Mestre:</p>
                  {q.validationSteps.map((step, idx) => (
                    <div key={idx} className="font-body text-[11px] text-slate-300 flex items-center gap-1.5">
                      <span className="text-[#00ffaa]">▸</span> {step}
                    </div>
                  ))}
                </div>
              </div>

              {/* Complete Action */}
              <div className="pt-3 border-t border-[#2e3859]">
                {isCompleted ? (
                  <div className="font-pixel text-xs text-[#00ffaa] flex items-center justify-center gap-2 py-2">
                    <CheckCircle className="w-4 h-4" /> CONCLUÍDA & XP REPASSADO!
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      soundEngine.playQuestComplete();
                      onCompleteQuest(q.id, q.xpReward, q.coinReward);
                    }}
                    className="w-full pixel-btn pixel-btn-primary justify-center"
                  >
                    SUBMETER VALIDAÇÃO AO MESTRE
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Propose Quest Modal */}
      {showProposeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="pixel-box pixel-box-gold bg-[#121626] max-w-md w-full p-6 text-slate-200">
            <h3 className="font-pixel text-sm text-[#ffb700] mb-4">PROPOR CUSTOM QUEST AO MESTRE</h3>
            <form onSubmit={handleProposeSubmit} className="space-y-4">
              <div>
                <label className="block font-pixel text-[10px] text-slate-300 mb-1">TÍTULO DA MISSÃO:</label>
                <input
                  type="text"
                  value={propTitle}
                  onChange={(e) => setPropTitle(e.target.value)}
                  placeholder="Ex: Sensor de Lixo Seletivo Inteligente"
                  className="w-full bg-[#090c15] border-2 border-[#2e3859] p-2 text-xs font-mono text-white outline-none focus:border-[#ffb700]"
                  required
                />
              </div>

              <div>
                <label className="block font-pixel text-[10px] text-slate-300 mb-1">DESCRIÇÃO & ALVO MAKER:</label>
                <textarea
                  value={propDesc}
                  onChange={(e) => setPropDesc(e.target.value)}
                  placeholder="Descreva a utilidade e quais placas serão usadas..."
                  className="w-full bg-[#090c15] border-2 border-[#2e3859] p-2 text-xs font-mono text-white h-24 outline-none focus:border-[#ffb700]"
                />
              </div>

              <div>
                <label className="block font-pixel text-[10px] text-slate-300 mb-1">ALINHAMENTO ODS DA ONU:</label>
                <select
                  value={propSDG}
                  onChange={(e) => setPropSDG(e.target.value as SDGGoal)}
                  className="w-full bg-[#090c15] border-2 border-[#2e3859] p-2 text-xs font-mono text-white outline-none focus:border-[#ffb700]"
                >
                  <option value="4.3">ODS 4.3 - Educação Técnica</option>
                  <option value="7.a">ODS 7.a - Energia Limpa</option>
                  <option value="12.c">ODS 12.c - Consumo Sustentável</option>
                  <option value="13.a">ODS 13.a - Ação Climática</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProposeModal(false)}
                  className="w-1/2 pixel-btn bg-[#1a2238] text-slate-300"
                >
                  CANCELAR
                </button>
                <button type="submit" className="w-1/2 pixel-btn pixel-btn-primary justify-center">
                  ENVIAR MISSÃO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
