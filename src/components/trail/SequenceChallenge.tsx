import React, { useMemo, useState } from 'react';
import { X, ListOrdered, RotateCcw } from 'lucide-react';
import { Button } from '../stem/Button';
import { soundEngine } from '../../services/soundEngine';
import type { SequencePuzzle } from '../../types';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  // Um embaralhamento que por acaso mantém tudo na ordem certa não testaria
  // nada — reembaralha nesse caso raro.
  return copy.every((v, i) => v === arr[i]) && arr.length > 1 ? shuffle(arr) : copy;
}

interface SequenceChallengeProps {
  puzzle: SequencePuzzle;
  onSuccess: () => void;
  onClose: () => void;
}

/**
 * Segundo tipo de minigame de lógica (além do QuizChallenge): reconstruir a
 * ordem correta de um processo real do currículo, clicando os passos
 * embaralhados na sequência que o aluno acredita ser certa. Usado nos
 * pontos de encontro do Mundo (Overworld).
 */
export const SequenceChallenge: React.FC<SequenceChallengeProps> = ({ puzzle, onSuccess, onClose }) => {
  const pool = useMemo(() => shuffle(puzzle.steps), [puzzle.id]);
  const [remaining, setRemaining] = useState<string[]>(pool);
  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'wrong' | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  const pick = (step: string) => {
    if (feedback || succeeded) return;
    const nextSelected = [...selected, step];
    setSelected(nextSelected);
    setRemaining((prev) => prev.filter((s) => s !== step));

    if (nextSelected.length === puzzle.steps.length) {
      const isCorrect = nextSelected.every((s, i) => s === puzzle.steps[i]);
      if (isCorrect) {
        soundEngine.playCorrect();
        setSucceeded(true);
        setTimeout(onSuccess, 800);
      } else {
        soundEngine.playWrong();
        setFeedback('wrong');
        setTimeout(() => {
          setFeedback(null);
          setSelected([]);
          setRemaining(shuffle(puzzle.steps));
        }, 900);
      }
    }
  };

  const undoLast = () => {
    if (feedback || succeeded || selected.length === 0) return;
    const last = selected[selected.length - 1];
    setSelected((prev) => prev.slice(0, -1));
    setRemaining((prev) => [...prev, last]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stem-ink/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-stem-cloud rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-6 space-y-4 animate-[slideUp_0.2s_ease-out]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{puzzle.icon}</span>
            <div>
              <h3 className="font-display font-extrabold text-lg text-stem-ink">{puzzle.title}</h3>
              <p className="text-xs font-body-stem text-stem-ink-soft flex items-center gap-1">
                <ListOrdered className="w-3.5 h-3.5" /> {puzzle.instruction}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-stem-ink-soft hover:text-stem-ink shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {succeeded ? (
          <div className="flex flex-col items-center text-center gap-1 py-4">
            <img src="/trail/chest-reward.svg" alt="" className="w-24 h-24" />
            <p className="font-display font-bold text-stem-teal">Sequência correta!</p>
            <p className="text-sm font-body-stem text-stem-ink-soft">
              +{puzzle.xpReward} XP · 🪙 {puzzle.coinReward}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2 min-h-[52px]">
              {selected.length === 0 && (
                <p className="text-xs font-body-stem text-stem-ink-soft/70 text-center py-2">
                  Toque nos passos abaixo, na ordem que você acha certa.
                </p>
              )}
              {selected.map((step, idx) => (
                <div
                  key={step}
                  className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-body-stem ${
                    feedback === 'wrong'
                      ? 'border-stem-coral bg-stem-coral/10 text-stem-coral animate-[shakeX_0.4s_ease-in-out]'
                      : 'border-stem-teal bg-stem-teal/10 text-stem-ink'
                  }`}
                >
                  <span className="font-display font-bold text-stem-teal shrink-0">{idx + 1}.</span>
                  {step}
                </div>
              ))}
            </div>

            {selected.length > 0 && !feedback && (
              <button
                onClick={undoLast}
                className="flex items-center gap-1 text-xs font-display font-semibold text-stem-ink-soft hover:text-stem-ink"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Desfazer último
              </button>
            )}

            <div className="space-y-2 pt-2 border-t-2 border-stem-line">
              {remaining.map((step) => (
                <button
                  key={step}
                  onClick={() => pick(step)}
                  disabled={Boolean(feedback)}
                  className="w-full text-left text-sm font-body-stem px-3 py-2.5 rounded-xl border-2 border-stem-line bg-stem-mist hover:border-stem-violet/50 transition-colors disabled:opacity-50"
                >
                  {step}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
