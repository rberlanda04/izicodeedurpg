import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getClass } from '../services/classRepo';
import { ErrorState } from '../components/stem/ErrorState';

interface ProtectedRouteProps {
  requireRole?: 'GAME_MASTER' | 'ADMIN';
  /** When true, checks the role against the :classId or :schoolId route param. */
  matchParam?: 'classId' | 'schoolId';
}

const FullPageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-stem-mist">
    <span className="font-display font-bold text-stem-teal animate-pulse">Carregando...</span>
  </div>
);

const NoAccess: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-stem-mist text-center gap-3 px-4">
    <span className="text-5xl">🔒</span>
    <h1 className="font-display font-extrabold text-xl text-stem-ink">Sem acesso a esta área</h1>
    <p className="font-body-stem text-sm text-stem-ink-soft max-w-sm">
      Sua conta não tem o papel necessário para ver esta página. Fale com o Game Master ou coordenação da sua escola.
    </p>
  </div>
);

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireRole, matchParam }) => {
  const { firebaseUser, profile, loading, profileError, isGmOfClass, isSchoolAdmin } = useAuth();
  const params = useParams();

  // A :classId route param isn't a schoolId — school admins are only
  // recognizable on a GM route by resolving the class's own schoolId first
  // and checking THAT against schoolAdminOf, not the classId itself.
  const needsClassSchoolLookup = requireRole === 'GAME_MASTER' && matchParam === 'classId';
  const [classSchoolId, setClassSchoolId] = useState<string | null>(null);
  const [resolvingClass, setResolvingClass] = useState(needsClassSchoolLookup);

  useEffect(() => {
    if (!needsClassSchoolLookup) return;
    const classId = params.classId;
    if (!classId) {
      setResolvingClass(false);
      return;
    }
    getClass(classId)
      .then((classRoom) => {
        setClassSchoolId(classRoom?.schoolId ?? null);
      })
      .catch((error) => {
        // Previously left `resolvingClass` true forever on failure — the
        // safe default here is to deny access, not hang on a loader.
        console.error('Falha ao resolver a turma para checagem de permissão:', error);
        setClassSchoolId(null);
      })
      .finally(() => setResolvingClass(false));
  }, [needsClassSchoolLookup, params.classId]);

  if (loading || (needsClassSchoolLookup && resolvingClass)) return <FullPageLoader />;
  if (profileError) return <ErrorState message={profileError} />;
  if (!firebaseUser || !profile) return <Navigate to="/entrar" replace />;

  if (requireRole && matchParam) {
    const paramValue = params[matchParam];
    if (!paramValue) return <NoAccess />;

    const allowed =
      requireRole === 'ADMIN'
        ? isSchoolAdmin(paramValue)
        : isGmOfClass(paramValue) || (classSchoolId !== null && isSchoolAdmin(classSchoolId));

    if (!allowed) return <NoAccess />;
  }

  return <Outlet />;
};
