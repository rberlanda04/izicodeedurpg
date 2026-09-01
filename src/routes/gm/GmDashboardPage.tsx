import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Crown, Key, Zap, CheckCircle, Copy, ArrowLeft, ShieldCheck, Sparkles, Link2, ListChecks, Wrench, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { subscribeToClass } from '../../services/classRepo';
import { subscribeToClassValidations } from '../../services/questRepo';
import { subscribeToClassSkillValidationTokens } from '../../services/skillValidationRepo';
import { useClassLocalState } from '../../hooks/useClassLocalState';
import { useApplyUserPatch } from '../../hooks/useApplyUserPatch';
import { Card } from '../../components/stem/Card';
import { Button } from '../../components/stem/Button';
import { ErrorState } from '../../components/stem/ErrorState';
import { ValidationCodeReveal } from '../../components/stem/ValidationCodeReveal';
import type { ClassRoom, QuestValidation, SkillValidationToken } from '../../types';

export const GmDashboardPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const { profile, firebaseUser } = useAuth();
  const [classRoom, setClassRoom] = useState<ClassRoom | null>(null);
  const [classError, setClassError] = useState<string | null>(null);
  const [validations, setValidations] = useState<QuestValidation[]>([]);
  const [skillTokens, setSkillTokens] = useState<SkillValidationToken[]>([]);
  const [xpAmount, setXpAmount] = useState(100);
  const [copied, setCopied] = useState(false);
  const [resolvingRequestId, setResolvingRequestId] = useState<string | null>(null);

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
    // questValidations/skillValidationTokens são rules-restritos a GM/Admin
    // — o navegador de um aluno nunca consegue assinar isso com sucesso, e
    // é exatamente esse o ponto (o código só existe onde a turma não lê).
    const unsubQuest = subscribeToClassValidations(classId, setValidations, (error) =>
      console.error('Falha ao carregar validações pendentes:', error)
    );
    const unsubSkill = subscribeToClassSkillValidationTokens(classId, setSkillTokens, (error) =>
      console.error('Falha ao carregar códigos de habilidade:', error)
    );
    return () => {
      unsubQuest();
      unsubSkill();
    };
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
  const pendingHardwareRequests = classState.hardwareRequests.filter((r) => r.status === 'PENDING');

  const handleResolveHardware = async (requestId: string, decision: 'APPROVED' | 'DENIED') => {
    setResolvingRequestId(requestId);
    try {
      await classState.handleResolveHardwareRequest(requestId, decision);
    } catch (err) {
      console.error('Falha ao resolver pedido de material:', err);
    } finally {
      setResolvingRequestId(null);
    }
  };

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

        <Card accent="violet">
          <h3 className="font-display font-bold text-stem-ink mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-stem-violet" /> Validações de habilidades ({classState.skillValidations.length})
          </h3>
          <p className="text-xs font-body-stem text-stem-ink-soft mb-3">
            Um aluno pediu pra você validar uma habilidade pessoalmente (em vez de enviar um link de projeto).
          </p>
          {classState.skillValidations.length === 0 ? (
            <p className="text-sm font-body-stem text-stem-ink-soft text-center py-4">
              Nenhum pedido de validação de habilidade no momento.
            </p>
          ) : (
            <div className="space-y-3">
              {classState.skillValidations.map((v) => {
                const tokenDoc = skillTokens.find((t) => t.id === v.id);
                return (
                  <div key={v.id} className="bg-stem-mist rounded-xl p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="font-display font-bold text-sm text-stem-ink">{v.skillTitle}</p>
                        <p className="text-xs font-body-stem text-stem-ink-soft">{v.studentName} pediu validação</p>
                      </div>
                      {tokenDoc && <ValidationCodeReveal token={tokenDoc.token} />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="font-display font-bold text-stem-ink mb-3 flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-stem-ink-soft" /> Atividades concluídas recentemente (
            {classState.skillCompletions.length})
          </h3>
          {classState.skillCompletions.length === 0 ? (
            <p className="text-sm font-body-stem text-stem-ink-soft text-center py-4">
              Nenhuma habilidade concluída ainda nesta turma.
            </p>
          ) : (
            <div className="space-y-2">
              {[...classState.skillCompletions]
                .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
                .slice(0, 10)
                .map((c) => (
                  <div key={c.id} className="flex items-center justify-between gap-3 bg-stem-mist rounded-xl px-4 py-3">
                    <div className="min-w-0">
                      <p className="font-display font-bold text-sm text-stem-ink truncate">{c.skillTitle}</p>
                      <p className="text-xs font-body-stem text-stem-ink-soft">{c.studentName}</p>
                    </div>
                    {c.method === 'link' ? (
                      <a
                        href={c.projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-display font-bold text-stem-teal hover:underline shrink-0"
                      >
                        <Link2 className="w-3.5 h-3.5" /> ver projeto
                      </a>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-display font-bold text-stem-violet shrink-0">
                        <Key className="w-3.5 h-3.5" /> validado
                      </span>
                    )}
                  </div>
                ))}
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

        <Card accent="teal">
          <h3 className="font-display font-bold text-stem-ink mb-3 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-stem-teal" /> Solicitações de Material ({pendingHardwareRequests.length})
          </h3>
          <p className="text-xs font-body-stem text-stem-ink-soft mb-3">
            Um aluno pediu pra retirar um item do Maker Lab — aprovar debita os Izicoins e credita o item no
            inventário dele.
          </p>
          {pendingHardwareRequests.length === 0 ? (
            <p className="text-sm font-body-stem text-stem-ink-soft text-center py-4">
              Nenhum pedido de material no momento.
            </p>
          ) : (
            <div className="space-y-3">
              {pendingHardwareRequests.map((r) => {
                const busy = resolvingRequestId === r.id;
                return (
                  <div
                    key={r.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stem-mist rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{r.itemIcon}</span>
                      <div>
                        <p className="font-display font-bold text-sm text-stem-ink">{r.itemName}</p>
                        <p className="text-xs font-body-stem text-stem-ink-soft">
                          {r.studentName} · 🪙{r.coinCost}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" disabled={busy} onClick={() => void handleResolveHardware(r.id, 'DENIED')}>
                        <XCircle className="w-4 h-4" /> Negar
                      </Button>
                      <Button disabled={busy} onClick={() => void handleResolveHardware(r.id, 'APPROVED')}>
                        <CheckCircle className="w-4 h-4" /> Aprovar
                      </Button>
                    </div>
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
