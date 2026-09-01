import React, { useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Wrench, AlertTriangle, BookOpen, Zap, Target, ArrowRight, GraduationCap, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/stem/Card';
import { Button } from '../../components/stem/Button';
import { WizardModal } from '../../components/stem/WizardModal';
import { useAuth } from '../../contexts/AuthContext';
import { PROJECT_CATALOG } from '../../data/projectCatalog';
import { QUESTS } from '../../data/mockData';
import { LAB_WIZARDS } from '../../data/labWizards';
import type { ClassOutletContext } from './ClassLayout';
import type { HardwareItem, SkillTier, StudyWizard } from '../../types';

const TIER_STYLES: Record<SkillTier, { label: string; badge: string; accent: 'teal' | 'violet' | 'amber' | 'coral' }> = {
  BASIC: { label: 'Nível 1 · Básico', badge: 'bg-stem-teal/15 text-stem-teal', accent: 'teal' },
  INTERMEDIATE: { label: 'Nível 2 · Intermediário', badge: 'bg-stem-violet/15 text-stem-violet', accent: 'violet' },
  ADVANCED: { label: 'Nível 3 · Avançado', badge: 'bg-stem-amber/15 text-stem-amber', accent: 'amber' },
  SPECIALIST: { label: 'Nível 4 · Especialista', badge: 'bg-stem-coral/15 text-stem-coral', accent: 'coral' }
};

const CATEGORY_LABELS: Record<HardwareItem['category'], string> = {
  STATIONERY: 'Consumíveis',
  TOOLS: 'Ferramentas',
  MICROCONTROLLER: 'Microcontroladores',
  SENSOR: 'Sensores',
  ACTUATOR: 'Atuadores'
};

const CATEGORY_ORDER: HardwareItem['category'][] = ['MICROCONTROLLER', 'SENSOR', 'ACTUATOR', 'STATIONERY', 'TOOLS'];

export const LabPage: React.FC = () => {
  const { catalog, myHardwareRequests, handleRequestHardware, handleCompleteWizard } =
    useOutletContext<ClassOutletContext>();
  const { profile } = useAuth();
  const [selectedId, setSelectedId] = useState(catalog[0]?.id ?? '');
  const [message, setMessage] = useState('');
  const [openWizard, setOpenWizard] = useState<StudyWizard | null>(null);
  const selected = catalog.find((i) => i.id === selectedId) ?? catalog[0];

  const questInfoById = useMemo(() => {
    const map = new Map<string, { title: string; tier: SkillTier }>();
    for (const q of [...PROJECT_CATALOG, ...QUESTS]) {
      map.set(q.id, { title: q.title, tier: q.tier });
    }
    return map;
  }, []);

  const groupedCatalog = useMemo(() => {
    const groups = new Map<HardwareItem['category'], HardwareItem[]>();
    for (const item of catalog) {
      const list = groups.get(item.category) ?? [];
      list.push(item);
      groups.set(item.category, list);
    }
    return CATEGORY_ORDER.filter((c) => groups.has(c)).map((c) => ({ category: c, items: groups.get(c)! }));
  }, [catalog]);

  if (!profile || !selected) return null;

  const pendingRequest = myHardwareRequests.find((r) => r.itemId === selected.id && r.status === 'PENDING');

  const handleRequest = async () => {
    if (selected.stockQuantity <= 0) {
      setMessage('Item esgotado no laboratório.');
    } else if (profile.izicoins < selected.coinCost) {
      setMessage('Izicoins insuficientes.');
    } else {
      await handleRequestHardware(selected.id);
      setMessage(`Pedido enviado! Aguarde a aprovação do Game Master: ${selected.name}`);
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const linkedQuests = (selected.linkedQuestIds ?? [])
    .map((id) => questInfoById.get(id))
    .filter((q): q is { title: string; tier: SkillTier } => Boolean(q));

  const completedWizards = profile.completedWizards ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-stem-ink">Maker Lab</h1>
          <p className="font-body-stem text-sm text-stem-ink-soft">
            Estúdio de estudos, inventário e guia técnico de troubleshooting.
          </p>
        </div>
        <div className="bg-stem-mist rounded-xl px-4 py-2 text-sm font-display font-bold text-stem-amber">
          🪙 {profile.izicoins} Izicoins
        </div>
      </div>

      {message && (
        <div className="rounded-xl bg-stem-teal/10 text-stem-teal font-body-stem text-sm px-4 py-3">{message}</div>
      )}

      <Card accent="teal" className="space-y-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-stem-teal" />
          <h2 className="font-display font-extrabold text-stem-ink">Estúdio de Estudos</h2>
        </div>
        <p className="font-body-stem text-sm text-stem-ink-soft -mt-2">
          Aprenda a teoria por trás de cada família de material antes de sair construindo. Cada wizard concede XP e Izicoins na primeira vez que é concluído.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {LAB_WIZARDS.map((wizard) => {
            const done = completedWizards.includes(wizard.id);
            return (
              <button
                key={wizard.id}
                onClick={() => setOpenWizard(wizard)}
                className={`text-left rounded-2xl border-2 p-3 space-y-2 transition-colors ${
                  done ? 'border-stem-teal/40 bg-stem-teal/5' : 'border-stem-line bg-stem-cloud hover:border-stem-teal/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{wizard.icon}</span>
                  {done ? (
                    <CheckCircle2 className="w-4 h-4 text-stem-teal" />
                  ) : (
                    <span className="text-[10px] font-display font-bold px-2 py-0.5 rounded-full bg-stem-amber/15 text-stem-amber">
                      +{wizard.xpReward} XP
                    </span>
                  )}
                </div>
                <p className="font-display font-bold text-xs text-stem-ink leading-snug">{wizard.title}</p>
                <p className="text-[11px] font-body-stem text-stem-ink-soft leading-snug">{wizard.summary}</p>
              </button>
            );
          })}
        </div>
        <Link to="../missoes" className="inline-flex items-center gap-1.5 text-sm font-display font-bold text-stem-teal hover:underline">
          Já sabe a teoria? Veja os projetos no Mural de Missões <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-5">
          {groupedCatalog.map(({ category, items }) => (
            <div key={category} className="space-y-2">
              <p className="text-xs font-display font-bold uppercase tracking-wide text-stem-ink-soft/70 px-1">
                {CATEGORY_LABELS[category]}
              </p>
              <div className="space-y-2">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`w-full text-left flex items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3 transition-colors ${
                      item.id === selectedId ? 'border-stem-teal bg-stem-teal/5' : 'border-stem-line bg-stem-cloud'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl shrink-0">{item.icon}</span>
                      <div className="min-w-0">
                        <p className="font-display font-bold text-sm text-stem-ink truncate">{item.name}</p>
                        <p className="text-xs font-body-stem text-stem-ink-soft">Estoque: {item.stockQuantity}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-xs font-display font-bold text-stem-amber">🪙{item.coinCost}</span>
                      {item.tier && (
                        <span className={`text-[10px] font-display font-bold px-1.5 py-0.5 rounded-full ${TIER_STYLES[item.tier].badge}`}>
                          {item.tier === 'BASIC' && 'Nível 1'}
                          {item.tier === 'INTERMEDIATE' && 'Nível 2'}
                          {item.tier === 'ADVANCED' && 'Nível 3'}
                          {item.tier === 'SPECIALIST' && 'Nível 4'}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2">
          <Card accent={selected.tier ? TIER_STYLES[selected.tier].accent : 'teal'} className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-stem-line pb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selected.icon}</span>
                <div>
                  <h3 className="font-display font-extrabold text-stem-ink">{selected.name}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-body-stem text-stem-ink-soft">{CATEGORY_LABELS[selected.category]}</p>
                    {selected.tier && (
                      <span className={`text-[10px] font-display font-bold px-2 py-0.5 rounded-full ${TIER_STYLES[selected.tier].badge}`}>
                        {TIER_STYLES[selected.tier].label}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button onClick={() => void handleRequest()} disabled={selected.stockQuantity <= 0 || Boolean(pendingRequest)}>
                <Wrench className="w-4 h-4" />
                {pendingRequest
                  ? 'Pedido enviado — aguardando o Game Master'
                  : selected.stockQuantity <= 0
                    ? 'Esgotado'
                    : `Requisitar (🪙${selected.coinCost})`}
              </Button>
            </div>

            {selected.troubleshootingGuide ? (
              <div className="space-y-4">
                <div className="flex items-start gap-2 text-sm font-body-stem text-stem-ink-soft">
                  <BookOpen className="w-4 h-4 text-stem-teal shrink-0 mt-0.5" />
                  {selected.troubleshootingGuide.overview}
                </div>
                {selected.troubleshootingGuide.commonErrors.map((err, idx) => (
                  <div key={idx} className="bg-stem-mist rounded-xl p-3 text-sm font-body-stem space-y-1">
                    <p className="flex items-center gap-1.5 font-semibold text-stem-coral">
                      <AlertTriangle className="w-3.5 h-3.5" /> {err.error}
                    </p>
                    <p className="pl-5 text-stem-ink-soft">🔧 {err.solution}</p>
                  </div>
                ))}
                {selected.troubleshootingGuide.wiringDiagram.length > 0 && (
                  <div className="overflow-x-auto">
                    <p className="flex items-center gap-1.5 font-display font-bold text-stem-teal text-sm mb-2">
                      <Zap className="w-3.5 h-3.5" /> Diagrama de pinagem
                    </p>
                    <table className="w-full text-left text-xs font-body-stem">
                      <thead>
                        <tr className="text-stem-ink-soft border-b border-stem-line">
                          <th className="pb-1">Origem</th>
                          <th className="pb-1">Destino</th>
                          <th className="pb-1">Observação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selected.troubleshootingGuide.wiringDiagram.map((row, idx) => (
                          <tr key={idx} className="border-b border-stem-line/60">
                            <td className="py-1.5 text-stem-teal">{row.pinFrom}</td>
                            <td className="py-1.5 text-stem-coral">{row.pinTo}</td>
                            <td className="py-1.5 text-stem-ink-soft">{row.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm font-body-stem text-stem-ink-soft text-center py-6">
                Componente padrão de laboratório. Consulte o Game Master para especificações.
              </p>
            )}

            {linkedQuests.length > 0 && (
              <div className="border-t-2 border-stem-line pt-4 space-y-2">
                <p className="flex items-center gap-1.5 font-display font-bold text-stem-ink text-sm">
                  <Target className="w-3.5 h-3.5 text-stem-teal" /> Projetos que usam este material
                </p>
                <div className="flex flex-wrap gap-2">
                  {linkedQuests.map((q) => (
                    <span
                      key={q.title}
                      className={`text-xs font-body-stem px-3 py-1.5 rounded-xl ${TIER_STYLES[q.tier].badge}`}
                    >
                      {q.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {openWizard && (
        <WizardModal
          wizard={openWizard}
          alreadyCompleted={completedWizards.includes(openWizard.id)}
          onClose={() => setOpenWizard(null)}
          onComplete={handleCompleteWizard}
        />
      )}
    </div>
  );
};
