import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Bot, PlusCircle, Globe, CheckCircle, BookOpen } from 'lucide-react';
import { Card } from '../../components/stem/Card';
import { Button } from '../../components/stem/Button';
import type { Quest, SDGGoal } from '../../types';
import { SDG_NAMES, SDG_COLORS, ALL_SDG_GOALS } from '../../data/sdgGoals';
import { ToolBadgeRow } from '../../components/stem/ToolBadge';
import { QuestGuideModal } from '../../components/stem/QuestGuideModal';
import type { ClassOutletContext } from './ClassLayout';

export const MissoesPage: React.FC = () => {
  const { quests, handleCompleteQuest, handleProposeQuest, handleGenerateAIQuest } =
    useOutletContext<ClassOutletContext>();
  const [filter, setFilter] = useState<SDGGoal | 'ALL'>('ALL');
  const [showPropose, setShowPropose] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sdg, setSdg] = useState<SDGGoal>('4');
  const [generating, setGenerating] = useState(false);
  const [guideQuest, setGuideQuest] = useState<Quest | null>(null);

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
                {completed ? (
                  <div className="flex items-center justify-center gap-2 text-stem-teal font-display font-bold text-sm py-2">
                    <CheckCircle className="w-4 h-4" /> Concluída
                  </div>
                ) : (
                  <Button
                    fullWidth
                    variant="secondary"
                    onClick={() => handleCompleteQuest(q.id, q.xpReward, q.coinReward)}
                    disabled={q.status !== 'ACTIVE'}
                  >
                    {q.status === 'PROPOSED' ? 'Aguardando aprovação' : 'Enviar para validação'}
                  </Button>
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
