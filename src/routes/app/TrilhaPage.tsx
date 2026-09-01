import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Trail } from '../../components/trail/Trail';
import { Card } from '../../components/stem/Card';
import { Button } from '../../components/stem/Button';
import { SkillProfileSurvey } from '../../components/survey/SkillProfileSurvey';
import { getRecommendedCategories } from '../../data/skillProfileSurvey';
import type { ClassOutletContext } from './ClassLayout';

export const TrilhaPage: React.FC = () => {
  const {
    skills,
    quests,
    handleUnlockSkill,
    handleAcceptQuest,
    handleCompleteSkillSurvey,
    handleSkipSkillSurvey,
    classRoom
  } = useOutletContext<ClassOutletContext>();
  const { profile } = useAuth();
  const [showSurvey, setShowSurvey] = useState(false);
  if (!profile) return null;

  const recommendedCategories = getRecommendedCategories(profile.skillArchetype);

  const showInvite = !profile.skillArchetype && !profile.skillProfileSkippedAt;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-stem-ink">Trilha de {classRoom.name}</h1>
        <p className="font-body-stem text-sm text-stem-ink-soft">
          Siga o caminho: desbloqueie habilidades e complete missões para avançar.
        </p>
      </div>

      {showInvite && (
        <Card accent="violet">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Compass className="w-8 h-8 text-stem-violet shrink-0" />
            <div className="flex-1 text-center sm:text-left">
              <p className="font-display font-bold text-stem-ink">Descubra seu arquétipo de aventureiro</p>
              <p className="text-sm font-body-stem text-stem-ink-soft">
                Responda um questionário rápido e a gente destaca os nós da Trilha que mais combinam com você.
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="ghost" onClick={handleSkipSkillSurvey}>
                Agora não
              </Button>
              <Button onClick={() => setShowSurvey(true)}>Descobrir</Button>
            </div>
          </div>
        </Card>
      )}

      <Trail
        skills={skills}
        quests={quests}
        unlockedSkillIds={profile.unlockedSkills}
        currentUid={profile.uid}
        avatarHead={profile.avatarConfig.head}
        recommendedCategories={recommendedCategories}
        onUnlockSkill={handleUnlockSkill}
        onAcceptQuest={handleAcceptQuest}
      />

      {showSurvey && (
        <SkillProfileSurvey
          onComplete={handleCompleteSkillSurvey}
          onSkip={() => {
            handleSkipSkillSurvey();
            setShowSurvey(false);
          }}
          onClose={() => setShowSurvey(false)}
        />
      )}
    </div>
  );
};
