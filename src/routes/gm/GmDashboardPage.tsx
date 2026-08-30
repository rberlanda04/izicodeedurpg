import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Crown, Key, Zap, CheckCircle, Copy, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { subscribeToClass } from '../../services/classRepo';
import { subscribeToClassValidations } from '../../services/questRepo';
import { useClassLocalState } from '../../hooks/useClassLocalState';
import { useApplyUserPatch } from '../../hooks/useApplyUserPatch';
import { Card } from '../../components/stem/Card';
import { Button } from '../../components/stem/Button';
import { ErrorState } from '../../components/stem/ErrorState';
import { ValidationCodeReveal } from '../../components/stem/ValidationCodeReveal';
import type { ClassRoom, QuestValidation } from '../../types';

export const GmDashboardPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const { profile, firebaseUser } = useAuth();
  const [classRoom, setClassRoom] = useState<ClassRoom | null>(null);
  const [classError, setClassError] = useState<string | null>(null);
  const [validations, setValidations] = useState<QuestValidation[]>([]);
  const [xpAmount, setXpAmount] = useState(100);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!classId) return;
    setClassError(null);
    return subscribeToClass(classId, setClassRoom, (error) => {
      console.error('Falha ao carregar a turma:', error);
      setClassError('Não foi possível carregar esta turma. Verifique sua conexão e tente novamente.');
    });
  }, [classId]);

  useEffect(() => {
    if (!classId) return;
    // questValidations is rules-restricted to GM/Admin — a student's
    // browser can never subscribe to this successfully, which is the whole
    // point (the code only exists somewhere the class can't read).
    return subscribeToClassValidations(classId, setValidations, (error) =>
      console.error('Falha ao carregar validações pendentes:', error)
    );
  }, [classId]);

  const applyUserPatch = useApplyUserPatch(profile);
  const classState = useClassLocalState(
    classId ?? 'unknown',
    classRoom?.schoolId ?? '',
    profile!,
    applyUserPatch,
    firebaseUser
  );

  if (!classId || !profile) return null;
  if (classError) return <ErrorState message={classError} />;
  if (!classRoom) return null;

  const proposedQuests = classState.quests.filter((q) => q.status === 'PROPOSED');
  const pendingValidations = classState.quests.filter((q) => q.status === 'PENDING_VALIDATION');

  return (
    <div className="min-h-screen bg-stem-mist">
      <header className="bg-stem-cloud border-b-2 border-stem-line px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <span className="text-xs font-display font-bold text-stem-amber uppercase">Modo Game Master</span>
            <h1 className="font-display font-extrabold text-xl text-stem-ink flex items-center gap-2">
              <Crown className="w-5 h-5 text-stem-amber" /> Painel de {classRoom.name}
            </h1>
          </div>
          <Link
            to={`/app/${classId}/mundo`}
            className="flex items-center gap-1.5 text-sm font-display font-semibold text-stem-teal hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao Mundo
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card accent="teal">
            <h3 className="font-display font-bold text-stem-ink flex items-center gap-2 mb-3">
              <Key className="w-4 h-4" /> Código de acesso da sala
            </h3>
            <div className="flex items-center gap-2">
              <span className="flex-1 text-center font-display font-extrabold text-2xl text-stem-teal tracking-widest bg-stem-mist rounded-xl py-3">
                {classRoom.roomPasscode}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(classRoom.roomPasscode);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="p-3 rounded-xl border-2 border-stem-line hover:border-stem-teal"
              >
                {copied ? <CheckCircle className="w-5 h-5 text-stem-teal" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs font-body-stem text-stem-ink-soft mt-2">
              {classRoom.studentIds.length} aluno(s) na turma.
            </p>
          </Card>

          <Card accent="coral">
            <h3 className="font-display font-bold text-stem-ink flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4" /> Disparar Quick-Hack
            </h3>
            <p className="text-sm font-body-stem text-stem-ink-soft mb-3">
              Transmite um enigma de 3 minutos para toda a turma.
            </p>
            <Button variant="danger" fullWidth onClick={classState.handleTriggerQuickHack}>
              Transmitir desafio
            </Button>
          </Card>
        </div>

        <Card accent="violet">
          <h3 className="font-display font-bold text-stem-ink mb-3">Conceder XP ao vivo</h3>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="number"
              value={xpAmount}
              onChange={(e) => setXpAmount(Number(e.target.value))}
              className="w-28 rounded-xl border-2 border-stem-line px-3 py-2 font-display font-bold outline-none focus:border-stem-violet"
            />
            <Button onClick={() => applyUserPatch((current) => ({ xp: current.xp + xpAmount }))}>
              Conceder {xpAmount} XP
            </Button>
            {[10, 25, 50, 100].map((v) => (
              <button
                key={v}
                onClick={() => applyUserPatch((current) => ({ xp: current.xp + v }))}
                className="text-xs font-display font-bold text-stem-violet border-2 border-stem-violet/30 rounded-full px-3 py-1.5 hover:bg-stem-violet/10"
              >
                +{v}
              </button>
            ))}
          </div>
        </Card>

        <Card accent="amber">
          <h3 className="font-display font-bold text-stem-ink mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-stem-amber" /> Validações pendentes ({pendingValidations.length})
          </h3>
          <p className="text-xs font-body-stem text-stem-ink-soft mb-3">
            Confira o trabalho do aluno pessoalmente antes de revelar o código — é isso que libera o XP.
          </p>
          {pendingValidations.length === 0 ? (
            <p className="text-sm font-body-stem text-stem-ink-soft text-center py-4">
              Nenhum aluno com missão em andamento no momento.
            </p>
          ) : (
            <div className="space-y-3">
              {pendingValidations.map((q) => {
                const validation = validations.find((v) => v.questId === q.id);
                return (
                  <div key={q.id} className="bg-stem-mist rounded-xl p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="font-display font-bold text-sm text-stem-ink">{q.title}</p>
                        <p className="text-xs font-body-stem text-stem-ink-soft">
                          {q.pendingValidationStudentName ?? 'Aventureiro'} está com esta missão
                        </p>
                      </div>
                      {validation && <ValidationCodeReveal token={validation.token} />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="font-display font-bold text-stem-ink mb-3">
            Missões propostas por alunos ({proposedQuests.length})
          </h3>
          {proposedQuests.length === 0 ? (
            <p className="text-sm font-body-stem text-stem-ink-soft text-center py-4">Nenhuma missão pendente.</p>
          ) : (
            <div className="space-y-3">
              {proposedQuests.map((q) => (
                <div
                  key={q.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stem-mist rounded-xl p-4"
                >
                  <div>
                    <p className="font-display font-bold text-sm text-stem-ink">{q.title}</p>
                    <p className="text-sm font-body-stem text-stem-ink-soft">{q.description}</p>
                  </div>
                  <Button onClick={() => classState.handleApproveQuest(q.id)}>
                    <CheckCircle className="w-4 h-4" /> Aprovar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
