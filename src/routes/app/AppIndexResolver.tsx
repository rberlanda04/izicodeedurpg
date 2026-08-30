import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { listClassesByIds } from '../../services/classRepo';
import type { ClassRoom } from '../../types';
import { Card } from '../../components/stem/Card';

/**
 * Resolves which turma to land on: 0 turmas -> onboarding, 1 -> straight
 * to its Mundo (overworld), 2+ -> a picker (a GM/Admin with several classes).
 */
export const AppIndexResolver: React.FC = () => {
  const { profile, activeClassId, setActiveClassId } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState<ClassRoom[] | null>(null);

  const allClassIds = [...(profile?.classIdsAsGameMaster ?? []), ...(profile?.classIdsAsStudent ?? [])];

  useEffect(() => {
    if (allClassIds.length === 0) {
      setClasses([]);
      return;
    }
    listClassesByIds(allClassIds).then(setClasses);
  }, [allClassIds.join(',')]);

  if (!profile) return null;
  if (allClassIds.length === 0) return <Navigate to="/onboarding" replace />;
  if (activeClassId && allClassIds.includes(activeClassId)) {
    return <Navigate to={`/app/${activeClassId}/mundo`} replace />;
  }
  if (allClassIds.length === 1) return <Navigate to={`/app/${allClassIds[0]}/mundo`} replace />;

  if (classes === null) return null;

  return (
    <div className="min-h-screen bg-stem-mist flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-4">
        <h1 className="font-display font-extrabold text-xl text-stem-ink text-center">Escolha uma turma</h1>
        {classes.map((c) => (
          <Card
            key={c.id}
            accent="teal"
            className="cursor-pointer hover:-translate-y-0.5 transition-transform"
          >
            <button
              className="w-full text-left"
              onClick={() => {
                setActiveClassId(c.id);
                navigate(`/app/${c.id}/mundo`);
              }}
            >
              <p className="font-display font-bold text-stem-ink">{c.name}</p>
              <p className="text-sm text-stem-ink-soft font-body-stem">{c.gradeRange}</p>
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
};
