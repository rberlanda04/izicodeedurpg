import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Compass, Lock, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/stem/Card';
import { Button } from '../../components/stem/Button';
import type { ClassOutletContext } from './ClassLayout';

export const CuriosidadesPage: React.FC = () => {
  const { curiosities, handleUnlockCuriosityCard } = useOutletContext<ClassOutletContext>();
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = handleUnlockCuriosityCard(code);
    setMessage(ok ? 'Curiosidade desbloqueada!' : 'Código não encontrado.');
    setCode('');
    setTimeout(() => setMessage(''), 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-stem-ink flex items-center gap-2">
          <Compass className="w-6 h-6 text-stem-violet" /> Radar de Curiosidades
        </h1>
        <p className="font-body-stem text-sm text-stem-ink-soft">
          Encontre os códigos QR espalhados pelo laboratório físico.
        </p>
      </div>

      <Card accent="violet" className="max-w-md">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            placeholder="Código do laboratório (ex: LAB-SOLD-01)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 rounded-xl border-2 border-stem-line px-3 py-2 font-body-stem outline-none focus:border-stem-violet"
          />
          <Button type="submit">Destravar</Button>
        </form>
        {message && <p className="text-sm font-body-stem text-stem-teal mt-2">{message}</p>}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {curiosities.map((c) => (
          <Card key={c.id} accent={c.unlocked ? 'violet' : 'none'}>
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display font-bold text-stem-ink">{c.unlocked ? c.title : '??? Localização secreta'}</h3>
              {c.unlocked ? (
                <CheckCircle2 className="w-5 h-5 text-stem-teal shrink-0" />
              ) : (
                <Lock className="w-5 h-5 text-stem-ink-soft shrink-0" />
              )}
            </div>
            {c.unlocked ? (
              <>
                <p className="text-sm font-body-stem text-stem-ink-soft mt-2">{c.content}</p>
                <p className="text-xs font-display font-bold text-stem-amber mt-2">📍 {c.labLocation}</p>
              </>
            ) : (
              <p className="text-sm font-body-stem text-stem-ink-soft mt-2">
                Escaneie o QR físico correspondente para revelar.
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
