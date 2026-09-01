import React, { useState, useEffect, useRef } from 'react';
import { X, Zap, Gift, Sparkles, CheckCircle2, AlertCircle, ArrowRight, MessageSquare, BookOpen, Volume2, Shield } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';
import type { SkillNode, Quest, SkillQuizQuestion } from '../../types';
import type { TrailNodeStatus } from './TrailNode';

interface TrailDialogueGameModalProps {
  kind: 'skill' | 'quest';
  skill?: SkillNode;
  quest?: Quest;
  quiz?: SkillQuizQuestion;
  status: TrailNodeStatus;
  authorName?: string;
  onSuccessUnlock: () => void;
  onClose: () => void;
}

type DialoguePhase = 'intro' | 'challenge' | 'solved' | 'failed';

interface Character {
  name: string;
  title: string;
  avatarImg: string;
  avatarIcon: string;
  color: string;
  glowColor: string;
}

const CHAR_ADA: Character = {
  name: 'Maga Ada Lovelace',
  title: 'Mestra da Lógica & Grimório Digital',
  avatarImg: '/game/npc_mage_ada.png',
  avatarIcon: '🧙‍♀️',
  color: '#00e1ff',
  glowColor: 'rgba(0, 225, 255, 0.4)'
};

const CHAR_BYTE: Character = {
  name: 'Tinker Byte',
  title: 'Robô Inventor & Mecha-Mascote',
  avatarImg: '/avatars/avatar-robot-engineer.svg',
  avatarIcon: '🤖',
  color: '#ffb700',
  glowColor: 'rgba(255, 183, 0, 0.4)'
};

export const TrailDialogueGameModal: React.FC<TrailDialogueGameModalProps> = ({
  kind,
  skill,
  quest,
  quiz,
  status,
  authorName = 'Herói Maker',
  onSuccessUnlock,
  onClose
}) => {
  const [phase, setPhase] = useState<DialoguePhase>(status === 'completed' ? 'solved' : 'intro');
  const [activeSpeaker, setActiveSpeaker] = useState<'ada' | 'byte'>('ada');
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(25);
  const [typewriterText, setTypewriterText] = useState('');

  const nodeTitle = kind === 'skill' ? (skill?.title ?? 'Habilidade') : (quest?.title ?? 'Missão');
  const nodeDesc = kind === 'skill' ? (skill?.description ?? '') : (quest?.description ?? '');
  const xpReward = kind === 'skill' ? 200 : (quest?.xpReward ?? 150);
  const coinReward = kind === 'skill' ? 40 : (quest?.coinReward ?? 25);

  // Roteiro dinâmico de diálogo entre Ada e Byte adaptado ao nó
  const dialogueLines = [
    {
      speaker: 'ada' as const,
      text: `Bem-vindo a este marco da Trilha, ${authorName}! O portal de "${nodeTitle}" pulsa com energia ancestral de algoritmos.`,
      emote: '✨'
    },
    {
      speaker: 'byte' as const,
      text: `Bip-bup! Meus sensores ópticos detectaram novos componentes! ${nodeDesc}`,
      emote: '⚙️'
    },
    {
      speaker: 'ada' as const,
      text: quiz
        ? `Para avançarmos e gravarmos essa maestria no seu grimório, decifre o seguinte enigma técnico!`
        : `Prepare suas ferramentas maker! Vamos desbloquear este marco com glória!`,
      emote: '📜'
    }
  ];

  const currentLine = dialogueLines[dialogueIndex] || dialogueLines[0];

  // Efeito Máquina de Escrever
  useEffect(() => {
    if (phase !== 'intro') return;
    const fullText = currentLine.text;
    setTypewriterText('');
    let idx = 0;
    const timer = setInterval(() => {
      idx++;
      setTypewriterText(fullText.slice(0, idx));
      if (idx % 3 === 0) soundEngine.playClick();
      if (idx >= fullText.length) clearInterval(timer);
    }, 22);

    return () => clearInterval(timer);
  }, [dialogueIndex, phase, currentLine.text]);

  // Cronômetro da fase de desafio
  useEffect(() => {
    if (phase !== 'challenge') return;
    if (timeLeft <= 0) {
      soundEngine.playWrong();
      setPhase('failed');
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, timeLeft]);

  const handleNextDialogue = () => {
    soundEngine.playClick();
    if (dialogueIndex < dialogueLines.length - 1) {
      setDialogueIndex((i) => i + 1);
      setActiveSpeaker(dialogueLines[dialogueIndex + 1].speaker);
    } else {
      if (quiz) {
        soundEngine.playBattleStart?.();
        setPhase('challenge');
      } else {
        handleSuccess();
      }
    }
  };

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null || !quiz) return;
    setSelectedOption(idx);

    if (idx === quiz.correctIndex) {
      soundEngine.playCorrect();
      soundEngine.playSuccess();
      setPhase('solved');
      onSuccessUnlock();
    } else {
      soundEngine.playWrong();
      setPhase('failed');
    }
  };

  const handleRetry = () => {
    soundEngine.playClick();
    setSelectedOption(null);
    setTimeLeft(25);
    setPhase('challenge');
  };

  const handleSuccess = () => {
    soundEngine.playSuccess();
    setPhase('solved');
    onSuccessUnlock();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-3xl sunflower-box overflow-hidden flex flex-col max-h-[92vh] text-white shadow-[0_0_50px_rgba(0,225,255,0.25)]">
        
        {/* Header RPG do Nó */}
        <div className="bg-[#101724] border-b-2 border-[#22334a] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-400 flex items-center justify-center text-xl shadow-[0_0_10px_rgba(0,225,255,0.4)]">
              {kind === 'skill' ? (skill?.icon ?? '⚡') : '📜'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-pixel text-xs text-cyan-300 uppercase">{nodeTitle}</h2>
                <span className="font-pixel text-[9px] bg-slate-800 text-slate-300 border border-slate-600 px-1.5 py-0.5 rounded">
                  {kind === 'skill' ? 'HABILIDADE' : 'MISSÃO'}
                </span>
              </div>
              <p className="text-[11px] font-body-stem text-slate-400">
                Guardiões da Trilha: Ada & Tinker Byte
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-300 hover:text-white hover:bg-rose-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Palco dos Personagens (Character Visual Novel Stage) */}
        <div className="relative bg-gradient-to-b from-[#0c1424] via-[#101b30] to-[#0a0f1a] p-4 sm:p-6 border-b-2 border-[#1e2c40] flex items-center justify-between min-h-[220px] overflow-hidden">
          {/* Fundo com grade cibernética suave */}
          <div className="absolute inset-0 bg-[radial-gradient(#00e1ff15_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Personagem 1: Maga Ada Lovelace */}
          <div
            className={`relative flex flex-col items-center transition-all duration-300 ${
              activeSpeaker === 'ada' || phase === 'solved'
                ? 'scale-105 opacity-100 z-10'
                : 'scale-95 opacity-60'
            }`}
          >
            <div
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-900 border-4 flex items-center justify-center p-1 shadow-2xl relative"
              style={{
                borderColor: CHAR_ADA.color,
                boxShadow: activeSpeaker === 'ada' ? `0 0 25px ${CHAR_ADA.glowColor}` : 'none'
              }}
            >
              <img
                src={CHAR_ADA.avatarImg}
                alt={CHAR_ADA.name}
                className="w-full h-full object-cover rounded-xl"
                style={{ imageRendering: 'pixelated' }}
              />
              {activeSpeaker === 'ada' && (
                <div className="absolute -top-3 -right-2 text-lg bg-cyan-950 border border-cyan-400 rounded-full w-7 h-7 flex items-center justify-center animate-bounce">
                  💬
                </div>
              )}
            </div>
            <span className="mt-2 font-pixel text-[10px] text-cyan-300 font-bold">{CHAR_ADA.name}</span>
            <span className="text-[9px] font-body-stem text-slate-400">Mestra da Lógica</span>
          </div>

          {/* Centro: Ícone do Nó / Duelo de Ideias */}
          <div className="flex flex-col items-center justify-center z-10 px-2 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-900/90 border-2 border-amber-400 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(255,183,0,0.4)] animate-[bobIdle_2.4s_ease-in-out_infinite]">
              {kind === 'skill' ? (skill?.icon ?? '⚡') : '📜'}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="font-pixel text-[9px] bg-purple-950/80 text-purple-300 border border-purple-500/60 px-2 py-0.5 rounded">
                +{xpReward} XP
              </span>
              <span className="font-pixel text-[9px] bg-amber-950/80 text-amber-300 border border-amber-500/60 px-2 py-0.5 rounded">
                🪙 +{coinReward} G
              </span>
            </div>
          </div>

          {/* Personagem 2: Tinker Byte */}
          <div
            className={`relative flex flex-col items-center transition-all duration-300 ${
              activeSpeaker === 'byte'
                ? 'scale-105 opacity-100 z-10'
                : 'scale-95 opacity-60'
            }`}
          >
            <div
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-900 border-4 flex items-center justify-center p-2 shadow-2xl relative"
              style={{
                borderColor: CHAR_BYTE.color,
                boxShadow: activeSpeaker === 'byte' ? `0 0 25px ${CHAR_BYTE.glowColor}` : 'none'
              }}
            >
              <img
                src={CHAR_BYTE.avatarImg}
                alt={CHAR_BYTE.name}
                className="w-full h-full object-contain"
                style={{ imageRendering: 'pixelated' }}
              />
              {activeSpeaker === 'byte' && (
                <div className="absolute -top-3 -left-2 text-lg bg-amber-950 border border-amber-400 rounded-full w-7 h-7 flex items-center justify-center animate-bounce">
                  💡
                </div>
              )}
            </div>
            <span className="mt-2 font-pixel text-[10px] text-amber-400 font-bold">{CHAR_BYTE.name}</span>
            <span className="text-[9px] font-body-stem text-slate-400">Engenheiro Mecha</span>
          </div>
        </div>

        {/* Área de Conteúdo / Diálogo / Desafio */}
        <div className="p-5 overflow-y-auto flex-1 bg-[#0b111d] flex flex-col justify-between">
          
          {/* FASE 1: Diálogo Narrativo (Visual Novel) */}
          {phase === 'intro' && (
            <div className="space-y-4">
              <div className="bg-[#111c2e] border-2 border-[#2b3e5c] rounded-xl p-4 shadow-inner">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="font-pixel text-[11px] font-bold"
                    style={{ color: currentLine.speaker === 'ada' ? CHAR_ADA.color : CHAR_BYTE.color }}
                  >
                    [{currentLine.speaker === 'ada' ? CHAR_ADA.name : CHAR_BYTE.name}]
                  </span>
                  <span className="text-sm">{currentLine.emote}</span>
                </div>
                <p className="font-body-stem text-sm text-slate-200 leading-relaxed min-h-[50px]">
                  "{typewriterText}"
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleNextDialogue}
                  className="sunflower-btn sunflower-btn-cyber text-[10px] py-2 px-4 font-pixel flex items-center gap-2"
                >
                  <span>{dialogueIndex < dialogueLines.length - 1 ? 'CONTINUAR' : (quiz ? 'IR PARA O DESAFIO' : 'CONCLUIR')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* FASE 2: Desafio Técnico / Pergunta do Quiz */}
          {phase === 'challenge' && quiz && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-[#111c2e] border border-cyan-500/40 px-3 py-2 rounded-lg">
                <div className="flex items-center gap-2 text-cyan-300 font-pixel text-[10px]">
                  <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span>ENIGMA TÉCNICO · DECIFRE A OPÇÃO CORRETA:</span>
                </div>
                <span className={`font-pixel text-xs ${timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-amber-300'}`}>
                  ⏳ {timeLeft}s
                </span>
              </div>

              <div className="bg-[#132034] p-3.5 rounded-xl border-2 border-slate-700">
                <p className="font-body-stem text-sm text-white font-semibold leading-relaxed">
                  {quiz.question}
                </p>
              </div>

              {/* Opções de Resposta Pixel Art */}
              <div className="grid grid-cols-1 gap-2.5">
                {quiz.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className="w-full text-left font-body-stem text-xs p-3 rounded-xl border-2 bg-[#0e1624] border-[#25374e] text-slate-200 hover:border-cyan-400 hover:bg-[#162238] transition-all flex items-center gap-3 group"
                  >
                    <span className="w-6 h-6 rounded bg-slate-900 border border-slate-700 font-pixel text-[10px] text-cyan-300 flex items-center justify-center group-hover:border-cyan-400 group-hover:bg-cyan-950">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* FASE 3: Vitória & Desbloqueio */}
          {phase === 'solved' && (
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center text-3xl mx-auto shadow-[0_0_25px_rgba(46,204,113,0.5)] animate-bounce">
                🎉
              </div>

              <div>
                <h3 className="font-pixel text-sm text-emerald-400 mb-1">MARCO CONQUISTADO COM SUCESSO!</h3>
                <p className="font-body-stem text-xs text-slate-300 max-w-md mx-auto">
                  Ada e Tinker Byte celebraram sua maestria lógica! O caminho da Trilha foi expandido.
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 bg-[#111c2e] p-3 rounded-xl max-w-xs mx-auto border border-emerald-500/50">
                <span className="font-pixel text-xs text-purple-300">+{xpReward} XP</span>
                <span className="font-pixel text-xs text-amber-300">🪙 +{coinReward} G</span>
              </div>

              <button
                onClick={onClose}
                className="sunflower-btn sunflower-btn-gold text-[10px] py-2 px-6 font-pixel mx-auto block"
              >
                AVANÇAR NA JORNADA
              </button>
            </div>
          )}

          {/* FASE 4: Curto-Circuito / Erro */}
          {phase === 'failed' && (
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-rose-950 border-2 border-rose-500 text-rose-300 flex items-center justify-center text-3xl mx-auto shadow-[0_0_25px_rgba(244,63,94,0.5)]">
                💥
              </div>

              <div>
                <h3 className="font-pixel text-sm text-rose-400 mb-1">CURTO-CIRCUITO LÓGICO!</h3>
                <p className="font-body-stem text-xs text-slate-300 max-w-md mx-auto">
                  Byte soltou fumaça pelos circuitos! Não se preocupe, um verdadeiro maker aprende com as iterações.
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={handleRetry}
                  className="sunflower-btn text-[10px] py-2 px-5 font-pixel bg-amber-500 text-slate-950 border-amber-400"
                >
                  TENTAR NOVAMENTE
                </button>
                <button
                  onClick={onClose}
                  className="pixel-btn text-[10px] py-2 px-4 text-slate-400"
                >
                  RECUAR
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
