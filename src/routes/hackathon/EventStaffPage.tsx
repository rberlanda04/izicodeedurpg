import React, { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Copy, HeartPulse, Shield, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
  subscribeToEvent,
  subscribeToEventTeams,
  subscribeToMentorRequests,
  subscribeToTestingSlots,
  subscribeToCheckins,
  claimMentorRequest,
  resolveMentorRequest,
  logTestOutcome,
  updateTeamScores
} from '../../services/hackathonRepo';
import { getHackathonQuest } from '../../data/hackathonQuests';
import { Card } from '../../components/stem/Card';
import { Button } from '../../components/stem/Button';
import { ErrorState } from '../../components/stem/ErrorState';
import type {
  HackathonEvent,
  HackathonTeam,
  HackathonMentorRequest,
  HackathonTestingSlot,
  HackathonCheckin
} from '../../types';

const MENTOR_TYPE_LABEL: Record<string, string> = {
  technical: 'Técnico/Maker',
  social: 'Social/Territorial',
  pitch: 'Narrativa/Pitch'
};

const ENERGY_LABEL: Record<number, string> = { 1: '🔋 Recarga', 2: '🔋🔋 Metade', 3: '🔋🔋🔋 Cheio' };

export const EventStaffPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { profile } = useAuth();

  const [event, setEvent] = useState<HackathonEvent | null>(null);
  const [eventError, setEventError] = useState<string | null>(null);
  const [teams, setTeams] = useState<HackathonTeam[]>([]);
  const [requests, setRequests] = useState<HackathonMentorRequest[]>([]);
  const [slots, setSlots] = useState<HackathonTestingSlot[]>([]);
  const [checkins, setCheckins] = useState<HackathonCheckin[]>([]);
  const [copied, setCopied] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [staffNote, setStaffNote] = useState('');

  useEffect(() => {
    if (!eventId) return;
    setEventError(null);
    const unsubEvent = subscribeToEvent(eventId, setEvent, (error) => {
      console.error('Falha ao carregar evento:', error);
      setEventError('Não foi possível carregar este evento. Verifique sua conexão e tente novamente.');
    });
    const unsubTeams = subscribeToEventTeams(eventId, setTeams, (error) => console.error('Falha ao carregar equipes:', error));
    const unsubRequests = subscribeToMentorRequests(eventId, setRequests, (error) =>
      console.error('Falha ao carregar fila de mentoria:', error)
    );
    const unsubSlots = subscribeToTestingSlots(eventId, setSlots, (error) => console.error('Falha ao carregar bancada:', error));
    const unsubCheckins = subscribeToCheckins(eventId, setCheckins, (error) => console.error('Falha ao carregar check-ins:', error));
    return () => {
      unsubEvent();
      unsubTeams();
      unsubRequests();
      unsubSlots();
      unsubCheckins();
    };
  }, [eventId]);

  if (eventError) return <ErrorState message={eventError} />;
  if (!eventId || !profile || !event) return null;
  if (!event.staffIds.includes(profile.uid)) return <Navigate to="/eventos" replace />;

  const waiting = requests.filter((r) => r.status === 'waiting');
  const claimedByMe = requests.filter((r) => r.status === 'claimed' && r.claimedByUid === profile.uid);
  const bookedSlots = slots.filter((s) => s.teamId);

  // Latest check-in per team.
  const latestCheckinByTeam = new Map<string, HackathonCheckin>();
  for (const c of checkins) {
    const existing = latestCheckinByTeam.get(c.teamId);
    if (!existing || c.createdAt > existing.createdAt) latestCheckinByTeam.set(c.teamId, c);
  }
  const lowEnergyTeams = [...latestCheckinByTeam.values()].filter((c) => c.level === 1);

  const handleScoreSave = (team: HackathonTeam, key: 'engenharia' | 'equidade' | 'regeneracao', value: string) => {
    const num = value === '' ? undefined : Number(value);
    updateTeamScores(team.id, { ...team.scores, [key]: num }, team.scoreNotes ?? '');
  };

  return (
    <div className="min-h-screen bg-stem-mist px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-display font-bold text-stem-amber uppercase flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Painel de Facilitação
            </span>
            <h1 className="font-display font-extrabold text-xl text-stem-ink">{event.name}</h1>
          </div>
          <Link to="/eventos" className="flex items-center gap-1.5 text-sm font-display font-semibold text-stem-teal hover:underline">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>
        </div>

        <Card accent="teal">
          <h3 className="font-display font-bold text-stem-ink flex items-center gap-2 mb-3">Código de entrada do evento</h3>
          <div className="flex items-center gap-2 max-w-xs">
            <span className="flex-1 text-center font-display font-extrabold text-2xl text-stem-teal tracking-widest bg-stem-mist rounded-xl py-3">
              {event.joinCode}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(event.joinCode);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="p-3 rounded-xl border-2 border-stem-line hover:border-stem-teal"
            >
              {copied ? <Check className="w-5 h-5 text-stem-teal" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs font-body-stem text-stem-ink-soft mt-2">{teams.length} equipe(s) cadastrada(s).</p>
        </Card>

        {lowEnergyTeams.length > 0 && (
          <Card accent="coral">
            <h3 className="font-display font-bold text-stem-ink flex items-center gap-2 mb-2">
              <HeartPulse className="w-4 h-4 text-stem-coral" /> Equipes precisando de recarga
            </h3>
            <div className="flex flex-wrap gap-2">
              {lowEnergyTeams.map((c) => (
                <span key={c.teamId} className="text-sm font-display font-semibold bg-stem-coral/10 text-stem-coral rounded-full px-3 py-1">
                  {c.teamName}
                </span>
              ))}
            </div>
          </Card>
        )}

        <Card accent="violet">
          <h3 className="font-display font-bold text-stem-ink flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-stem-violet" /> Fila de mentoria ({waiting.length} na espera)
          </h3>
          {waiting.length === 0 && claimedByMe.length === 0 ? (
            <p className="text-sm font-body-stem text-stem-ink-soft text-center py-4">Nenhum pedido pendente.</p>
          ) : (
            <div className="space-y-2">
              {waiting.map((r) => (
                <div key={r.id} className="flex items-center justify-between bg-stem-mist rounded-xl p-3">
                  <div>
                    <p className="font-display font-bold text-sm text-stem-ink">{r.teamName}</p>
                    <p className="text-xs font-body-stem text-stem-ink-soft">{MENTOR_TYPE_LABEL[r.type]}</p>
                  </div>
                  <Button onClick={() => claimMentorRequest(r.id, profile.uid, profile.adventureName)}>Reivindicar</Button>
                </div>
              ))}
              {claimedByMe.map((r) => (
                <div key={r.id} className="flex items-center justify-between bg-stem-teal/10 rounded-xl p-3">
                  <div>
                    <p className="font-display font-bold text-sm text-stem-ink">{r.teamName}</p>
                    <p className="text-xs font-body-stem text-stem-ink-soft">{MENTOR_TYPE_LABEL[r.type]} · com você</p>
                  </div>
                  <Button variant="ghost" onClick={() => resolveMentorRequest(r.id)}>
                    Marcar resolvido
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="font-display font-bold text-stem-ink mb-3">Bancada de testes ({bookedSlots.length} reserva(s))</h3>
          {bookedSlots.length === 0 ? (
            <p className="text-sm font-body-stem text-stem-ink-soft text-center py-4">Nenhuma reserva ainda.</p>
          ) : (
            <div className="space-y-2">
              {bookedSlots.map((slot) => (
                <div key={slot.id} className="bg-stem-mist rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-display font-bold text-sm text-stem-ink">
                        {slot.teamName} — {slot.station} — {slot.timeSlot}
                      </p>
                      <p className="text-xs font-body-stem text-stem-ink-soft">
                        {slot.status === 'completed' ? `Resultado: ${slot.outcome === 'passed' ? 'Passou' : 'Ajuste de rota'}` : 'Aguardando teste'}
                      </p>
                    </div>
                    {slot.status !== 'completed' && (
                      <Button variant="ghost" onClick={() => setEditingSlotId(editingSlotId === slot.id ? null : slot.id)}>
                        Lançar resultado
                      </Button>
                    )}
                  </div>
                  {editingSlotId === slot.id && (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <input
                        placeholder="Observação do teste"
                        value={staffNote}
                        onChange={(e) => setStaffNote(e.target.value)}
                        className="flex-1 min-w-[160px] rounded-lg border-2 border-stem-line px-2 py-1.5 text-sm font-body-stem outline-none focus:border-stem-teal"
                      />
                      <Button
                        onClick={() => {
                          logTestOutcome(slot.id, 'passed', staffNote);
                          setEditingSlotId(null);
                          setStaffNote('');
                        }}
                      >
                        Passou
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => {
                          logTestOutcome(slot.id, 'retry', staffNote);
                          setEditingSlotId(null);
                          setStaffNote('');
                        }}
                      >
                        Ajuste de Rota
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="font-display font-bold text-stem-ink mb-3">Pontuação das equipes</h3>
          {teams.length === 0 ? (
            <p className="text-sm font-body-stem text-stem-ink-soft text-center py-4">Nenhuma equipe cadastrada ainda.</p>
          ) : (
            <div className="space-y-4">
              {teams.map((team) => {
                const quest = getHackathonQuest(team.questId);
                const checkin = latestCheckinByTeam.get(team.id);
                return (
                  <div key={team.id} className="bg-stem-mist rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-display font-bold text-sm text-stem-ink">{team.name}</p>
                        <p className="text-xs font-body-stem text-stem-ink-soft">{quest?.title}</p>
                      </div>
                      {checkin && (
                        <span className="text-xs font-display font-semibold text-stem-ink-soft">{ENERGY_LABEL[checkin.level]}</span>
                      )}
                    </div>
                    {quest && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
                        {quest.scoreCards.map((card) => (
                          <div key={card.id}>
                            <label className="text-[10px] font-display font-bold uppercase text-stem-ink-soft">{card.title}</label>
                            <input
                              type="number"
                              min={0}
                              max={card.xpReward}
                              defaultValue={team.scores[card.axis] ?? ''}
                              onBlur={(e) => handleScoreSave(team, card.axis, e.target.value)}
                              className="w-full rounded-lg border-2 border-stem-line px-2 py-1 text-sm font-body-stem outline-none focus:border-stem-teal"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
