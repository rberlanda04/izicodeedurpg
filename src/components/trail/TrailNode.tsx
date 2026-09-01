import React from 'react';
import { Lock, Check, Sparkles, Scroll, Star } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';
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

export const TrailNode: React.FC<TrailNodeProps> = ({ kind, icon, status, x, y, isRecommended, onClick }) => {
  const badge =
    status === 'locked' ? (
      <Lock className="w-4 h-4 text-slate-500" />
    ) : status === 'completed' ? (
      <Check className="w-5 h-5 text-emerald-300" strokeWidth={3} />
    ) : kind === 'quest' ? (
      <Scroll className="w-5 h-5 text-amber-300 animate-pulse" />
    ) : (
      <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
    );

  const getStatusStyles = () => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-b from-[#1b8a5a] to-[#0f5c3b] border-emerald-400 text-white shadow-[0_5px_0_0_#093824,0_0_15px_rgba(46,204,113,0.5)] hover:scale-110';
      case 'available':
        return 'bg-gradient-to-b from-[#f1c40f] to-[#d4ac0d] border-[#fff099] text-slate-950 shadow-[0_5px_0_0_#7d6608,0_0_20px_rgba(241,196,15,0.7)] animate-[pulseRing_2s_ease-out_infinite] hover:scale-115';
      case 'locked':
      default:
        return 'bg-[#162130] border-[#2c3e55] text-slate-500 shadow-[0_4px_0_0_#0c131c] cursor-not-allowed opacity-75';
    }
  };

  return (
    <div
      style={{ left: `${x}%`, top: y }}
      className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
    >
      <button
        onClick={() => {
          if (status !== 'locked') {
            soundEngine.playClick();
            onClick();
          } else {
            soundEngine.playWrong();
          }
        }}
        disabled={status === 'locked'}
        className={`w-15 h-15 sm:w-17 sm:h-17 rounded-2xl border-4 flex items-center justify-center text-2xl transition-all duration-150 select-none ${getStatusStyles()}`}
        title={kind === 'quest' ? 'Missão' : 'Habilidade'}
      >
        {status === 'available' ? <span>{icon}</span> : status === 'completed' ? <span>{icon}</span> : badge}
        
        {/* Selo de Concluído / Check */}
        {status === 'completed' && (
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center shadow">
            <Check className="w-3 h-3 text-slate-950 font-bold" strokeWidth={3} />
          </span>
        )}

        {/* Estrela de Arquétipo Recomendado */}
        {isRecommended && status !== 'locked' && (
          <span
            className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-amber-400 border-2 border-slate-900 flex items-center justify-center shadow animate-bounce"
            title="Combina com seu arquétipo maker!"
          >
            <Star className="w-3.5 h-3.5 text-slate-950" fill="currentColor" />
          </span>
        )}
      </button>
    </div>
  );
};

