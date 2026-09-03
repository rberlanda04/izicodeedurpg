import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface LevelUpCelebrationProps {
  level: number;
  onClose: () => void;
}

/**
 * O único lugar que toca soundEngine.playLevelUp() — todo outro ganho de XP
 * usa playSuccess(), reservando essa fanfarra pro momento em que o nível
 * realmente sobe (ver maybeCelebrateLevelUp em useClassLocalState.ts).
 */
export const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({ level, onClose }) => {
  useEffect(() => {
    soundEngine.playLevelUp();
    confetti({ particleCount: 220, spread: 100, origin: { y: 0.5 }, ticks: 250 });
    const second = setTimeout(
      () => confetti({ particleCount: 120, spread: 140, startVelocity: 45, origin: { y: 0.4 } }),
      300
    );
    return () => clearTimeout(second);
  }, []);

  return (
    <div className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm sunflower-box overflow-hidden text-center text-white shadow-[0_0_60px_rgba(255,183,0,0.35)] animate-in zoom-in-95 duration-300">
        <div className="bg-[#101724] border-b-2 border-[#22334a] px-4 py-2.5 flex items-center justify-center gap-2 font-pixel text-[10px] text-amber-300">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" /> SUBIU DE NÍVEL!
        </div>
        <div className="p-8 space-y-4">
          <div className="w-24 h-24 rounded-full bg-slate-900 border-4 border-amber-400 text-4xl flex items-center justify-center mx-auto shadow-[0_0_35px_rgba(255,183,0,0.6)] animate-bounce">
            🎉
          </div>
          <div>
            <p className="font-pixel text-[10px] text-slate-400">VOCÊ ALCANÇOU O</p>
            <p className="font-pixel text-3xl text-amber-300 mt-1">NÍVEL {level}</p>
          </div>
          <p className="text-sm font-body-stem text-slate-300">
            Sua jornada de aventureiro Maker continua ficando mais forte!
          </p>
          <button onClick={onClose} className="sunflower-btn sunflower-btn-gold text-[10px] py-2.5 px-6 font-pixel mx-auto">
            CONTINUAR
          </button>
        </div>
      </div>
    </div>
  );
};
