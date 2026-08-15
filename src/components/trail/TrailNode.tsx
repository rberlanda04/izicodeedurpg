import React from 'react';
import { Lock, Check, Sparkles, Scroll } from 'lucide-react';
import type { TrailNodeKind } from './useTrailLayout';

export type TrailNodeStatus = 'locked' | 'available' | 'completed';

interface TrailNodeProps {
  kind: TrailNodeKind;
  icon: string;
  status: TrailNodeStatus;
  x: number; // percent
  y: number; // px
  onClick: () => void;
}

const statusClasses: Record<TrailNodeStatus, string> = {
  locked: 'bg-stem-line text-stem-ink-soft border-stem-line cursor-not-allowed',
  available:
    'bg-stem-amber text-stem-ink border-[#c97f2e] shadow-[0_5px_0_0_#c97f2e] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none',
  completed: 'bg-stem-teal text-white border-stem-teal-dark shadow-[0_5px_0_0_#0a5a59] hover:-translate-y-0.5'
};

export const TrailNode: React.FC<TrailNodeProps> = ({ kind, icon, status, x, y, onClick }) => {
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
    </button>
  );
};
