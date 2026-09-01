import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, Sparkles } from 'lucide-react';
import { Card } from '../stem/Card';
import { Button } from '../stem/Button';
import {
  SURVEY_QUESTIONS,
  ARCHETYPE_INFO,
  computeArchetype,
  SKILL_SURVEY_XP_REWARD,
  SKILL_SURVEY_COIN_REWARD
} from '../../data/skillProfileSurvey';

interface SkillProfileSurveyProps {
  onComplete: (selections: Record<string, string>) => Promise<void>;
  onSkip: () => void;
  onClose: () => void;
}

type Step = 'consent' | number | 'result';

/**
 * Modal em 3 fases (consentimento -> perguntas -> resultado), no mesmo
 * padrão visual do seletor de avatar em PerfilPage.tsx. Nunca bloqueia
 * navegação — "Agora não" fecha em qualquer fase sem gravar nada, e o
 * resultado é só recomendação visual na Trilha/Missões, nunca um gate.
 */
export const SkillProfileSurvey: React.FC<SkillProfileSurveyProps> = ({ onComplete, onSkip, onClose }) => {
  const [step, setStep] = useState<Step>('consent');
  const [consentChecked, setConsentChecked] = useState(false);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const total = SURVEY_QUESTIONS.length;
  const questionIndex = typeof step === 'number' ? step : 0;
  const question = SURVEY_QUESTIONS[questionIndex];

  const handlePick = (optionId: string) => {
    if (!question) return;
    const next = { ...selections, [question.id]: optionId };
    setSelections(next);
    if (questionIndex + 1 < total) {
      setStep(questionIndex + 1);
    } else {
      setStep('result');
    }
  };

  const handleFinish = async () => {
    setBusy(true);
    try {
      await onComplete(selections);
      onClose();
    } finally {
      setBusy(false);
    }
  };

  const result = step === 'result' ? computeArchetype(selections) : null;

  return (
    <div className="fixed inset-0 z-50 bg-stem-ink/40 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-lg space-y-5">
        {step === 'consent' && (
          <>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-stem-violet shrink-0" />
              <h3 className="font-display font-bold text-lg text-stem-ink">Descubra seu arquétipo</h3>
            </div>
            <p className="text-sm font-body-stem text-stem-ink-soft">
              Vamos te fazer {total} perguntas rápidas sobre como você gosta de aprender, os aparelhos que você usa
              e o tempo de tela. Isso ajuda a plataforma a sugerir habilidades e missões que combinam mais com seu
              jeito de aventureiro.
            </p>
            <ul className="text-sm font-body-stem text-stem-ink-soft space-y-1 list-disc list-inside">
              <li>Suas respostas ficam visíveis só pra você e pro seu Game Master — igual o resto do seu perfil.</li>
              <li>É totalmente opcional: pular agora não trava nenhuma habilidade ou missão.</li>
              <li>Você pode refazer o questionário ou apagar suas respostas quando quiser, na aba Perfil.</li>
            </ul>
            <label className="flex items-start gap-2 text-sm font-body-stem text-stem-ink cursor-pointer">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-stem-violet"
              />
              Entendi como minhas respostas serão usadas.
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="ghost" fullWidth onClick={onSkip}>
                Agora não
              </Button>
              <Button fullWidth disabled={!consentChecked} onClick={() => setStep(0)}>
                Começar
              </Button>
            </div>
          </>
        )}

        {typeof step === 'number' && question && (
          <>
            <div className="flex items-center justify-between text-xs font-display font-bold text-stem-ink-soft uppercase tracking-wide">
              <span>
                Pergunta {questionIndex + 1} de {total}
              </span>
              {questionIndex > 0 && (
                <button
                  onClick={() => setStep(questionIndex - 1)}
                  className="inline-flex items-center gap-1 text-stem-ink-soft hover:text-stem-violet"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                </button>
              )}
            </div>
            <div className="h-1.5 rounded-full bg-stem-mist overflow-hidden">
              <div
                className="h-full bg-stem-violet rounded-full transition-all"
                style={{ width: `${((questionIndex + 1) / total) * 100}%` }}
              />
            </div>
            <p className="font-display font-bold text-base text-stem-ink">{question.prompt}</p>
            <div className="space-y-2">
              {question.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handlePick(opt.id)}
                  className="w-full flex items-center gap-3 text-left text-sm font-body-stem px-4 py-3 rounded-xl border-2 border-stem-line bg-stem-cloud hover:border-stem-violet/50 hover:bg-stem-violet/5 transition-colors"
                >
                  <span className="text-xl shrink-0">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'result' && result && (
          <>
            <div className="flex flex-col items-center gap-2 text-center py-2">
              <span className="w-16 h-16 rounded-full bg-stem-violet/10 flex items-center justify-center text-4xl">
                {ARCHETYPE_INFO[result.primary].icon}
              </span>
              <p className="text-xs font-display font-bold uppercase tracking-widest text-stem-violet flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Seu arquétipo é
              </p>
              <h3 className="font-display font-extrabold text-2xl text-stem-ink">
                {ARCHETYPE_INFO[result.primary].label}
              </h3>
              <p className="text-sm font-body-stem text-stem-ink-soft max-w-sm">
                {ARCHETYPE_INFO[result.primary].tagline}
              </p>
              {result.secondary && (
                <p className="text-xs font-body-stem text-stem-ink-soft">
                  Com um pouco de {ARCHETYPE_INFO[result.secondary].label} também.
                </p>
              )}
            </div>
            <Button fullWidth disabled={busy} onClick={() => void handleFinish()}>
              Concluir (+{SKILL_SURVEY_XP_REWARD} XP, +{SKILL_SURVEY_COIN_REWARD} moedas)
            </Button>
          </>
        )}
      </Card>
    </div>
  );
};
