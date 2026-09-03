import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { subscribeToClass } from '../../services/classRepo';
import { useClassLocalState } from '../../hooks/useClassLocalState';
import { useApplyUserPatch } from '../../hooks/useApplyUserPatch';
import { TopNav } from '../../components/stem/TopNav';
import { Sidebar } from '../../components/stem/Sidebar';
import { ErrorState } from '../../components/stem/ErrorState';
import { HackerTerminalModal } from '../../components/HackerTerminalModal';
import { LevelUpCelebration } from '../../components/LevelUpCelebration';
import { BattleScreen } from '../../components/battle/BattleScreen';
import type { ClassRoom } from '../../types';

export interface ClassOutletContext extends ReturnType<typeof useClassLocalState> {
  classRoom: ClassRoom;
}

export const ClassLayout: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const location = useLocation();
  // Trilha é a única rota em tela cheia por enquanto — sem sidebar fixa,
  // cenário ilustrado edge-to-edge, HUD flutuante (ver TrilhaPage.tsx).
  const isFullBleedRoute = location.pathname.endsWith('/trilha');
  const { profile, firebaseUser, isMemberOfClass, setActiveClassId } = useAuth();
  const [classRoom, setClassRoom] = useState<ClassRoom | null>(null);
  const [classError, setClassError] = useState<string | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

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
  // fallback values while we wait for profile/classId/classRoom to resolve.
  const classState = useClassLocalState(classId ?? 'unknown', classRoom?.schoolId ?? '', profile!, applyUserPatch, firebaseUser);

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
      <TopNav onOpenTerminal={() => setIsTerminalOpen(true)} onOpenMenu={() => setIsMobileNavOpen(true)} />
      <div className={isFullBleedRoute ? 'flex' : 'max-w-6xl mx-auto px-4 flex'}>
        <Sidebar
          classId={classId}
          mobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
          onOpenTerminal={() => setIsTerminalOpen(true)}
          hideDesktopColumn={isFullBleedRoute}
        />
        <main className={isFullBleedRoute ? 'flex-1 min-w-0 relative' : 'flex-1 py-6 min-w-0'}>
          {isFullBleedRoute && !classState.activeChallenge && (
            <button
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Abrir menu de navegação"
              className="fixed top-20 left-4 z-40 p-2.5 rounded-xl bg-stem-cloud/90 backdrop-blur border-2 border-stem-line shadow-lg hover:border-stem-teal transition-colors"
            >
              <Menu className="w-5 h-5 text-stem-ink" />
            </button>
          )}
          {classState.activeChallenge ? (
            // Trava a navegação de propósito: não importa qual link da
            // Sidebar o aluno clicar, a URL muda mas o ClassLayout continua
            // envolvendo TODAS as rotas filhas — então o conteúdo real só
            // volta a aparecer quando activeChallenge some (cancelado ou
            // concluído), nunca por navegação direta.
            <BattleScreen
              challenge={classState.activeChallenge}
              validationError={classState.validationError}
              onValidateQuestCode={classState.handleValidateQuest}
              onValidateSkillCode={classState.handleValidateSkillToken}
              onCompleteSkillWithLink={classState.handleCompleteSkillWithLink}
              onRequestSkillTeacherValidation={classState.handleRequestSkillTeacherValidation}
              onCancel={classState.handleCancelActiveChallenge}
            />
          ) : (
            <Outlet context={{ classRoom, ...classState } satisfies ClassOutletContext} />
          )}
        </main>
      </div>

      <HackerTerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        user={profile}
        onUnlockSecretQuest={classState.handleUnlockSecretQuest}
      />

      {classState.levelUpInfo && (
        <LevelUpCelebration level={classState.levelUpInfo.level} onClose={classState.handleCloseLevelUp} />
      )}
    </div>
  );
};
