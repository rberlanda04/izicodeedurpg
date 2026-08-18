import React, { useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Wrench, AlertTriangle, BookOpen, Zap, Target, ArrowRight } from 'lucide-react';
import { Card } from '../../components/stem/Card';
import { Button } from '../../components/stem/Button';
import { useAuth } from '../../contexts/AuthContext';
import { PROJECT_CATALOG } from '../../data/projectCatalog';
import { QUESTS } from '../../data/mockData';
import type { ClassOutletContext } from './ClassLayout';
import type { HardwareItem, SkillTier } from '../../types';

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

// A escada de 6 projetos da Trilha do Eletricista Iniciante, mostrada como
// um mapa visual fixo no topo do Maker Lab. Níveis 2 e 4 usam projetos que
// já existem no catálogo real (não duplicados); os outros 4 foram escritos
// junto com este material de laboratório.
const BEGINNER_LADDER: Array<{ step: number; title: string; tier: SkillTier; icon: string; blurb: string }> = [
  { step: 1, title: 'Primeira Luz: Acendendo um LED', tier: 'BASIC', icon: '💡', blurb: 'Polaridade, resistor e o primeiro digitalWrite().' },
  { step: 2, title: 'Semáforo Inteligente', tier: 'BASIC', icon: '🚦', blurb: 'Sequência de 3 LEDs com tempos de espera.' },
  { step: 3, title: 'Ronda Sonora: Detector de Palmas', tier: 'INTERMEDIATE', icon: '🎤', blurb: 'Primeiro sensor: som, debounce e sinal digital.' },
  { step: 4, title: 'Monitor Ambiental com LCD', tier: 'BASIC', icon: '🌡️', blurb: 'Temperatura, umidade e um display físico.' },
  { step: 5, title: 'Radar Giratório: Vigia de 180°', tier: 'ADVANCED', icon: '📡', blurb: 'Servo + ultrassônico varrendo o ambiente.' },
  { step: 6, title: 'Central de Vigilância: Painel Multissensor', tier: 'ADVANCED', icon: '🛰️', blurb: 'Todos os sensores juntos, sem delay() bloqueante.' }
];

export const LabPage: React.FC = () => {
  const { catalog, handleRequestHardware } = useOutletContext<ClassOutletContext>();
  const { profile } = useAuth();
  const [selectedId, setSelectedId] = useState(catalog[0]?.id ?? '');
  const [message, setMessage] = useState('');
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

  const handleRequest = () => {
    if (selected.stockQuantity <= 0) {
      setMessage('Item esgotado no laboratório.');
    } else if (profile.izicoins < selected.coinCost) {
      setMessage('Izicoins insuficientes.');
    } else {
      handleRequestHardware(selected.id, selected.coinCost);
      setMessage(`Requisitado! Retire com o Game Master: ${selected.name}`);
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const linkedQuests = (selected.linkedQuestIds ?? [])
    .map((id) => questInfoById.get(id))
    .filter((q): q is { title: string; tier: SkillTier } => Boolean(q));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-stem-ink">Maker Lab</h1>
          <p className="font-body-stem text-sm text-stem-ink-soft">
            Inventário, trilha de projetos por nível e guia técnico de troubleshooting.
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
                <span className={`text-[10px] font-display font-bold px-2 py-0.5 rounded-full ${TIER_STYLES[step.tier].badge}`}>
                  Nível {step.step}
                </span>
              </div>
              <p className="font-display font-bold text-xs text-stem-ink leading-snug">{step.title}</p>
              <p className="text-[11px] font-body-stem text-stem-ink-soft leading-snug">{step.blurb}</p>
            </div>
          ))}
        </div>
        <Link to="../missoes" className="inline-flex items-center gap-1.5 text-sm font-display font-bold text-stem-teal hover:underline">
          Ver missões no mural <ArrowRight className="w-3.5 h-3.5" />
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
              <Button onClick={handleRequest} disabled={selected.stockQuantity <= 0}>
                <Wrench className="w-4 h-4" />
                {selected.stockQuantity <= 0 ? 'Esgotado' : `Requisitar (🪙${selected.coinCost})`}
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
    </div>
  );
};
