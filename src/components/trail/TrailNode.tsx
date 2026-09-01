import React from 'react';
import { Lock, Check, Sparkles, Scroll, Star } from 'lucide-react';
import type { TrailNodeKind } from './useTrailLayout';

export type TrailNodeStatus = 'locked' | 'available' | 'completed';

interface TrailNodeProps {
  kind: TrailNodeKind;
  icon: string;
  status: TrailNodeStatus;
  x: number; // percent
  y: number; // px
  isRecommended?: boolean;
  onClick: () => void;
}

const statusClasses: Record<TrailNodeStatus, string> = {
  locked: 'bg-stem-line text-stem-ink-soft border-stem-line cursor-not-allowed',
  available:
    'bg-stem-amber text-stem-ink border-[#8f5f2f] shadow-[0_5px_0_0_#8f5f2f] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none [animation:pulseRing_2s_ease-out_infinite]',
  completed: 'bg-stem-teal text-white border-stem-teal-dark shadow-[0_5px_0_0_#1a8fd1] hover:-translate-y-0.5'
};

export const TrailNode: React.FC<TrailNodeProps> = ({ kind, icon, status, x, y, isRecommended, onClick }) => {
  const badge =
    status === 'locked' ? (
      <Lock className="w-4 h-4" />
    ) : status === 'completed' ? (
      <Check className="w-5 h-5" />
    ) : kind === 'quest' ? (
      <Scroll className="w-5 h-5" />
    ) : (
      <Sparkles className="w-5 h-5" />
    );

  return (
    <button
      onClick={onClick}
      disabled={status === 'locked'}
      style={{ left: `${x}%`, top: y }}
      className={`absolute -translate-x-1/2 w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl transition-all ${statusClasses[status]}`}
      title={kind === 'quest' ? 'Missão' : 'Habilidade'}
    >
      {status === 'available' ? <span>{icon}</span> : badge}
      {isRecommended && status !== 'locked' && (
        <span
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-stem-amber border-2 border-stem-cloud flex items-center justify-center"
          title="Combina com seu arquétipo"
        >
          <Star className="w-3 h-3 text-stem-ink" fill="currentColor" />
        </span>
      )}
    </button>
  );
};
