import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Bot, PlusCircle, Globe, CheckCircle, BookOpen, Key, Target, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/stem/Card';
import { Button } from '../../components/stem/Button';
import type { Quest, SDGGoal, SkillTier } from '../../types';
import { SDG_NAMES, SDG_COLORS, ALL_SDG_GOALS } from '../../data/sdgGoals';
import { ToolBadgeRow } from '../../components/stem/ToolBadge';
import { QuestGuideModal } from '../../components/stem/QuestGuideModal';
import type { ClassOutletContext } from './ClassLayout';

const TIER_BADGE: Record<SkillTier, string> = {
  BASIC: 'bg-stem-teal/15 text-stem-teal',
  INTERMEDIATE: 'bg-stem-violet/15 text-stem-violet',
  ADVANCED: 'bg-stem-amber/15 text-stem-amber',
  SPECIALIST: 'bg-stem-coral/15 text-stem-coral'
};

// A escada de 6 projetos da Trilha do Eletricista Iniciante. Níveis 2 e 4
// usam projetos que já existem no catálogo real (Semáforo Inteligente,
// Monitor Ambiental com LCD) — não duplicados aqui, só referenciados no
// texto; os outros 4 têm quest própria no mural abaixo.
const BEGINNER_LADDER: Array<{ step: number; title: string; tier: SkillTier; icon: string; blurb: string }> = [
  { step: 1, title: 'Primeira Luz: Acendendo um LED', tier: 'BASIC', icon: '💡', blurb: 'Polaridade, resistor e o primeiro digitalWrite().' },
  { step: 2, title: 'Semáforo Inteligente', tier: 'BASIC', icon: '🚦', blurb: 'Sequência de 3 LEDs com tempos de espera.' },
  { step: 3, title: 'Ronda Sonora: Detector de Palmas', tier: 'INTERMEDIATE', icon: '🎤', blurb: 'Primeiro sensor: som, debounce e sinal digital.' },
  { step: 4, title: 'Monitor Ambiental com LCD', tier: 'BASIC', icon: '🌡️', blurb: 'Temperatura, umidade e um display físico.' },
  { step: 5, title: 'Radar Giratório: Vigia de 180°', tier: 'ADVANCED', icon: '📡', blurb: 'Servo + ultrassônico varrendo o ambiente.' },
  { step: 6, title: 'Central de Vigilância: Painel Multissensor', tier: 'ADVANCED', icon: '🛰️', blurb: 'Todos os sensores juntos, sem delay() bloqueante.' }
];

export const MissoesPage: React.FC = () => {
  const { quests, handleAcceptQuest, handleValidateQuest, validationError, handleProposeQuest, handleGenerateAIQuest } =
    useOutletContext<ClassOutletContext>();
  const { profile } = useAuth();
  const [filter, setFilter] = useState<SDGGoal | 'ALL'>('ALL');
  const [showPropose, setShowPropose] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sdg, setSdg] = useState<SDGGoal>('4');
  const [generating, setGenerating] = useState(false);
  const [guideQuest, setGuideQuest] = useState<Quest | null>(null);
  const [codeInputs, setCodeInputs] = useState<Record<string, string>>({});

  const filtered = quests.filter((q) => filter === 'ALL' || q.sdgGoals.includes(filter));

  const handleAiClick = async () => {
    setGenerating(true);
    try {
      await handleGenerateAIQuest();
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-stem-ink">Mural de Missões</h1>
          <p className="font-body-stem text-sm text-stem-ink-soft">
            Desafios reais alinhados às metas da ONU (ODS).
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={handleAiClick} disabled={generating}>
            <Bot className="w-4 h-4" /> {generating ? 'Gerando...' : 'Sugerir com IA'}
          </Button>
          <Button onClick={() => setShowPropose(true)}>
            <PlusCircle className="w-4 h-4" /> Propor missão
          </Button>
        </div>
      </div>

      <Card accent="teal" className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-stem-teal" />
          <h2 className="font-display font-extrabold text-stem-ink">Trilha do Eletricista Iniciante</h2>
        </div>
        <p className="font-body-stem text-sm text-stem-ink-soft -mt-2">
          Seis projetos, do primeiro LED a um painel com quatro sensores ao mesmo tempo. Cada um destrava o material do próximo no laboratório.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {BEGINNER_LADDER.map((step) => (
            <div key={step.step} className="relative rounded-2xl border-2 border-stem-line bg-stem-cloud p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{step.icon}</span>
                <span className={`text-[10px] font-display font-bold px-2 py-0.5 rounded-full ${TIER_BADGE[step.tier]}`}>
                  Nível {step.step}
                </span>
              </div>
              <p className="font-display font-bold text-xs text-stem-ink leading-snug">{step.title}</p>
              <p className="text-[11px] font-body-stem text-stem-ink-soft leading-snug">{step.blurb}</p>
            </div>
          ))}
        </div>
        <Link to="../lab" className="inline-flex items-center gap-1.5 text-sm font-display font-bold text-stem-teal hover:underline">
          Aprender a teoria no Maker Lab <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </Card>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`text-xs font-display font-bold px-3 py-1.5 rounded-full border-2 ${
            filter === 'ALL' ? 'bg-stem-teal text-white border-stem-teal' : 'border-stem-line text-stem-ink-soft'
          }`}
        >
          <Globe className="w-3.5 h-3.5 inline mr-1" /> Todas
        </button>
        {ALL_SDG_GOALS.map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`text-xs font-display font-bold px-3 py-1.5 rounded-full border-2 ${
              filter === key ? 'bg-stem-teal text-white border-stem-teal' : 'border-stem-line text-stem-ink-soft'
            }`}
          >
            ODS {key}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((q) => {
          const completed = q.status === 'COMPLETED';
          return (
            <Card key={q.id} accent={completed ? 'teal' : 'amber'} className="flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display font-bold text-stem-ink">{q.title}</h3>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-display font-bold text-stem-violet">+{q.xpReward} XP</p>
                    <p className="text-xs font-display font-bold text-stem-amber">🪙 {q.coinReward}</p>
                  </div>
                </div>
                <p className="text-sm font-body-stem text-stem-ink-soft">{q.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {q.sdgGoals.map((s) => (
                    <span key={s} className={`text-xs font-display font-bold ${SDG_COLORS[s]}`}>
                      ODS {s} · {SDG_NAMES[s]}
                    </span>
                  ))}
                </div>
                {q.hardwareRequired.length > 0 && <ToolBadgeRow tools={q.hardwareRequired} size="sm" />}
                {(q.grade || q.duration) && (
                  <p className="text-xs font-body-stem text-stem-ink-soft/80">
                    {q.grade}
                    {q.grade && q.duration ? ' · ' : ''}
                    {q.duration}
                  </p>
                )}
              </div>
              <div className="pt-4 space-y-2">
                {q.guideContent && (
                  <Button fullWidth variant="ghost" onClick={() => setGuideQuest(q)}>
                    <BookOpen className="w-4 h-4" /> Ver tutorial completo
                  </Button>
                )}
                {completed && (
                  <div className="flex items-center justify-center gap-2 text-stem-teal font-display font-bold text-sm py-2">
                    <CheckCircle className="w-4 h-4" /> Concluída
                  </div>
                )}
                {q.status === 'PROPOSED' && (
                  <Button fullWidth variant="secondary" disabled>
                    Aguardando aprovação
                  </Button>
                )}
                {q.status === 'ACTIVE' && (
                  <Button fullWidth variant="secondary" onClick={() => handleAcceptQuest(q.id, q.xpReward, q.coinReward)}>
                    Aceitar desafio
                  </Button>
                )}
                {q.status === 'PENDING_VALIDATION' &&
                  (q.pendingValidationStudentUid === profile?.uid ? (
                    <form
                      className="flex gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleValidateQuest(q.id, codeInputs[q.id] ?? '');
                      }}
                    >
                      <input
                        required
                        placeholder="Código do professor"
                        value={codeInputs[q.id] ?? ''}
                        onChange={(e) => setCodeInputs((prev) => ({ ...prev, [q.id]: e.target.value }))}
                        className="flex-1 min-w-0 rounded-xl border-2 border-stem-line px-3 py-2.5 text-center font-display font-bold tracking-widest outline-none focus:border-stem-teal"
                      />
                      <Button type="submit">
                        <Key className="w-4 h-4" /> Validar
                      </Button>
                    </form>
                  ) : (
                    <Button fullWidth variant="ghost" disabled>
                      {q.pendingValidationStudentName ?? 'Um colega'} está validando com o Game Master
                    </Button>
                  ))}
                {q.status === 'PENDING_VALIDATION' && q.pendingValidationStudentUid === profile?.uid && validationError && (
                  <p className="text-xs text-stem-coral font-body-stem text-center">{validationError}</p>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {showPropose && (
        <div className="fixed inset-0 z-50 bg-stem-ink/40 backdrop-blur-sm flex items-center justify-center p-4">
          <Card accent="violet" className="w-full max-w-md">
            <h3 className="font-display font-extrabold text-stem-ink mb-4">Propor missão ao Mestre</h3>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!title.trim()) return;
                handleProposeQuest(title, description, [sdg]);
                setShowPropose(false);
                setTitle('');
                setDescription('');
              }}
            >
              <input
                required
                placeholder="Título da missão"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border-2 border-stem-line px-3 py-2.5 font-body-stem outline-none focus:border-stem-violet"
              />
              <textarea
                placeholder="Descrição e utilidade..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border-2 border-stem-line px-3 py-2.5 font-body-stem h-24 outline-none focus:border-stem-violet"
              />
              <select
                value={sdg}
                onChange={(e) => setSdg(e.target.value as SDGGoal)}
                className="w-full rounded-xl border-2 border-stem-line px-3 py-2.5 font-body-stem outline-none focus:border-stem-violet"
              >
                {ALL_SDG_GOALS.map((key) => (
                  <option key={key} value={key}>
                    ODS {key} — {SDG_NAMES[key]}
                  </option>
                ))}
              </select>
              <div className="flex gap-3">
                <Button type="button" variant="ghost" fullWidth onClick={() => setShowPropose(false)}>
                  Cancelar
                </Button>
                <Button type="submit" fullWidth>
                  Enviar
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {guideQuest && <QuestGuideModal quest={guideQuest} onClose={() => setGuideQuest(null)} />}
    </div>
  );
};
