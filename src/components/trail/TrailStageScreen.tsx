import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ArrowRight, Map as MapIcon, Zap, Gift, Award, CheckCircle2, 
  HelpCircle, BookOpen, Code2, Cpu, Wrench, Shield, Sparkles, Send, Lock, 
  Volume2, ExternalLink, Play, RotateCcw
} from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';
import { ToolBadgeRow } from '../stem/ToolBadge';
import { SDG_NAMES } from '../../data/sdgGoals';
import { SKILL_QUIZZES, pickSkillQuiz } from '../../data/skillQuizzes';
import type { SkillNode, Quest, SkillQuizQuestion } from '../../types';
import type { TrailNodeStatus } from './TrailNode';

interface TrailStageScreenProps {
  stageIndex: number;
  totalStages: number;
  kind: 'skill' | 'quest';
  skill?: SkillNode;
  quest?: Quest;
  status: TrailNodeStatus;
  userCoins: number;
  userLevel: number;
  authorName?: string;
  onPrevStage?: () => void;
  onNextStage?: () => void;
  onUnlockSkill: (skillId: string) => void;
  onAcceptQuest: (questId: string, xpReward: number, coinReward: number) => void;
  onBackToMap: () => void;
}

type TabKey = 'mission' | 'challenge' | 'workbench' | 'rewards';

export const TrailStageScreen: React.FC<TrailStageScreenProps> = ({
  stageIndex,
  totalStages,
  kind,
  skill,
  quest,
  status,
  userCoins,
  userLevel,
  authorName = 'Herói Maker',
  onPrevStage,
  onNextStage,
  onUnlockSkill,
  onAcceptQuest,
  onBackToMap
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('mission');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [projectLink, setProjectLink] = useState('');
  const [teacherCode, setTeacherCode] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [activeMentor, setActiveMentor] = useState<'ada' | 'byte'>('ada');

  const title = kind === 'skill' ? (skill?.title ?? 'Habilidade') : (quest?.title ?? 'Missão');
  const desc = kind === 'skill' ? (skill?.description ?? '') : (quest?.description ?? '');
  const tier = kind === 'skill' ? skill?.tier : quest?.tier;
  const xpReward = kind === 'skill' ? 200 : (quest?.xpReward ?? 150);
  const coinReward = kind === 'skill' ? 40 : (quest?.coinReward ?? 25);

  const quiz = React.useMemo(() => {
    if (kind === 'skill' && skill) {
      return pickSkillQuiz(SKILL_QUIZZES.filter((q) => q.skillId === skill.id));
    }
    if (kind === 'quest' && quest) {
      return pickSkillQuiz(SKILL_QUIZZES.filter((q) => quest.requiredSkills.includes(q.skillId)));
    }
    return undefined;
  }, [kind, skill, quest]);

  // Cenário de fundo temático baseado na categoria
  const category = kind === 'skill' ? skill?.category : 'PROTOTYPING';
  const getStageTheme = () => {
    switch (category) {
      case 'ELECTRONICS':
        return {
          name: 'Bancada de Circuitos & Robótica',
          accent: '#00e1ff',
          bgGradient: 'from-[#051622] via-[#0a2538] to-[#040f17]',
          icon: '⚡'
        };
      case 'LOGIC':
        return {
          name: 'Santuário da Lógica & Algoritmos',
          accent: '#9d4edd',
          bgGradient: 'from-[#140826] via-[#210d3d] to-[#0a0414]',
          icon: '🧩'
        };
      case 'BLOCKS':
        return {
          name: 'Arena de Jogos & Criatividade',
          accent: '#ffb700',
          bgGradient: 'from-[#241703] via-[#3d2707] to-[#120b01]',
          icon: '🎮'
        };
      case 'DESIGN':
        return {
          name: 'Estúdio de Design & Criação',
          accent: '#ff007f',
          bgGradient: 'from-[#240315] via-[#3b0724] to-[#12010b]',
          icon: '🎨'
        };
      default:
        return {
          name: 'Laboratório Maker & Prototipagem',
          accent: '#00ffaa',
          bgGradient: 'from-[#032415] via-[#073d24] to-[#01120b]',
          icon: '🔧'
        };
    }
  };

  const theme = getStageTheme();

  const handleQuizAnswer = (idx: number) => {
    if (!quiz || selectedAnswer !== null) return;
    setSelectedAnswer(idx);

    if (idx === quiz.correctIndex) {
      soundEngine.playCorrect();
      soundEngine.playSuccess();
      setQuizFeedback('correct');
      if (kind === 'skill' && skill) {
        onUnlockSkill(skill.id);
      } else if (kind === 'quest' && quest) {
        onAcceptQuest(quest.id, quest.xpReward, quest.coinReward);
      }
    } else {
      soundEngine.playWrong();
      setQuizFeedback('wrong');
    }
  };

  const handleValidateSubmission = () => {
    if (!projectLink.trim() && teacherCode !== '1234' && teacherCode.length !== 4) {
      soundEngine.playWrong();
      return;
    }
    soundEngine.playSuccess();
    setSubmissionSuccess(true);
    if (kind === 'skill' && skill) {
      onUnlockSkill(skill.id);
    } else if (kind === 'quest' && quest) {
      onAcceptQuest(quest.id, quest.xpReward, quest.coinReward);
    }
  };

  return (
    <div className="w-full min-h-[85vh] sunflower-box overflow-hidden text-white flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)] animate-in fade-in duration-300">
      
      {/* Top Header com Navegação de Fases e HUD */}
      <div className="bg-[#0e1624] border-b-4 border-[#24354c] p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onBackToMap}
            className="sunflower-btn text-[10px] py-2 px-3 font-pixel flex items-center gap-1.5"
            title="Voltar ao Mapa da Trilha"
          >
            <MapIcon className="w-3.5 h-3.5" /> MAPA
          </button>

          <div className="h-6 w-[2px] bg-slate-700 hidden sm:block" />

          {/* Seletor de Fases Anterior / Próxima */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onPrevStage}
              disabled={stageIndex <= 0}
              className="p-2 rounded bg-slate-800 border border-slate-600 disabled:opacity-30 hover:bg-slate-700 text-cyan-300"
              title="Fase Anterior"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="font-pixel text-[10px] sm:text-xs text-amber-300 px-2">
              FASE {stageIndex + 1} / {totalStages}
            </span>
            <button
              onClick={onNextStage}
              disabled={stageIndex >= totalStages - 1}
              className="p-2 rounded bg-slate-800 border border-slate-600 disabled:opacity-30 hover:bg-slate-700 text-cyan-300"
              title="Próxima Fase"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status / Nível / Recompensas do Desafio */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#162338] px-3 py-1.5 rounded-lg border border-cyan-500/50">
            <span className="text-sm">{theme.icon}</span>
            <span className="font-pixel text-[10px] text-cyan-300 uppercase">{theme.name}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-amber-950/80 px-2.5 py-1.5 rounded-lg border border-amber-500/60 font-pixel text-[10px] text-amber-300">
            <span>+{xpReward} XP</span>
            <span>🪙 +{coinReward} G</span>
          </div>
        </div>
      </div>

      {/* Cenário RPG da Fase (Stage Backdrop com Ada Lovelace e Tinker Byte) */}
      <div className={`relative bg-gradient-to-b ${theme.bgGradient} p-4 sm:p-6 border-b-4 border-[#24354c] overflow-hidden min-h-[220px]`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,225,255,0.15),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Mestra Ada Lovelace */}
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-950 border-4 border-cyan-400 p-1 shadow-[0_0_20px_rgba(0,225,255,0.4)] shrink-0">
              <img
                src="/game/npc_mage_ada.png"
                alt="Ada Lovelace"
                className="w-full h-full object-cover rounded-xl"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            <div>
              <span className="font-pixel text-[10px] text-cyan-400 block">MESTRA DA LÓGICA</span>
              <h3 className="font-pixel text-xs sm:text-sm text-white">Ada Lovelace</h3>
              <p className="text-[11px] font-body-stem text-slate-300 mt-1 max-w-xs leading-snug">
                "Herói {authorName}, compreenda o algoritmo por trás deste desafio para expandir seu poder!"
              </p>
            </div>
          </div>

          {/* Destaque Central do Desafio */}
          <div className="text-center my-2 md:my-0">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 border-4 border-amber-400 text-3xl shadow-[0_0_25px_rgba(255,183,0,0.4)] animate-[bobFloat_2.4s_ease-in-out_infinite]">
              {kind === 'skill' ? (skill?.icon ?? '⚡') : '📜'}
            </div>
            <h2 className="font-pixel text-sm sm:text-base text-amber-300 mt-2">{title}</h2>
            <span className="font-pixel text-[9px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
              TIER: {tier} · {status === 'completed' ? 'CONCLUÍDO ✓' : status === 'available' ? 'DISPONÍVEL ⚡' : 'BLOQUEADO 🔒'}
            </span>
          </div>

          {/* Tinker Byte */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="font-pixel text-[10px] text-amber-400 block">ENG. MECHATRONICS</span>
              <h3 className="font-pixel text-xs sm:text-sm text-white">Tinker Byte</h3>
              <p className="text-[11px] font-body-stem text-slate-300 mt-1 max-w-xs leading-snug">
                "Bip-bup! Conectei as bancadas. Teste suas conexões e circuitos!"
              </p>
            </div>
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-950 border-4 border-amber-400 p-2 shadow-[0_0_20px_rgba(255,183,0,0.4)] shrink-0">
              <img
                src="/avatars/avatar-robot-engineer.svg"
                alt="Tinker Byte"
                className="w-full h-full object-contain"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Abas Interativas */}
      <div className="bg-[#101726] border-b-2 border-[#24354c] px-4 flex items-center gap-2 overflow-x-auto">
        {[
          { key: 'mission', label: '1. MISSÃO & GUIA', icon: <BookOpen className="w-3.5 h-3.5" /> },
          { key: 'challenge', label: '2. ENIGMA & QUIZ', icon: <Zap className="w-3.5 h-3.5" /> },
          { key: 'workbench', label: '3. BANCADA & ENVIO', icon: <Wrench className="w-3.5 h-3.5" /> },
          { key: 'rewards', label: '4. CONQUISTAS', icon: <Award className="w-3.5 h-3.5" /> }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              soundEngine.playClick();
              setActiveTab(tab.key as TabKey);
            }}
            className={`py-3 px-4 font-pixel text-[10px] flex items-center gap-2 border-b-2 transition-all shrink-0 ${activeTab === tab.key ? 'border-amber-400 text-amber-300 bg-slate-900/60 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Conteúdo Dinâmico da Aba Selecionada */}
      <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-[#0a0f18]">
        
        {/* ABA 1: Missão & Guia Pedagógico */}
        {activeTab === 'mission' && (
          <div className="max-w-3xl mx-auto space-y-5 animate-in fade-in duration-200">
            <div className="bg-[#121c2d] border-2 border-[#2b3e5c] rounded-xl p-4">
              <h3 className="font-pixel text-xs text-cyan-300 mb-2">OBJETIVO DA FASE</h3>
              <p className="font-body-stem text-sm text-slate-200 leading-relaxed">
                {desc}
              </p>
            </div>

            {/* Hardware & ODS da ONU */}
            {quest && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#121c2d] border-2 border-[#2b3e5c] rounded-xl p-4">
                  <h4 className="font-pixel text-[10px] text-amber-300 mb-2">FERRAMENTAS NECESSÁRIAS</h4>
                  {quest.hardwareRequired.length > 0 ? (
                    <ToolBadgeRow tools={quest.hardwareRequired} size="sm" />
                  ) : (
                    <span className="text-xs text-slate-400">Nenhum hardware externo exigido</span>
                  )}
                </div>

                <div className="bg-[#121c2d] border-2 border-[#2b3e5c] rounded-xl p-4">
                  <h4 className="font-pixel text-[10px] text-purple-300 mb-2">METAS ODS DA ONU</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {quest.sdgGoals.map((g) => (
                      <span key={g} className="text-[10px] font-pixel bg-purple-950 text-purple-300 border border-purple-500/60 px-2 py-1 rounded">
                        ODS {g}: {SDG_NAMES[g]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tutorial Passo a Passo do Grimório */}
            {quest?.guideContent ? (
              <div className="bg-[#0e1624] border-2 border-slate-700 rounded-xl p-4 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                {quest.guideContent}
              </div>
            ) : (
              <div className="bg-[#0e1624] border-2 border-slate-800 rounded-xl p-4 text-center text-slate-400 font-body-stem text-xs">
                💡 Dica de Ada: Avance para a aba "Enigma & Quiz" ou "Bancada Maker" para provar sua maestria!
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setActiveTab('challenge')}
                className="sunflower-btn sunflower-btn-cyber text-[10px] py-2 px-5 font-pixel flex items-center gap-2"
              >
                <span>IR PARA O ENIGMA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ABA 2: Enigma & Quiz de Código */}
        {activeTab === 'challenge' && (
          <div className="max-w-2xl mx-auto space-y-5 animate-in fade-in duration-200">
            {quiz ? (
              <div className="space-y-4">
                <div className="bg-[#132034] p-4 rounded-xl border-2 border-cyan-500/60">
                  <span className="font-pixel text-[10px] text-cyan-400 block mb-1">DECIFRE A CHAVE DESTE NÓ:</span>
                  <p className="font-body-stem text-sm text-white font-semibold leading-relaxed">
                    {quiz.question}
                  </p>
                </div>

                <div className="space-y-2.5">
                  {quiz.options.map((opt, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = isSelected && quizFeedback === 'correct';
                    const isWrong = isSelected && quizFeedback === 'wrong';

                    return (
                      <button
                        key={idx}
                        onClick={() => handleQuizAnswer(idx)}
                        disabled={selectedAnswer !== null}
                        className={`w-full text-left font-body-stem text-xs p-3.5 rounded-xl border-2 transition-all flex items-center gap-3 ${
                          isCorrect
                            ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 font-bold shadow-[0_0_15px_rgba(46,204,113,0.4)]'
                            : isWrong
                              ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                              : 'bg-[#101726] border-[#25374e] text-slate-200 hover:border-cyan-400 hover:bg-[#162238]'
                        }`}
                      >
                        <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 font-pixel text-xs text-cyan-300 flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {quizFeedback === 'correct' && (
                  <div className="bg-emerald-950/90 border-2 border-emerald-400 p-4 rounded-xl text-center space-y-2 animate-in zoom-in-95">
                    <p className="font-pixel text-xs text-emerald-300">✓ RESPOSTA CORRETA! NÓ DESBLOQUEADO!</p>
                    <p className="text-xs font-body-stem text-slate-200">
                      Você conquistou +{xpReward} XP e 🪙 +{coinReward} Moedas!
                    </p>
                    <button
                      onClick={() => setActiveTab('rewards')}
                      className="sunflower-btn sunflower-btn-gold text-[10px] py-1.5 px-4 font-pixel"
                    >
                      VER RECOMPENSAS
                    </button>
                  </div>
                )}

                {quizFeedback === 'wrong' && (
                  <div className="bg-rose-950/90 border-2 border-rose-500 p-4 rounded-xl text-center space-y-2 animate-in zoom-in-95">
                    <p className="font-pixel text-xs text-rose-300">💥 CIRCUITO INTERROMPIDO!</p>
                    <p className="text-xs font-body-stem text-slate-200">
                      Tinker Byte recalculou os sensores. Tente novamente!
                    </p>
                    <button
                      onClick={() => {
                        setSelectedAnswer(null);
                        setQuizFeedback(null);
                      }}
                      className="sunflower-btn text-[10px] py-1.5 px-4 font-pixel bg-amber-500 text-slate-950"
                    >
                      TENTAR DE NOVO
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#121c2d] border-2 border-[#2b3e5c] rounded-xl p-6 text-center space-y-3">
                <p className="font-pixel text-xs text-amber-300">ESTE É UM DESAFIO DE PROJETO PRÁTICO!</p>
                <p className="text-xs font-body-stem text-slate-300">
                  Submeta o link do seu projeto construído ou valide presencialmente na bancada com seu professor.
                </p>
                <button
                  onClick={() => setActiveTab('workbench')}
                  className="sunflower-btn sunflower-btn-cyber text-[10px] py-2 px-5 font-pixel"
                >
                  ABRIR BANCADA MAKER
                </button>
              </div>
            )}
          </div>
        )}

        {/* ABA 3: Bancada & Validação Maker */}
        {activeTab === 'workbench' && (
          <div className="max-w-2xl mx-auto space-y-5 animate-in fade-in duration-200">
            <div className="bg-[#121c2d] border-2 border-[#2b3e5c] rounded-xl p-4 space-y-3">
              <h3 className="font-pixel text-xs text-cyan-300">SUBMISSÃO DO PROJETO MAKER</h3>
              <p className="text-xs font-body-stem text-slate-300">
                Insira o link público do seu projeto no <strong>Scratch</strong>, <strong>Tinkercad</strong>, <strong>App Inventor</strong> ou <strong>GitHub</strong>:
              </p>

              <input
                value={projectLink}
                onChange={(e) => setProjectLink(e.target.value)}
                placeholder="https://scratch.mit.edu/projects/..."
                className="w-full bg-slate-900 text-cyan-300 text-xs font-mono p-3 rounded-xl border border-slate-700 outline-none focus:border-cyan-400"
              />

              <div className="pt-2 border-t border-slate-700/60">
                <label className="font-pixel text-[10px] text-amber-400 block mb-1.5">
                  OU VALIDAÇÃO PRESENCIAL (CÓDIGO DE 4 DÍGITOS DO PROFESSOR):
                </label>
                <input
                  value={teacherCode}
                  onChange={(e) => setTeacherCode(e.target.value)}
                  placeholder="Ex: 1234"
                  maxLength={4}
                  className="w-40 bg-slate-900 text-amber-300 font-pixel text-center text-xs p-2.5 rounded-xl border border-amber-500/50 outline-none focus:border-amber-400"
                />
              </div>

              <button
                onClick={handleValidateSubmission}
                className="sunflower-btn sunflower-btn-gold text-[10px] py-2.5 px-6 font-pixel w-full justify-center mt-3"
              >
                <Send className="w-4 h-4" /> ENVIAR SOLUÇÃO MAKER
              </button>
            </div>

            {submissionSuccess && (
              <div className="bg-emerald-950 border-2 border-emerald-400 p-4 rounded-xl text-center space-y-1 animate-in zoom-in-95">
                <p className="font-pixel text-xs text-emerald-300">✓ PROJETO VALIDADO COM SUCESSO!</p>
                <p className="text-xs font-body-stem text-slate-300">Parabéns herói! O Game Master aprovou sua entrega.</p>
              </div>
            )}
          </div>
        )}

        {/* ABA 4: Conquistas & Recompensas */}
        {activeTab === 'rewards' && (
          <div className="max-w-xl mx-auto text-center space-y-4 animate-in fade-in duration-200">
            <div className="w-20 h-20 rounded-2xl bg-slate-900 border-4 border-amber-400 text-4xl flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(255,183,0,0.5)] animate-bounce">
              🏆
            </div>

            <div>
              <h3 className="font-pixel text-sm text-amber-300">RECOMPENSAS CONQUISTADAS</h3>
              <p className="text-xs font-body-stem text-slate-300 mt-1">
                Você conquistou maestria em "{title}"!
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <div className="bg-[#121c2d] border border-cyan-500/60 p-3 rounded-xl min-w-[120px]">
                <span className="font-pixel text-xs text-purple-300 block">+{xpReward} XP</span>
                <span className="text-[10px] text-slate-400">Progresso</span>
              </div>
              <div className="bg-[#121c2d] border border-amber-500/60 p-3 rounded-xl min-w-[120px]">
                <span className="font-pixel text-xs text-amber-300 block">🪙 +{coinReward} G</span>
                <span className="text-[10px] text-slate-400">Ouro Maker</span>
              </div>
            </div>

            <div className="pt-3 flex justify-center gap-3">
              <button
                onClick={onBackToMap}
                className="sunflower-btn text-[10px] py-2 px-5 font-pixel"
              >
                VOLTAR AO MAPA
              </button>
              {onNextStage && (
                <button
                  onClick={onNextStage}
                  className="sunflower-btn sunflower-btn-gold text-[10px] py-2 px-5 font-pixel flex items-center gap-1.5"
                >
                  <span>PRÓXIMA FASE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
