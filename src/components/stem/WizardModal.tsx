import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, PartyPopper, CheckCircle } from 'lucide-react';
import { MiniMarkdown } from './MiniMarkdown';
import { Button } from './Button';
import type { StudyWizard } from '../../types';

interface WizardModalProps {
  wizard: StudyWizard;
  alreadyCompleted: boolean;
  onClose: () => void;
  onComplete: (wizardId: string, xpReward: number, coinReward: number) => void;
}

export const WizardModal: React.FC<WizardModalProps> = ({ wizard, alreadyCompleted, onClose, onComplete }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [justCompleted, setJustCompleted] = useState(false);
  const step = wizard.steps[stepIndex];
  const isLastStep = stepIndex === wizard.steps.length - 1;

  const handleFinish = () => {
    if (!alreadyCompleted) {
      onComplete(wizard.id, wizard.xpReward, wizard.coinReward);
      setJustCompleted(true);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-stem-ink/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stem-cloud rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col">
        <div className="flex items-start justify-between p-6 border-b-2 border-stem-line shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{wizard.icon}</span>
            <div>
              <h2 className="font-display font-extrabold text-lg text-stem-ink">{wizard.title}</h2>
              <p className="text-xs font-body-stem text-stem-ink-soft">
                Passo {stepIndex + 1} de {wizard.steps.length}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-stem-ink-soft hover:text-stem-ink shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-1.5 px-6 pt-4 shrink-0">
          {wizard.steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 flex-1 rounded-full ${idx <= stepIndex ? 'bg-stem-teal' : 'bg-stem-line'}`}
            />
          ))}
        </div>

        <div className="overflow-y-auto p-6">
          {justCompleted ? (
            <div className="flex flex-col items-center text-center gap-3 py-8">
              <PartyPopper className="w-10 h-10 text-stem-amber" />
              <h3 className="font-display font-extrabold text-lg text-stem-ink">Wizard concluído!</h3>
              <p className="font-body-stem text-sm text-stem-ink-soft">
                Você ganhou <span className="font-bold text-stem-violet">+{wizard.xpReward} XP</span> e{' '}
                <span className="font-bold text-stem-amber">🪙 {wizard.coinReward} Izicoins</span>.
              </p>
            </div>
          ) : (
            <>
              <h3 className="font-display font-bold text-stem-teal text-base mb-2">{step.title}</h3>
              <MiniMarkdown content={step.content} />
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 p-6 border-t-2 border-stem-line shrink-0">
          {justCompleted ? (
            <Button fullWidth onClick={onClose}>
              Fechar
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
                disabled={stepIndex === 0}
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </Button>
              {isLastStep ? (
                <Button onClick={handleFinish}>
                  {alreadyCompleted ? (
                    <>
                      <CheckCircle className="w-4 h-4" /> Já concluído — fechar
                    </>
                  ) : (
                    <>Concluir e ganhar 🪙{wizard.coinReward}</>
                  )}
                </Button>
              ) : (
                <Button onClick={() => setStepIndex((i) => Math.min(wizard.steps.length - 1, i + 1))}>
                  Próximo <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
