import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Compass, Sparkles, Zap, Award, BookOpen, Shield, Gamepad2, Map as MapIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Trail } from '../../components/trail/Trail';
import { TrailStageScreen } from '../../components/trail/TrailStageScreen';
import { Card } from '../../components/stem/Card';
import { Button } from '../../components/stem/Button';
import { SkillProfileSurvey } from '../../components/survey/SkillProfileSurvey';
import { getRecommendedCategories } from '../../data/skillProfileSurvey';
import { soundEngine } from '../../services/soundEngine';
import type { SkillNode, Quest } from '../../types';
import type { ClassOutletContext } from './ClassLayout';

export const TrilhaPage: React.FC = () => {
  const {
    skills,
    quests,
    handleUnlockSkill,
    handleAcceptQuest,
    handleCompleteSkillSurvey,
    handleSkipSkillSurvey,
    handleQuizAnswered,
    classRoom
  } = useOutletContext<ClassOutletContext>();
  const { profile } = useAuth();
  const [showSurvey, setShowSurvey] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'stage'>('map');
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  if (!profile) return null;

  // Unifica nós de habilidades e missões como fases ordenadas — mesmo filtro
  // de nós/missões secretos que o modo Mapa já aplica (Trail.tsx e
  // useTrailLayout.ts): um nó secreto só entra na lista depois de já
  // desbloqueado por outro caminho (Terminal Hacker), e uma missão secreta
  // nunca aparece aqui, os dois têm fluxo de desbloqueio próprio.
  const allStages: Array<{ kind: 'skill' | 'quest'; skill?: SkillNode; quest?: Quest }> = [
    ...skills
      .filter((s) => !s.isSecretNode || profile.unlockedSkills.includes(s.id))
      .map((s) => ({ kind: 'skill' as const, skill: s })),
    ...quests.filter((q) => !q.isSecretQuest).map((q) => ({ kind: 'quest' as const, quest: q }))
  ];

  const currentStage = allStages[currentStageIndex] || allStages[0];

  const getStageStatus = (stage: typeof currentStage) => {
    if (stage.kind === 'skill' && stage.skill) {
      if (profile.unlockedSkills.includes(stage.skill.id)) return 'completed';
      const ready = stage.skill.prerequisites.every((p) => profile.unlockedSkills.includes(p));
      return ready ? 'available' : 'locked';
    }
    if (stage.kind === 'quest' && stage.quest) {
      if (stage.quest.status === 'COMPLETED') return 'completed';
      const ready = stage.quest.requiredSkills.every((s) => profile.unlockedSkills.includes(s));
      return ready ? 'available' : 'locked';
    }
    return 'locked';
  };

  const recommendedCategories = getRecommendedCategories(profile.skillArchetype);
  const showInvite = !profile.skillArchetype && !profile.skillProfileSkippedAt;

  const totalSkills = skills.length;
  const unlockedCount = profile.unlockedSkills.length;
  const progressPercent = Math.min(100, Math.round((unlockedCount / (totalSkills || 1)) * 100));

  return (
    <div className="relative space-y-3">
      {/* RPG Trail Top Action & View Selector */}
      <div className="sunflower-box p-3 flex flex-wrap items-center justify-between gap-3 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center text-xl shadow-[0_0_12px_rgba(0,225,255,0.4)]">
            {viewMode === 'map' ? '🗺️' : '🎮'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-pixel text-xs text-cyan-300">TRILHA RPG · {classRoom.name}</h1>
              <span className="font-pixel text-[9px] bg-amber-950 text-amber-300 border border-amber-500 px-1.5 py-0.5 rounded">
                {viewMode === 'map' ? 'MODO MAPA' : `FASE ${currentStageIndex + 1} DE ${allStages.length}`}
              </span>
            </div>
            <p className="text-[11px] font-body-stem text-slate-300">
              Guardiões: <span className="text-cyan-300 font-semibold">Ada Lovelace</span> & <span className="text-amber-300 font-semibold">Tinker Byte</span>
            </p>
          </div>
        </div>

        {/* Alternador de Modo: Mapa Geral vs Arena de Fases */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => {
              soundEngine.playClick();
              setViewMode((m) => (m === 'map' ? 'stage' : 'map'));
            }}
            className={`sunflower-btn text-[10px] py-1.5 px-3 flex items-center gap-1.5 ${viewMode === 'stage' ? 'sunflower-btn-gold' : 'sunflower-btn-cyber'}`}
          >
            {viewMode === 'map' ? (
              <>
                <Gamepad2 className="w-3.5 h-3.5" /> JOGAR FASE A FASE
              </>
            ) : (
              <>
                <MapIcon className="w-3.5 h-3.5" /> VER MAPA GERAL
              </>
            )}
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              setShowSurvey(true);
            }}
            className="sunflower-btn text-[10px] py-1.5 px-3 flex items-center gap-1.5 bg-purple-950 border-purple-500 text-purple-200"
            title="Descobrir seu arquétipo maker"
          >
            <Compass className="w-3.5 h-3.5" /> ARQUÉTIPO
          </button>
        </div>
      </div>

      {showInvite && (
        <div className="absolute top-16 right-4 z-20 max-w-xs animate-in slide-in-from-right-4 duration-300">
          <div className="sunflower-box p-3 text-white">
            <div className="flex items-start gap-3">
              <Compass className="w-6 h-6 text-amber-400 shrink-0 animate-spin" />
              <div className="flex-1">
                <p className="font-pixel text-xs text-amber-300">DESCUBRA SEU ARQUÉTIPO</p>
                <p className="text-[11px] font-body-stem text-slate-200 mt-1">
                  Responda o oráculo rápido para Ada e Byte destacarem os nós ideais para você!
                </p>
                <div className="flex gap-2 mt-2.5">
                  <button
                    onClick={handleSkipSkillSurvey}
                    className="pixel-btn text-[9px] py-1 px-2 text-slate-400"
                  >
                    Agora não
                  </button>
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setShowSurvey(true);
                    }}
                    className="sunflower-btn text-[9px] py-1 px-3 font-pixel"
                  >
                    DESCOBRIR
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDERIZAÇÃO: MODO MAPA OU ARENA DE FASES */}
      {viewMode === 'stage' ? (
        <TrailStageScreen
          stageIndex={currentStageIndex}
          totalStages={allStages.length}
          kind={currentStage.kind}
          skill={currentStage.skill}
          quest={currentStage.quest}
          status={getStageStatus(currentStage)}
          userCoins={profile.izicoins ?? 0}
          userLevel={profile.level ?? 1}
          authorName={profile.adventureName}
          onPrevStage={() => {
            soundEngine.playClick();
            setCurrentStageIndex((idx) => Math.max(0, idx - 1));
          }}
          onNextStage={() => {
            soundEngine.playClick();
            setCurrentStageIndex((idx) => Math.min(allStages.length - 1, idx + 1));
          }}
          onUnlockSkill={handleUnlockSkill}
          onAcceptQuest={handleAcceptQuest}
          quizStreak={profile.quizStreak}
          onQuizAnswered={handleQuizAnswered}
          onBackToMap={() => {
            soundEngine.playClick();
            setViewMode('map');
          }}
        />
      ) : (
        <div className="rounded-xl overflow-hidden border-4 border-[#2b3e5c] shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          <Trail
            skills={skills}
            quests={quests}
            unlockedSkillIds={profile.unlockedSkills}
            currentUid={profile.uid}
            avatarHead={profile.avatarConfig.head}
            recommendedCategories={recommendedCategories}
            quizStreak={profile.quizStreak}
            onQuizAnswered={handleQuizAnswered}
            onUnlockSkill={handleUnlockSkill}
            onAcceptQuest={handleAcceptQuest}
          />
        </div>
      )}

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


