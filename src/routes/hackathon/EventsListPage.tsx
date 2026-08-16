import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe2, Key, Plus, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { listStaffEvents, joinEventByCode } from '../../services/hackathonRepo';
import { Card } from '../../components/stem/Card';
import { Button } from '../../components/stem/Button';
import type { HackathonEvent } from '../../types';

export const EventsListPage: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [staffEvents, setStaffEvents] = useState<HackathonEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const canCreateEvent = (profile?.classIdsAsGameMaster.length ?? 0) > 0 || (profile?.schoolAdminOf.length ?? 0) > 0;

  useEffect(() => {
    if (!profile) return;
    listStaffEvents(profile.uid)
      .then(setStaffEvents)
      .catch((err) => console.error('Falha ao listar eventos:', err))
      .finally(() => setLoadingEvents(false));
  }, [profile]);

  if (!profile) return null;

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const event = await joinEventByCode(code.trim());
      navigate(`/eventos/${event.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Código inválido.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-stem-mist px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <Globe2 className="w-6 h-6 text-stem-teal" />
          <h1 className="font-display font-extrabold text-2xl text-stem-ink">Eventos Maker</h1>
        </div>
        <p className="font-body-stem text-sm text-stem-ink-soft">
          Hackathons temáticos como o EcoGuardians reúnem equipes de qualquer turma ou escola num só evento de um
          dia, com quests, fila de mentoria e bancada de testes ao vivo.
        </p>

        <Card accent="violet">
          <h2 className="font-display font-bold text-stem-ink mb-3">Entrar com código do evento</h2>
          <form onSubmit={handleJoin} className="flex flex-wrap gap-3">
            <input
              required
              placeholder="ECO-7K4QXP"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="flex-1 min-w-[180px] rounded-xl border-2 border-stem-line px-3 py-2.5 text-center font-display font-bold tracking-widest outline-none focus:border-stem-violet"
            />
            <Button type="submit" disabled={busy}>
              <Key className="w-4 h-4" /> Entrar
            </Button>
          </form>
          {error && <p className="text-sm text-stem-coral font-body-stem mt-2">{error}</p>}
        </Card>

        {canCreateEvent && (
          <Card accent="teal">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-display font-bold text-stem-ink flex items-center gap-2">
                  <Shield className="w-4 h-4 text-stem-teal" /> Painel de organização
                </h2>
                <p className="text-sm font-body-stem text-stem-ink-soft mt-1">
                  Crie um evento novo ou acompanhe os eventos que você já organiza.
                </p>
              </div>
              <Link to="/eventos/novo">
                <Button variant="secondary">
                  <Plus className="w-4 h-4" /> Criar evento
                </Button>
              </Link>
            </div>

            {!loadingEvents && staffEvents.length > 0 && (
              <div className="mt-4 space-y-2">
                {staffEvents.map((event) => (
                  <Link
                    key={event.id}
                    to={`/eventos/${event.id}/staff`}
                    className="block bg-stem-mist rounded-xl p-3 hover:bg-stem-teal/10 transition-colors"
                  >
                    <p className="font-display font-bold text-sm text-stem-ink">{event.name}</p>
                    <p className="text-xs font-body-stem text-stem-ink-soft">
                      {event.date} · Código: {event.joinCode}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};
