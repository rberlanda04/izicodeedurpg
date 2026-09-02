import React, { useState, useEffect } from 'react';
import { Swords, Key, Link2, X, Zap, Gift, Sparkles, MessageSquare, ArrowRight, BookOpen, Lightbulb, CheckCircle2, ChevronRight } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';
import type { ActiveChallenge } from '../../types';

interface BattleScreenProps {
  challenge: ActiveChallenge;
  validationError: string;
  onValidateQuestCode: (questId: string, code: string) => Promise<void>;
  onValidateSkillCode: (skillId: string, code: string) => Promise<void>;
  onCompleteSkillWithLink: (link: string) => Promise<void>;
  onRequestSkillTeacherValidation: () => Promise<void>;
  onCancel: () => Promise<void>;
}

type DialogStep = 'intro' | 'briefing' | 'action' | 'tip';

export const BattleScreen: React.FC<BattleScreenProps> = ({
  challenge,
  validationError,
  onValidateQuestCode,
  onValidateSkillCode,
  onCompleteSkillWithLink,
  onRequestSkillTeacherValidation,
  onCancel
}) => {
  const [step, setStep] = useState<DialogStep>('intro');
  const [code, setCode] = useState('');
  const [link, setLink] = useState('');
  const [busy, setBusy] = useState(false);
  const [actionType, setActionType] = useState<'code' | 'link' | 'none'>('none');
  const [dialogText, setDialogText] = useState('');
  const [emote, setEmote] = useState('💬');

  const isAwaitingMethod = challenge.kind === 'skill' && challenge.awaitingMethod;

  // Falas dos Mestres do Conhecimento para cada etapa
  const dialogues = {
    intro: `Saudações, nobre Maker! Eu sou Ada Lovelace, Guardiã do Conhecimento. Para conquistar o desafio "${challenge.title}", você precisará demonstrar sua destreza lógica e criatividade. Está pronto para aceitar o chamado?`,
    briefing: `Este desafio foi forjado para testar seus limites. Concluir esta missão concederá +${challenge.xpReward} XP para sua evolução e +${challenge.coinReward} moedas de ouro para seu inventário!`,
    tip: `Dica Estratégica da Maga: Verifique as conexões dos pinos e a sintaxe do seu código. Mostre ao Game Master ou envie o link público para validar sua vitória!`,
    action: isAwaitingMethod
      ? `Como você deseja consagrar sua solução? Você pode submeter o link do seu projeto online ou solicitar a avaliação presencial do Mestre.`
      : `Mostre seu projeto funcionando ao Game Master da sua turma e digite o código de 4 dígitos concedido para selar o desafio!`
  };

  useEffect(() => {
    soundEngine.playBattleStart();
  }, []);

  // Efeito de digitação de diálogo RPG
  useEffect(() => {
    let currentIdx = 0;
    const fullText = dialogues[step];
    setDialogText('');
    
    if (step === 'intro') setEmote('💬');
    else if (step === 'briefing') setEmote('✨');
    else if (step === 'tip') setEmote('💡');
    else if (step === 'action') setEmote('⚔️');

    const interval = setInterval(() => {
      if (currentIdx < fullText.length) {
        setDialogText(fullText.slice(0, currentIdx + 1));
        currentIdx++;
        if (currentIdx % 4 === 0) soundEngine.playClick();
      } else {
        clearInterval(interval);
      }
    }, 18);

    return () => clearInterval(interval);
  }, [step]);

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    try {
      await action();
      soundEngine.playSuccess();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-2 py-6">
      {/* Moldura da Cena de Apresentação RPG */}
      <div className="w-full max-w-4xl rpg-box rpg-box-cyan overflow-hidden bg-slate-950 text-white shadow-[0_0_60px_rgba(0,0,0,0.9)]">
        
        {/* Barra Superior Retrô */}
        <div className="bg-slate-900/90 border-b-2 border-cyan-500/40 px-4 py-2.5 flex items-center justify-between font-pixel text-xs text-cyan-300">
          <span className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-emerald-400 animate-pulse" /> DIÁLOGO DO DESAFIO · MODO HISTÓRIA
          </span>
          <span className="text-[10px] text-amber-300 flex items-center gap-1.5 bg-amber-950/60 border border-amber-500/50 px-2 py-0.5 rounded">
            <Gift className="w-3.5 h-3.5 text-amber-400" /> RECOMPENSA: +{challenge.xpReward} XP · {challenge.coinReward} 🪙
          </span>
        </div>

        {/* Palco Visual de Apresentação com Animação e Cenário */}
        <div className="relative h-72 sm:h-84 w-full overflow-hidden flex items-end justify-between px-6 sm:px-14 pb-4 bg-slate-900">
          <img
            src="/game/battle_arena_rpg.jpg"
            alt="Battle Arena"
            className="absolute inset-0 w-full h-full object-cover opacity-85"
            style={{ imageRendering: 'pixelated' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />

          {/* Lado Esquerdo: Aluno / Herói */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Balão de Reação do Herói */}
            <div className="bg-slate-900/90 border border-emerald-400 px-3 py-1 rounded-full text-xs font-pixel text-emerald-300 mb-2 shadow-lg animate-bounce">
              HERÓI MAKER
            </div>
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-950/80 border-2 border-emerald-400 flex items-center justify-center text-4xl sm:text-5xl shadow-[0_0_25px_rgba(0,255,170,0.4)]">
              🧑
            </div>
          </div>

          {/* Centro: Título do Desafio Flutuante */}
          <div className="relative z-10 text-center max-w-xs sm:max-w-sm mb-4">
            <span className="inline-block font-pixel text-[9px] text-amber-400 bg-amber-950/80 border border-amber-500/60 px-2 py-0.5 rounded mb-1">
              DESAFIO EM ANDAMENTO
            </span>
            <h2 className="font-display font-extrabold text-sm sm:text-base text-white drop-shadow-md">
              {challenge.title}
            </h2>
          </div>

          {/* Lado Direito: NPC Mestre Ada Lovelace com Animação */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Emote Flutuante da Maga */}
            <div className="bg-slate-900/90 border border-cyan-400 w-9 h-9 rounded-full flex items-center justify-center text-lg mb-2 shadow-[0_0_15px_rgba(0,225,255,0.6)] animate-pulse">
              {emote}
            </div>

            {/* Retrato de Ada Lovelace */}
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-3 border-cyan-400 shadow-[0_0_30px_rgba(0,225,255,0.4)] bg-slate-950">
              <img
                src="/game/npc_mage_ada.png"
                alt="Maga Ada"
                className="w-full h-full object-cover animate-[bobFloat_3s_ease-in-out_infinite]"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            <span className="font-pixel text-[10px] text-cyan-300 mt-1">Maga Ada</span>
          </div>
        </div>

        {/* Caixa de Diálogo Visual Novel com Efeito Typewriter */}
        <div className="bg-slate-950 border-t-4 border-[#2e3859] p-4 sm:p-5">
          <div className="rpg-dialogue p-4 mb-4 text-xs sm:text-sm text-slate-100 min-h-[90px] flex items-start gap-3">
            <span className="text-cyan-400 text-base leading-none animate-pulse shrink-0">▶</span>
            <div className="flex-1">
              <span className="font-pixel text-[11px] text-cyan-400 block mb-1">ADA LOVELACE:</span>
              <p className="font-body-stem leading-relaxed">{validationError ? <span className="text-rose-400 font-bold">{validationError}</span> : dialogText}</p>
            </div>
          </div>

          {/* Painéis de Ação Conforme o Passo do Diálogo */}
          {step === 'action' ? (
            <div className="space-y-3">
              {actionType === 'link' && (
                <form
                  className="flex flex-col sm:flex-row gap-2 bg-slate-900 p-3 rounded-lg border-2 border-cyan-500/50 animate-in fade-in duration-200"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!link.trim()) return;
                    void run(() => onCompleteSkillWithLink(link.trim()));
                  }}
                >
                  <input
                    autoFocus
                    required
                    type="url"
                    placeholder="Cole aqui o link do seu projeto (Scratch, Tinkercad, App Inventor...)"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="flex-1 bg-slate-950 text-cyan-300 font-mono text-xs border border-cyan-500/40 rounded px-3 py-2.5 outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    disabled={busy}
                    className="pixel-btn pixel-btn-primary text-xs whitespace-nowrap"
                  >
                    LANÇAR SOLUÇÃO [ENTER]
                  </button>
                </form>
              )}

              {actionType === 'code' && !isAwaitingMethod && (
                <form
                  className="flex flex-col sm:flex-row gap-2 bg-slate-900 p-3 rounded-lg border-2 border-emerald-500/50 animate-in fade-in duration-200"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!code.trim()) return;
                    const action =
                      challenge.kind === 'quest'
                        ? () => onValidateQuestCode(challenge.questId, code.trim())
                        : () => onValidateSkillCode(challenge.skillId, code.trim());
                    void run(action);
                  }}
                >
                  <input
                    autoFocus
                    required
                    placeholder="CÓDIGO DE 4 DÍGITOS DO PROFESSOR"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="flex-1 bg-slate-950 text-emerald-400 font-pixel text-center text-xs tracking-widest border border-emerald-500/40 rounded px-3 py-2.5 outline-none focus:border-emerald-400"
                  />
                  <button
                    type="submit"
                    disabled={busy}
                    className="pixel-btn pixel-btn-primary text-xs whitespace-nowrap"
                  >
                    VALIDAR CÓDIGO [ENTER]
                  </button>
                </form>
              )}

              {/* Opções de Diálogo / Decisão do Herói */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {isAwaitingMethod ? (
                  <>
                    <button
                      onClick={() => setActionType('link')}
                      disabled={busy}
                      className="pixel-btn pixel-btn-primary text-[11px] justify-center py-2.5"
                    >
                      <Link2 className="w-4 h-4" /> ENVIAR LINK
                    </button>
                    <button
                      onClick={() => {
                        void run(onRequestSkillTeacherValidation);
                      }}
                      disabled={busy}
                      className="pixel-btn text-[11px] justify-center py-2.5"
                    >
                      <Key className="w-4 h-4 text-amber-400" /> PEDIR PROFESSOR
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setActionType('code')}
                      disabled={busy}
                      className="pixel-btn pixel-btn-primary text-[11px] justify-center py-2.5"
                    >
                      <Key className="w-4 h-4" /> DIGITAR CÓDIGO
                    </button>
                    <button
                      onClick={() => setActionType('link')}
                      disabled={busy}
                      className="pixel-btn text-[11px] justify-center py-2.5"
                    >
                      <Link2 className="w-4 h-4 text-cyan-400" /> ENVIAR LINK
                    </button>
                  </>
                )}

                <button
                  onClick={() => setStep('tip')}
                  className="pixel-btn text-[11px] justify-center py-2.5 text-slate-300"
                >
                  <Lightbulb className="w-4 h-4 text-amber-400" /> PEDIR DICA
                </button>

                <button
                  onClick={() => void run(onCancel)}
                  disabled={busy}
                  className="pixel-btn pixel-btn-secondary text-[11px] justify-center py-2.5"
                >
                  <X className="w-4 h-4" /> RECUAR
                </button>
              </div>
            </div>
          ) : (
            /* Botões de Avanço do Diálogo */
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={() => void run(onCancel)}
                disabled={busy}
                className="text-xs font-pixel text-slate-400 hover:text-rose-400 flex items-center gap-1.5 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Cancelar Desafio
              </button>

              <div className="flex items-center gap-2">
                {step === 'intro' && (
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setStep('briefing');
                    }}
                    className="pixel-btn pixel-btn-primary text-xs py-2 px-4 font-pixel flex items-center gap-2"
                  >
                    <span>OUVIR BRIEFING</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {(step === 'briefing' || step === 'tip') && (
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setStep('action');
                    }}
                    className="pixel-btn pixel-btn-primary text-xs py-2 px-4 font-pixel flex items-center gap-2"
                  >
                    <span>PROVAR MINHA SOLUÇÃO</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


