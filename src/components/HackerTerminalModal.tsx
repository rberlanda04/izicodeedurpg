import React, { useState, useEffect, useRef } from 'react';
import type { UserProfile } from '../types';
import { soundEngine } from '../services/soundEngine';
import { Terminal, X } from 'lucide-react';

interface HackerTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUnlockSecretQuest: (code: string) => boolean;
}

export const HackerTerminalModal: React.FC<HackerTerminalModalProps> = ({
  isOpen,
  onClose,
  user,
  onUnlockSecretQuest
}) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<Array<{ text: string; type: 'cmd' | 'output' | 'error' | 'success' }>>([
    { text: '==================================================', type: 'output' },
    { text: '   IZICODE MAKER CYPERPUNK TERMINAL CLI v2.4', type: 'success' },
    { text: '   Cultura Hacker & Solucionador de Enigmas STEAM', type: 'output' },
    { text: '==================================================', type: 'output' },
    { text: 'Digite /help para listar os comandos dispońiveis.', type: 'output' },
    { text: 'Dica Enigma: Tente desvendar o código secreto /unlock-quest IZI-CYBER', type: 'output' },
  ]);

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleKeyDown = () => {
    soundEngine.playTerminalBeep();
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    // Add user command to history
    const newHistory = [...history, { text: `izicode@maker-net:~$ ${cmd}`, type: 'cmd' as const }];

    const parts = cmd.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    switch (mainCmd) {
      case '/help':
        newHistory.push(
          { text: '--- COMANDOS HACKER DISPONÍVEIS ---', type: 'success' },
          { text: '/help                      - Exibe este menu de ajuda.', type: 'output' },
          { text: '/unlock-quest <código>     - Desbloqueia Quests e Nós Secretos.', type: 'output' },
          { text: '/decrypt <texto_cifr>      - Converte Binário/Hex em Texto ASCII.', type: 'output' },
          { text: '/hack                      - Ativa o modo Matrix Glitch.', type: 'output' },
          { text: '/status                    - Exibe o status da Ficha do Aventureiro.', type: 'output' },
          { text: '/sudo-coffee               - Easter Egg de energia extra.', type: 'output' },
          { text: '/clear                     - Limpa o histórico do terminal.', type: 'output' }
        );
        break;

      case '/status':
        newHistory.push(
          { text: `[STATUS] Aventureiro: ${user.adventureName} (Nível ${user.level})`, type: 'success' },
          { text: `[XP]: ${user.xp} / ${user.xpToNextLevel} | [Izicoins]: 🪙 ${user.izicoins}`, type: 'output' },
          { text: `[Guilda]: ${user.guildId ? 'Mágicos do Solder' : 'Sem Guilda'}`, type: 'output' },
          { text: `[Badges Conquistadas]: ${user.badges.length}`, type: 'output' }
        );
        break;

      case '/unlock-quest':
        if (!args) {
          newHistory.push({ text: 'ERRO: Forneça um código! Exemplo: /unlock-quest IZI-CYBER', type: 'error' });
          soundEngine.playErrorBeep();
        } else {
          const success = onUnlockSecretQuest(args.toUpperCase());
          if (success) {
            newHistory.push(
              { text: '🔓 CÓDIGO ACEITO! Quest Secreta & Nó Cypherpunk Desbloqueados na Árvore!', type: 'success' },
              { text: 'Recompensa: +600 XP e Badge [Cypher Hacker] atribuída!', type: 'success' }
            );
            soundEngine.playLevelUp();
          } else {
            newHistory.push({ text: '❌ CÓDIGO INVÁLIDO OU JÁ DESBLOQUEADO!', type: 'error' });
            soundEngine.playErrorBeep();
          }
        }
        break;

      case '/decrypt':
        if (!args) {
          newHistory.push({ text: 'ERRO: Forneça o texto em binário ou hex.', type: 'error' });
        } else {
          // Binário 01001001 01011010 01001001 -> IZI
          if (args.includes('01001001')) {
            newHistory.push({ text: '🔓 DECODIFICADO (Binário -> ASCII): "IZI"', type: 'success' });
          } else {
            newHistory.push({ text: `🔓 DECODIFICADO: "${args.toUpperCase()} [DESCRIPTOGRAFADO]"`, type: 'success' });
          }
          soundEngine.playQuestComplete();
        }
        break;

      case '/hack':
        newHistory.push(
          { text: '01001001 01011010 01001001 01000011 01001111 01000100 01000101', type: 'success' },
          { text: 'SYSTEM INFILTRATED... MATRIX MODE ACTIVATED!', type: 'success' }
        );
        soundEngine.playBossHit();
        break;

      case '/sudo-coffee':
        newHistory.push({ text: '☕ Café virtual fornecido! +10 HP de Concentração Maker para sua Guilda!', type: 'success' });
        soundEngine.playItemCollect();
        break;

      case '/clear':
        setHistory([]);
        setInputVal('');
        return;

      default:
        newHistory.push({ text: `Comando desconhecido: "${cmd}". Digite /help`, type: 'error' });
        soundEngine.playErrorBeep();
        break;
    }

    setHistory(newHistory);
    setInputVal('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="terminal-window max-w-3xl w-full h-[520px] flex flex-col p-4 rounded border-2 border-[#00ff66]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#00ff66]/40 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#00ff66]" />
            <span className="font-mono text-xs font-bold text-[#00ff66] tracking-wider">
              IZICODE_HACKER_TERMINAL_CLI // (Pressione ESC ou feche)
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#00ff66] hover:bg-[#00ff66]/20 px-2 py-0.5 rounded font-mono"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Console Log Output */}
        <div className="flex-1 overflow-y-auto space-y-1.5 font-mono text-xs pr-2">
          {history.map((item, idx) => (
            <div
              key={idx}
              className={`${
                item.type === 'cmd'
                  ? 'text-cyan-300 font-bold'
                  : item.type === 'success'
                  ? 'text-[#00ff66] font-semibold'
                  : item.type === 'error'
                  ? 'text-pink-500 font-bold'
                  : 'text-slate-300'
              }`}
            >
              {item.text}
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleCommandSubmit} className="mt-3 pt-2 border-t border-[#00ff66]/40 flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#00ff66]">izicode@maker-net:~$</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite um comando ex: /help, /unlock-quest IZI-CYBER"
            className="terminal-input text-xs"
            autoFocus
          />
        </form>
      </div>
    </div>
  );
};
