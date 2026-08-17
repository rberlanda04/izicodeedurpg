import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Trail } from '../../components/trail/Trail';
import type { ClassOutletContext } from './ClassLayout';

export const TrilhaPage: React.FC = () => {
  const { skills, quests, handleUnlockSkill, handleAcceptQuest, classRoom } =
    useOutletContext<ClassOutletContext>();
  const { profile } = useAuth();
  if (!profile) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-stem-ink">Trilha de {classRoom.name}</h1>
        <p className="font-body-stem text-sm text-stem-ink-soft">
          Siga o caminho: desbloqueie habilidades e complete missões para avançar.
        </p>
      </div>
      <Trail
        skills={skills}
        quests={quests}
        unlockedSkillIds={profile.unlockedSkills}
        currentUid={profile.uid}
        onUnlockSkill={handleUnlockSkill}
        onAcceptQuest={handleAcceptQuest}
      />
    </div>
  );
};
