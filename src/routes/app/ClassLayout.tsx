import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { subscribeToClass } from '../../services/classRepo';
import { useClassLocalState } from '../../hooks/useClassLocalState';
import { useApplyUserPatch } from '../../hooks/useApplyUserPatch';
import { TopNav } from '../../components/stem/TopNav';
import { Sidebar } from '../../components/stem/Sidebar';
import { ErrorState } from '../../components/stem/ErrorState';
import { HackerTerminalModal } from '../../components/HackerTerminalModal';
import type { ClassRoom } from '../../types';

export interface ClassOutletContext extends ReturnType<typeof useClassLocalState> {
  classRoom: ClassRoom;
}

export const ClassLayout: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const { profile, isMemberOfClass, setActiveClassId } = useAuth();
  const [classRoom, setClassRoom] = useState<ClassRoom | null>(null);
  const [classError, setClassError] = useState<string | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  useEffect(() => {
    if (!classId) return;
    setActiveClassId(classId);
    setClassError(null);
    return subscribeToClass(classId, setClassRoom, (error) => {
      // Previously silent — the screen was stuck on "Carregando turma..."
      // forever if this read failed (offline, permission change, etc.).
      console.error('Falha ao carregar a turma:', error);
      setClassError('Não foi possível carregar esta turma. Verifique sua conexão e tente novamente.');
    });
  }, [classId]);

  const applyUserPatch = useApplyUserPatch(profile);

  // Hooks below always run (React rule of hooks) — the hook safely no-ops on
  // fallback values while we wait for profile/classId to resolve.
  const classState = useClassLocalState(classId ?? 'unknown', profile!, applyUserPatch);

  if (!classId || !profile) return null;
  if (!isMemberOfClass(classId)) return <Navigate to="/app" replace />;
  if (classError) return <ErrorState message={classError} />;
  if (!classRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stem-mist">
        <span className="font-display font-bold text-stem-teal animate-pulse">Carregando turma...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stem-mist">
      <TopNav onOpenTerminal={() => setIsTerminalOpen(true)} />
      <div className="max-w-6xl mx-auto px-4 flex">
        <Sidebar classId={classId} />
        <main className="flex-1 py-6 min-w-0">
          <Outlet context={{ classRoom, ...classState } satisfies ClassOutletContext} />
        </main>
      </div>

      <HackerTerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        user={profile}
        onUnlockSecretQuest={classState.handleUnlockSecretQuest}
      />
    </div>
  );
};
