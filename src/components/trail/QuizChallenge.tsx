import React, { useEffect, useState } from 'react';
import { Zap, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '../stem/Button';
import { soundEngine } from '../../services/soundEngine';
import type { SkillQuizQuestion } from '../../types';

const DURATION_SECONDS = 15;

interface QuizChallengeProps {
  question: SkillQuizQuestion;
  actionLabel: string; // ex: "Desbloquear habilidade", "Aceitar desafio"
  onSuccess: () => void;
}

/**
 * Desafio relâmpago reutilizável: uma pergunta de múltipla escolha com
 * cronômetro. Usado tanto para desbloquear uma habilidade na Trilha quanto
 * para aceitar uma missão (TrailNodeDetailSheet e MissoesPage) — sem punir
 * permanentemente quem erra ou estoura o tempo: o cronômetro reinicia e a
 * pergunta pode ser tentada de novo, já que o objetivo é reforçar o
 * conceito, não bloquear o conteúdo.
 */
export const QuizChallenge: React.FC<QuizChallengeProps> = ({ question, actionLabel, onSuccess }) => {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DURATION_SECONDS);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  useEffect(() => {
    if (!started || succeeded) return;
    if (timeLeft <= 0) {
      setTimeLeft(DURATION_SECONDS);
      setFeedback(null);
      setSelected(null);
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [started, timeLeft, succeeded]);

  if (!started) {
    return (
      <div className="rounded-2xl border-2 border-stem-violet/30 bg-stem-violet/5 p-4 space-y-3 text-center">
        <p className="font-display font-bold text-sm text-stem-violet flex items-center justify-center gap-1.5">
          <Zap className="w-4 h-4" /> Desafio Relâmpago
        </p>
        <p className="text-xs font-body-stem text-stem-ink-soft">
          Responda 1 pergunta rápida sobre esta habilidade para {actionLabel.toLowerCase()}.
        </p>
        <Button fullWidth variant="secondary" onClick={() => setStarted(true)}>
          Começar desafio
        </Button>
      </div>
    );
  }

  if (succeeded) {
    return (
      <div className="rounded-2xl border-2 border-stem-teal/30 bg-stem-teal/5 p-4 flex items-center justify-center gap-2 text-stem-teal font-display font-bold text-sm">
        <CheckCircle2 className="w-5 h-5" /> Resposta certa!
      </div>
    );
  }

  const handlePick = (idx: number) => {
    if (feedback === 'correct') return;
    setSelected(idx);
    if (idx === question.correctIndex) {
      soundEngine.playCorrect();
      setFeedback('correct');
      setSucceeded(true);
      setTimeout(onSuccess, 650);
    } else {
      soundEngine.playWrong();
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback(null);
        setSelected(null);
      }, 500);
    }
  };

  return (
    <div className="rounded-2xl border-2 border-stem-violet/30 bg-stem-violet/5 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-display font-bold text-xs text-stem-violet flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" /> Desafio Relâmpago
        </p>
        <span
          className={`flex items-center gap-1 text-xs font-display font-bold ${
            timeLeft <= 5 ? 'text-stem-coral' : 'text-stem-ink-soft'
          }`}
        >
          <Clock className="w-3.5 h-3.5" /> {timeLeft}s
        </span>
      </div>
      <p className="font-body-stem text-sm text-stem-ink font-semibold leading-snug">{question.question}</p>
      <div className="space-y-2">
        {question.options.map((opt, idx) => {
          const isSelected = selected === idx;
          const showCorrect = feedback === 'correct' && isSelected;
          const showWrong = feedback === 'wrong' && isSelected;
          return (
            <button
              key={idx}
              onClick={() => handlePick(idx)}
              disabled={feedback === 'correct'}
              className={`w-full text-left text-sm font-body-stem px-3 py-2.5 rounded-xl border-2 transition-colors ${
                showCorrect
                  ? 'border-stem-teal bg-stem-teal/15 text-stem-teal font-semibold'
                  : showWrong
                    ? 'border-stem-coral bg-stem-coral/10 text-stem-coral animate-[shakeX_0.4s_ease-in-out]'
                    : 'border-stem-line bg-stem-cloud hover:border-stem-violet/50'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};
