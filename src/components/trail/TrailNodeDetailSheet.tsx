import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Zap, Gift, BookOpen, Key } from 'lucide-react';
import { Button } from '../stem/Button';
import { ToolBadgeRow } from '../stem/ToolBadge';
import { QuestGuideModal } from '../stem/QuestGuideModal';
import { SDG_NAMES } from '../../data/sdgGoals';
import type { SkillNode, Quest } from '../../types';
import type { TrailNodeStatus } from './TrailNode';

interface SkillSheet {
  kind: 'skill';
  data: SkillNode;
  status: TrailNodeStatus;
  onUnlock: () => void;
}

interface QuestSheet {
  kind: 'quest';
  data: Quest;
  status: TrailNodeStatus;
  currentUid: string;
  onAccept: () => void;
}

type TrailNodeDetailSheetProps = (SkillSheet | QuestSheet) & { onClose: () => void };

export const TrailNodeDetailSheet: React.FC<TrailNodeDetailSheetProps> = (props) => {
  const { onClose, status } = props;
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-stem-ink/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-stem-cloud rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-6 space-y-4 animate-[slideUp_0.2s_ease-out]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{props.kind === 'skill' ? props.data.icon : '📜'}</span>
            <div>
              <h3 className="font-display font-extrabold text-lg text-stem-ink">
                {props.kind === 'skill' ? props.data.title : props.data.title}
              </h3>
              <p className="text-xs font-body-stem text-stem-ink-soft uppercase tracking-wide">
                {props.kind === 'skill' ? 'Habilidade' : 'Missão'} · {props.data.tier}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-stem-ink-soft hover:text-stem-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="font-body-stem text-sm text-stem-ink-soft leading-relaxed">{props.data.description}</p>

        {props.kind === 'quest' && (
          <>
            <div className="flex flex-wrap gap-2">
              {props.data.sdgGoals.map((g) => (
                <span
                  key={g}
                  className="text-xs font-display font-bold px-2 py-1 rounded-full bg-stem-violet/10 text-stem-violet"
                >
                  ODS {g} · {SDG_NAMES[g]}
                </span>
              ))}
            </div>
            {props.data.hardwareRequired.length > 0 && (
              <ToolBadgeRow tools={props.data.hardwareRequired} size="sm" />
            )}
          </>
        )}

        <div className="flex items-center gap-4 bg-stem-mist rounded-2xl px-4 py-3">
          <span className="flex items-center gap-1 font-display font-bold text-stem-violet text-sm">
            <Zap className="w-4 h-4" /> +{props.kind === 'skill' ? 200 : props.data.xpReward} XP
          </span>
          <span className="flex items-center gap-1 font-display font-bold text-stem-amber text-sm">
            <Gift className="w-4 h-4" /> +{props.kind === 'skill' ? 40 : props.data.coinReward} moedas
          </span>
        </div>

        {props.kind === 'quest' && props.data.guideContent && (
          <Button fullWidth variant="ghost" onClick={() => setShowGuide(true)}>
            <BookOpen className="w-4 h-4" /> Ver tutorial completo
          </Button>
        )}

        {status === 'completed' ? (
          <div className="text-center font-display font-bold text-stem-teal py-2">✓ Concluído!</div>
        ) : status === 'locked' ? (
          <div className="text-center font-body-stem text-sm text-stem-ink-soft py-2">
            Complete os pré-requisitos para desbloquear.
          </div>
        ) : props.kind === 'skill' ? (
          <Button fullWidth onClick={props.onUnlock}>
            Desbloquear habilidade
          </Button>
        ) : props.data.status === 'PENDING_VALIDATION' ? (
          props.data.pendingValidationStudentUid === props.currentUid ? (
            <Link to="../missoes">
              <Button fullWidth>
                <Key className="w-4 h-4" /> Peça o código ao professor no Mural de Missões
              </Button>
            </Link>
          ) : (
            <div className="text-center font-body-stem text-sm text-stem-ink-soft py-2">
              {props.data.pendingValidationStudentName ?? 'Um colega'} está validando esta missão com o Game Master.
            </div>
          )
        ) : (
          <Button fullWidth onClick={props.onAccept}>
            Aceitar desafio
          </Button>
        )}
      </div>

      {props.kind === 'quest' && showGuide && (
        <QuestGuideModal quest={props.data} onClose={() => setShowGuide(false)} />
      )}
    </div>
  );
};
