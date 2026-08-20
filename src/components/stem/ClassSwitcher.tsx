import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, School } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { listClassesByIds } from '../../services/classRepo';
import type { ClassRoom } from '../../types';

export const ClassSwitcher: React.FC = () => {
  const { profile, activeClassId, setActiveClassId } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [open, setOpen] = useState(false);

  const allClassIds = React.useMemo(
    () => [...(profile?.classIdsAsGameMaster ?? []), ...(profile?.classIdsAsStudent ?? [])],
    [profile]
  );

  useEffect(() => {
    if (allClassIds.length === 0) {
      setClasses([]);
      return;
    }
    listClassesByIds(allClassIds).then(setClasses);
  }, [allClassIds.join(',')]);

  if (allClassIds.length <= 1) return null;

  const activeClass = classes.find((c) => c.id === activeClassId);

  const handlePick = (classId: string) => {
    setActiveClassId(classId);
    setOpen(false);
    navigate(`/app/${classId}/trilha`);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 bg-stem-mist border-2 border-stem-line rounded-xl px-3 py-2 text-sm font-display font-semibold text-stem-ink hover:border-stem-teal transition-colors"
      >
        <School className="w-4 h-4 text-stem-teal" />
        <span className="max-w-[5rem] sm:max-w-[10rem] truncate">{activeClass?.name ?? 'Selecionar turma'}</span>
        <ChevronDown className="w-4 h-4 text-stem-ink-soft" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-stem-cloud border-2 border-stem-line rounded-2xl shadow-lg overflow-hidden z-50">
          {classes.map((c) => (
            <button
              key={c.id}
              onClick={() => handlePick(c.id)}
              className={`w-full text-left px-4 py-3 text-sm font-body-stem hover:bg-stem-mist transition-colors ${
                c.id === activeClassId ? 'bg-stem-mist font-semibold' : ''
              }`}
            >
              {c.name}
              <span className="block text-xs text-stem-ink-soft">{c.gradeRange}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
