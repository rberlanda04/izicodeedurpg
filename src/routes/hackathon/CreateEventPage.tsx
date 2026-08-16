import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { CalendarDays, Rocket } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { createEvent } from '../../services/hackathonRepo';
import { DEFAULT_HACKATHON_SCHEDULE, DEFAULT_HACKATHON_TESTING_WINDOWS } from '../../data/hackathonScheduleTemplate';
import { Card } from '../../components/stem/Card';
import { Button } from '../../components/stem/Button';

export const CreateEventPage: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('Hackathon EcoGuardians');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!profile) return null;
  const canCreateEvent = profile.classIdsAsGameMaster.length > 0 || profile.schoolAdminOf.length > 0;
  if (!canCreateEvent) return <Navigate to="/eventos" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const event = await createEvent(
        name.trim(),
        date,
        profile.uid,
        DEFAULT_HACKATHON_SCHEDULE,
        DEFAULT_HACKATHON_TESTING_WINDOWS
      );
      navigate(`/eventos/${event.id}/staff`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível criar o evento.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-stem-mist px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="font-display font-extrabold text-2xl text-stem-ink">Criar hackathon</h1>

        <Card accent="teal">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-display font-bold uppercase text-stem-ink-soft">Nome do evento</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 rounded-xl border-2 border-stem-line px-3 py-2.5 font-body-stem outline-none focus:border-stem-teal"
              />
            </div>
            <div>
              <label className="text-xs font-display font-bold uppercase text-stem-ink-soft">Data</label>
              <input
                required
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full mt-1 rounded-xl border-2 border-stem-line px-3 py-2.5 font-body-stem outline-none focus:border-stem-teal"
              />
            </div>
            {error && <p className="text-sm text-stem-coral font-body-stem">{error}</p>}
            <Button type="submit" fullWidth disabled={busy}>
              <Rocket className="w-4 h-4" /> Criar evento
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="font-display font-bold text-stem-ink flex items-center gap-2 mb-3">
            <CalendarDays className="w-4 h-4 text-stem-teal" /> Cronograma padrão (9h–16h)
          </h2>
          <p className="text-sm font-body-stem text-stem-ink-soft mb-3">
            Todo evento novo já nasce com este cronograma testado — ajustes finos podem ser combinados com a equipe
            de facilitação no dia.
          </p>
          <div className="space-y-1.5">
            {DEFAULT_HACKATHON_SCHEDULE.map((phase) => (
              <div key={phase.id} className="flex justify-between text-sm font-body-stem">
                <span className="text-stem-ink-soft">
                  {phase.startTime}–{phase.endTime}
                </span>
                <span className="text-stem-ink font-semibold text-right">{phase.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
