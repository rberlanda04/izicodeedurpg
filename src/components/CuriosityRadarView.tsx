import React, { useState } from 'react';
import type { CuriosityCard } from '../types';
import { soundEngine } from '../services/soundEngine';
import { Compass, QrCode, Lock, CheckCircle2, Sparkles, BookOpen, Key } from 'lucide-react';

interface CuriosityRadarViewProps {
  cards: CuriosityCard[];
  onUnlockCard: (code: string) => boolean;
}

export const CuriosityRadarView: React.FC<CuriosityRadarViewProps> = ({
  cards,
  onUnlockCard
}) => {
  const [inputCode, setInputCode] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    const success = onUnlockCard(inputCode.trim().toUpperCase());
    if (success) {
      soundEngine.playLevelUp();
      setMsg('🎉 Curiosidade Destravada no Laboratório! +XP concedido.');
      setInputCode('');
    } else {
      soundEngine.playErrorBeep();
      setMsg('❌ Código Inválido ou já desbloqueado! Tente LAB-LASER-02');
    }
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="pixel-box pixel-box-gold p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-pixel text-lg text-[#ffb700] flex items-center gap-2">
            <Compass className="w-5 h-5" /> RADAR DE CURIOSIDADES STEAM & QR CODES
          </h2>
          <p className="font-body text-xs text-slate-300 mt-1">
            Escaneie os QR Codes colados nas ferramentas do laboratório físico para destravar cartões com curiosidades históricas.
          </p>
        </div>
      </div>

      {/* Code Unlock Bar */}
      <div className="pixel-box p-6 bg-[#161b2e] border-2 border-[#00e1ff]">
        <h3 className="font-pixel text-xs text-[#00e1ff] flex items-center gap-2 mb-3">
          <Key className="w-4 h-4" /> DIGITAR CÓDIGO DA FERRAMENTA FÍSICA:
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Ex: LAB-LASER-02"
            className="flex-1 bg-[#090c15] border-2 border-[#2e3859] focus:border-[#00e1ff] p-2.5 text-xs font-mono text-white uppercase outline-none"
          />
          <button type="submit" className="pixel-btn pixel-btn-primary justify-center whitespace-nowrap">
            DESBLOQUEAR CURIOSIDADE
          </button>
        </form>
        {msg && <p className="font-mono text-xs text-center mt-2 text-[#00ffaa]">{msg}</p>}
      </div>

      {/* Curiosity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((c) => {
          return (
            <div
              key={c.id}
              className={`pixel-box p-6 space-y-3 flex flex-col justify-between ${
                c.unlocked ? 'pixel-box-green' : 'border-slate-700 bg-[#090c15] opacity-75'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-[#2e3859] pb-2">
                  <span className="font-mono text-[10px] text-[#00e1ff] px-2 py-0.5 bg-[#090c15] border border-[#00e1ff]">
                    {c.code}
                  </span>
                  <span className="font-pixel text-xs text-[#ffb700]">+{c.xpReward} XP</span>
                </div>

                <h3 className="font-pixel text-sm text-white">{c.title}</h3>
                <p className="font-mono text-[10px] text-slate-400">Local no Lab: {c.labLocation}</p>

                {c.unlocked ? (
                  <p className="font-body text-xs text-slate-300 leading-relaxed bg-[#090c15] p-3 border border-[#00ffaa]/40">
                    {c.content}
                  </p>
                ) : (
                  <div className="bg-[#161b2e] p-4 text-center border border-dashed border-slate-600">
                    <Lock className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                    <p className="font-pixel text-[10px] text-slate-400">BLOQUEADO</p>
                    <p className="font-body text-[11px] text-slate-500 mt-1">
                      Encontre o adesivo colado em: {c.labLocation}
                    </p>
                  </div>
                )}
              </div>

              {c.unlocked && (
                <div className="font-pixel text-[10px] text-[#00ffaa] flex items-center justify-center gap-1 pt-2 border-t border-[#2e3859]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> DESTRAVADO NA FICHA
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
