import React, { useState } from 'react';
import { Swords, Key, Link2, X, Zap, Gift } from 'lucide-react';
import { Card } from '../stem/Card';
import { Button } from '../stem/Button';
import type { ActiveChallenge } from '../../types';

interface BattleScreenProps {
  challenge: ActiveChallenge;
  validationError: string;
  onValidateQuestCode: (questId: string, code: string) => Promise<void>;
  onValidateSkillCode: (skillId: string, code: string) => Promise<void>;
  onCompleteSkillWithLink: (link: string) => Promise<void>;
  onRequestSkillTeacherValidation: () => Promise<void>;
  onCancel: () => Promise<void>;
}

/**
 * A tela que "trava" o aluno: enquanto existir um activeChallenge
 * (useClassLocalState.ts), ClassLayout.tsx renderiza isto NO LUGAR do
 * Outlet normal — o aluno não navega pra outra página até cancelar ou
 * concluir. É a versão intuitiva de "você está em combate" pedida: uma
 * missão aceita ou uma habilidade em validação vira uma batalha de verdade,
 * não só um status escondido numa lista.
 */
export const BattleScreen: React.FC<BattleScreenProps> = ({
  challenge,
  validationError,
  onValidateQuestCode,
  onValidateSkillCode,
  onCompleteSkillWithLink,
  onRequestSkillTeacherValidation,
  onCancel
}) => {
  const [code, setCode] = useState('');
  const [link, setLink] = useState('');
  const [busy, setBusy] = useState(false);
  const [showLinkForm, setShowLinkForm] = useState(false);

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    try {
      await action();
    } finally {
      setBusy(false);
    }
  };

  const isAwaitingMethod = challenge.kind === 'skill' && challenge.awaitingMethod;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <Card accent="coral" className="w-full max-w-lg space-y-5 text-center">
        <div className="flex flex-col items-center gap-2">
          <span className="w-16 h-16 rounded-full bg-stem-coral/10 flex items-center justify-center">
            <Swords className="w-8 h-8 text-stem-coral animate-pulse" />
          </span>
          <p className="text-xs font-display font-bold uppercase tracking-widest text-stem-coral">Em desafio</p>
          <h1 className="font-display font-extrabold text-xl text-stem-ink">{challenge.title}</h1>
        </div>

        <div className="flex items-center justify-center gap-4 bg-stem-mist rounded-2xl px-4 py-3">
          <span className="flex items-center gap-1 font-display font-bold text-stem-violet text-sm">
            <Zap className="w-4 h-4" /> +{challenge.xpReward} XP
          </span>
          <span className="flex items-center gap-1 font-display font-bold text-stem-amber text-sm">
            <Gift className="w-4 h-4" /> +{challenge.coinReward} moedas
          </span>
        </div>

        {isAwaitingMethod ? (
          <div className="space-y-3">
            <p className="text-sm font-body-stem text-stem-ink-soft">
              Como você vai provar que concluiu esta atividade?
            </p>
            {showLinkForm ? (
              <form
                className="flex flex-col sm:flex-row gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!link.trim()) return;
                  void run(() => onCompleteSkillWithLink(link.trim()));
                }}
              >
                <input
                  autoFocus
                  required
                  type="url"
                  placeholder="https://scratch.mit.edu/projects/..."
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="flex-1 min-w-0 rounded-xl border-2 border-stem-line px-3 py-2.5 font-body-stem outline-none focus:border-stem-teal"
                />
                <Button type="submit" disabled={busy}>
                  Enviar
                </Button>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button variant="secondary" disabled={busy} onClick={() => setShowLinkForm(true)}>
                  <Link2 className="w-4 h-4" /> Enviar link do projeto
                </Button>
                <Button
                  variant="ghost"
                  disabled={busy}
                  onClick={() => void run(onRequestSkillTeacherValidation)}
                >
                  <Key className="w-4 h-4" /> Pedir validação do professor
                </Button>
              </div>
            )}
            <p className="text-xs font-body-stem text-stem-ink-soft/70">
              Use o link se a ferramenta gera um projeto online (Scratch, App Inventor, Tinkercad...). Peça o
              professor se for um circuito físico (Arduino, robô) que ele precisa ver pessoalmente.
            </p>
          </div>
        ) : (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!code.trim()) return;
              const action =
                challenge.kind === 'quest'
                  ? () => onValidateQuestCode(challenge.questId, code.trim())
                  : () => onValidateSkillCode(challenge.skillId, code.trim());
              void run(action);
            }}
          >
            <p className="text-sm font-body-stem text-stem-ink-soft">
              Mostre seu trabalho pronto ao Game Master — ele vai te passar um código de 4 dígitos.
            </p>
            <div className="flex gap-2">
              <input
                required
                placeholder="Código do professor"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 min-w-0 rounded-xl border-2 border-stem-line px-3 py-2.5 text-center font-display font-bold tracking-widest outline-none focus:border-stem-teal"
              />
              <Button type="submit" disabled={busy}>
                <Key className="w-4 h-4" /> Validar
              </Button>
            </div>
          </form>
        )}

        {validationError && <p className="text-sm text-stem-coral font-body-stem">{validationError}</p>}

        <button
          onClick={() => void run(onCancel)}
          disabled={busy}
          className="inline-flex items-center gap-1.5 text-xs font-display font-semibold text-stem-ink-soft hover:text-stem-coral disabled:opacity-50"
        >
          <X className="w-3.5 h-3.5" /> Cancelar desafio
        </button>
      </Card>
    </div>
  );
};
