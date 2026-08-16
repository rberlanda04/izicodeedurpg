import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Users, HandHelping, FlaskConical, HeartPulse, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
  subscribeToEvent,
  subscribeToEventTeams,
  subscribeToMentorRequests,
  subscribeToTestingSlots,
  createTeam,
  joinTeam,
  chooseQuest,
  createMentorRequest,
  bookTestingSlot,
  submitCheckin
} from '../../services/hackathonRepo';
import { getCurrentPhase, generateSlotLabels } from '../../services/hackathonPhase';
import { HACKATHON_QUESTS, HACKATHON_STATIONS, getHackathonQuest, getHackathonStation } from '../../data/hackathonQuests';
import { loadState, saveState, namespacedKey } from '../../services/persistence';
import { Card } from '../../components/stem/Card';
import { Button } from '../../components/stem/Button';
import { ErrorState } from '../../components/stem/ErrorState';
import type {
  HackathonEvent,
  HackathonTeam,
  HackathonMentorRequest,
  HackathonMentorRequestType,
  HackathonTestingSlot
} from '../../types';

const MENTOR_TYPE_LABEL: Record<HackathonMentorRequestType, string> = {
  technical: 'Apoio Técnico/Maker',
  social: 'Apoio Social/Territorial',
  pitch: 'Apoio de Narrativa/Pitch'
};

export const EventHubPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { profile } = useAuth();

  const [event, setEvent] = useState<HackathonEvent | null>(null);
  const [eventError, setEventError] = useState<string | null>(null);
  const [teams, setTeams] = useState<HackathonTeam[]>([]);
  const [myMentorRequests, setMyMentorRequests] = useState<HackathonMentorRequest[]>([]);
  const [slots, setSlots] = useState<HackathonTestingSlot[]>([]);
  const [myTeamId, setMyTeamId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');

  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamQuestId, setNewTeamQuestId] = useState(HACKATHON_QUESTS[0].id);

  useEffect(() => {
    if (!eventId) return;
    setMyTeamId(loadState(namespacedKey(`hackathon:${eventId}:myTeamId`), null as string | null));
    setEventError(null);
    const unsubEvent = subscribeToEvent(eventId, setEvent, (error) => {
      console.error('Falha ao carregar evento:', error);
      setEventError('Não foi possível carregar este evento. Verifique sua conexão e tente novamente.');
    });
    const unsubTeams = subscribeToEventTeams(eventId, setTeams, (error) => console.error('Falha ao carregar equipes:', error));
    const unsubMentors = subscribeToMentorRequests(eventId, setMyMentorRequests, (error) =>
      console.error('Falha ao carregar fila de mentoria:', error)
    );
    const unsubSlots = subscribeToTestingSlots(eventId, setSlots, (error) => console.error('Falha ao carregar bancada:', error));
    return () => {
      unsubEvent();
      unsubTeams();
      unsubMentors();
      unsubSlots();
    };
  }, [eventId]);

  const myTeam = teams.find((t) => t.id === myTeamId) ?? null;
  const myQuest = getHackathonQuest(myTeam?.questId);
  const myStation = myQuest ? getHackathonStation(myQuest.disasterType) : undefined;
  const myTeamRequests = myMentorRequests.filter((r) => r.teamId === myTeamId);
  const currentPhase = event ? getCurrentPhase(event.schedule) : null;
  const isLunch = currentPhase?.id === 'almoco';

  const rememberTeam = (teamId: string) => {
    if (!eventId) return;
    saveState(namespacedKey(`hackathon:${eventId}:myTeamId`), teamId);
    setMyTeamId(teamId);
  };

  if (eventError) return <ErrorState message={eventError} />;
  if (!eventId || !profile || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stem-mist">
        <span className="font-display font-bold text-stem-teal animate-pulse">Carregando evento...</span>
      </div>
    );
  }

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setBusy(true);
    try {
      const team = await createTeam(eventId, newTeamName.trim(), newTeamQuestId, profile.uid, {
        name: profile.adventureName,
        avatarHead: profile.avatarConfig.head,
        role: 'DEVELOPER',
        joinedAt: new Date().toISOString()
      });
      rememberTeam(team.id);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Não foi possível criar a equipe.');
    } finally {
      setBusy(false);
    }
  };

  const handleJoinTeam = async (teamId: string) => {
    setBusy(true);
    try {
      await joinTeam(teamId, profile.uid, {
        name: profile.adventureName,
        avatarHead: profile.avatarConfig.head,
        role: 'DEVELOPER',
        joinedAt: new Date().toISOString()
      });
      rememberTeam(teamId);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Não foi possível entrar na equipe.');
    } finally {
      setBusy(false);
    }
  };

  const handleRequestMentor = async (type: HackathonMentorRequestType) => {
    if (!myTeam) return;
    await createMentorRequest(eventId, myTeam.id, myTeam.name, type);
  };

  const handleBookSlot = async (timeSlot: string) => {
    if (!myTeam || !myStation) return;
    const result = await bookTestingSlot(eventId, myStation.id, timeSlot, myTeam.id, myTeam.name);
    if (result === 'taken') {
      setFormError('Esse horário acabou de ser reservado por outra equipe — escolha outro.');
    }
  };

  const handleCheckin = async (level: 1 | 2 | 3) => {
    if (!myTeam) return;
    await submitCheckin(eventId, myTeam.id, myTeam.name, level, currentPhase?.label ?? 'Check-in');
  };

  return (
    <div className="min-h-screen bg-stem-mist px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <p className="text-xs font-display font-bold uppercase tracking-wide text-stem-teal">{event.name}</p>
          <h1 className="font-display font-extrabold text-2xl text-stem-ink flex items-center gap-2">
            <Clock className="w-5 h-5 text-stem-violet" />
            {currentPhase ? currentPhase.label : 'Fora do horário do evento'}
          </h1>
          {currentPhase && (
            <p className="text-sm font-body-stem text-stem-ink-soft">
              {currentPhase.startTime}–{currentPhase.endTime}
            </p>
          )}
        </div>

        {!myTeam ? (
          <>
            <Card accent="teal">
              <h2 className="font-display font-bold text-stem-ink mb-3">Criar minha equipe</h2>
              <form onSubmit={handleCreateTeam} className="space-y-3">
                <input
                  required
                  placeholder="Nome da equipe"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full rounded-xl border-2 border-stem-line px-3 py-2.5 font-body-stem outline-none focus:border-stem-teal"
                />
                <select
                  value={newTeamQuestId}
                  onChange={(e) => setNewTeamQuestId(e.target.value)}
                  className="w-full rounded-xl border-2 border-stem-line px-3 py-2.5 font-body-stem outline-none focus:border-stem-teal"
                >
                  {HACKATHON_QUESTS.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.title}
                    </option>
                  ))}
                </select>
                {formError && <p className="text-sm text-stem-coral font-body-stem">{formError}</p>}
                <Button type="submit" fullWidth disabled={busy}>
                  Criar equipe
                </Button>
              </form>
            </Card>

            {teams.length > 0 && (
              <Card>
                <h2 className="font-display font-bold text-stem-ink mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Ou entre numa equipe existente
                </h2>
                <div className="space-y-2">
                  {teams.map((team) => (
                    <div key={team.id} className="flex items-center justify-between bg-stem-mist rounded-xl p-3">
                      <div>
                        <p className="font-display font-bold text-sm text-stem-ink">{team.name}</p>
                        <p className="text-xs font-body-stem text-stem-ink-soft">
                          {Object.keys(team.members).length} membro(s) · {getHackathonQuest(team.questId)?.title}
                        </p>
                      </div>
                      <Button variant="ghost" onClick={() => handleJoinTeam(team.id)} disabled={busy}>
                        Entrar
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        ) : (
          <>
            <Card accent="violet">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-lg text-stem-ink">{myTeam.name}</h2>
                <span className="text-xs font-display font-bold text-stem-violet bg-stem-violet/10 rounded-full px-3 py-1">
                  {Object.keys(myTeam.members).length} membro(s)
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.values(myTeam.members).map((m, i) => (
                  <span key={i} className="text-sm">
                    {m.avatarHead} {m.name}
                  </span>
                ))}
              </div>
            </Card>

            {myQuest && (
              <Card accent="amber">
                <p className="text-xs font-display font-bold uppercase text-stem-amber">{myQuest.pillar}</p>
                <h2 className="font-display font-extrabold text-xl text-stem-ink mt-1">{myQuest.title}</h2>
                <p className="font-body-stem text-sm text-stem-ink-soft mt-2">{myQuest.storyIntro}</p>
                <p className="font-body-stem text-sm text-stem-ink mt-3 font-semibold">Objetivo na maquete:</p>
                <p className="font-body-stem text-sm text-stem-ink-soft">{myQuest.testObjective}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                  {myQuest.scoreCards.map((card) => (
                    <div key={card.id} className="bg-stem-mist rounded-xl p-3">
                      <p className="font-display font-bold text-xs text-stem-ink">{card.title}</p>
                      <p className="text-xs font-body-stem text-stem-ink-soft mt-1">{card.description}</p>
                      <p className="text-xs font-display font-bold text-stem-amber mt-1">+{card.xpReward} XP</p>
                      {myTeam.scores[card.axis] !== undefined && (
                        <p className="text-xs font-display font-bold text-stem-teal mt-1">Nota: {myTeam.scores[card.axis]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Card accent="coral">
              <h2 className="font-display font-bold text-stem-ink mb-3 flex items-center gap-2">
                <HandHelping className="w-4 h-4 text-stem-coral" /> Solicitar Mentor
              </h2>
              {isLunch ? (
                <p className="text-sm font-body-stem text-stem-ink-soft">
                  Pausa para almoço — a fila de mentoria reabre depois das {event.schedule.find((p) => p.id === 'almoco')?.endTime}.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(['technical', 'social', 'pitch'] as const).map((type) => (
                    <Button key={type} variant="ghost" onClick={() => handleRequestMentor(type)}>
                      {MENTOR_TYPE_LABEL[type]}
                    </Button>
                  ))}
                </div>
              )}
              {myTeamRequests.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {myTeamRequests.map((r) => (
                    <p key={r.id} className="text-xs font-body-stem text-stem-ink-soft">
                      {MENTOR_TYPE_LABEL[r.type]} —{' '}
                      <span className="font-semibold">
                        {r.status === 'waiting' ? 'Na fila' : r.status === 'claimed' ? `Atendido por ${r.claimedByName}` : 'Resolvido'}
                      </span>
                    </p>
                  ))}
                </div>
              )}
            </Card>

            {myStation && !isLunch && (
              <Card>
                <h2 className="font-display font-bold text-stem-ink mb-3 flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-stem-teal" /> Agendar bancada — {myStation.simulatorLabel}
                </h2>
                {event.testingWindows.map((w, wi) => (
                  <div key={wi} className="mb-3">
                    <p className="text-xs font-display font-bold text-stem-ink-soft mb-1.5">
                      Janela {w.start}–{w.end}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {generateSlotLabels(w).map((label) => {
                        const slot = slots.find((s) => s.station === myStation.id && s.timeSlot === label);
                        const taken = !!slot?.teamId && slot.teamId !== myTeam.id;
                        const mine = slot?.teamId === myTeam.id;
                        return (
                          <button
                            key={label}
                            disabled={taken || mine}
                            onClick={() => handleBookSlot(label)}
                            className={`text-xs font-display font-bold rounded-lg px-2 py-1.5 border-2 ${
                              mine
                                ? 'bg-stem-teal text-white border-stem-teal'
                                : taken
                                  ? 'bg-stem-mist text-stem-ink-soft/50 border-stem-line cursor-not-allowed'
                                  : 'bg-white text-stem-ink border-stem-line hover:border-stem-teal'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {formError && <p className="text-sm text-stem-coral font-body-stem mt-2">{formError}</p>}
              </Card>
            )}

            <Card accent="violet">
              <h2 className="font-display font-bold text-stem-ink mb-3 flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-stem-violet" /> Termômetro da Guilda
              </h2>
              <p className="text-sm font-body-stem text-stem-ink-soft mb-3">Como está a energia da equipe agora?</p>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => handleCheckin(1)}>
                  🔋 Precisando de recarga
                </Button>
                <Button variant="ghost" onClick={() => handleCheckin(2)}>
                  🔋🔋 Na metade
                </Button>
                <Button variant="ghost" onClick={() => handleCheckin(3)}>
                  🔋🔋🔋 Cheio
                </Button>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
