import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Wrench, AlertTriangle, BookOpen, Zap } from 'lucide-react';
import { Card } from '../../components/stem/Card';
import { Button } from '../../components/stem/Button';
import { useAuth } from '../../contexts/AuthContext';
import type { ClassOutletContext } from './ClassLayout';

export const LabPage: React.FC = () => {
  const { catalog, handleRequestHardware } = useOutletContext<ClassOutletContext>();
  const { profile } = useAuth();
  const [selectedId, setSelectedId] = useState(catalog[0]?.id ?? '');
  const [message, setMessage] = useState('');
  const selected = catalog.find((i) => i.id === selectedId) ?? catalog[0];

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-stem-ink">Maker Lab</h1>
          <p className="font-body-stem text-sm text-stem-ink-soft">Inventário e guia técnico de troubleshooting.</p>
        </div>
        <div className="bg-stem-mist rounded-xl px-4 py-2 text-sm font-display font-bold text-stem-amber">
          🪙 {profile.izicoins} Izicoins
        </div>
      </div>

      {message && (
        <div className="rounded-xl bg-stem-teal/10 text-stem-teal font-body-stem text-sm px-4 py-3">{message}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          {catalog.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`w-full text-left flex items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3 transition-colors ${
                item.id === selectedId ? 'border-stem-teal bg-stem-teal/5' : 'border-stem-line bg-stem-cloud'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-display font-bold text-sm text-stem-ink">{item.name}</p>
                  <p className="text-xs font-body-stem text-stem-ink-soft">Estoque: {item.stockQuantity}</p>
                </div>
              </div>
              <span className="text-xs font-display font-bold text-stem-amber">🪙{item.coinCost}</span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2">
          <Card accent="teal" className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-stem-line pb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selected.icon}</span>
                <div>
                  <h3 className="font-display font-extrabold text-stem-ink">{selected.name}</h3>
                  <p className="text-xs font-body-stem text-stem-ink-soft">{selected.category}</p>
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
          </Card>
        </div>
      </div>
    </div>
  );
};
