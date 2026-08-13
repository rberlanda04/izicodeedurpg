import React, { useState } from 'react';
import { soundEngine } from '../services/soundEngine';
import { Key, QrCode, CheckCircle, Copy, Users, Zap } from 'lucide-react';

interface PasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPasscode: string;
  /** Whether this student session has already confirmed the room code. */
  hasJoinedRoom: boolean;
  /**
   * Called when the student successfully confirms the passcode currently
   * displayed by the Game Master. This only marks the session as joined —
   * it must NEVER change the room's active code (that's the Game Master's
   * "ATUALIZAR CÓDIGO DA SALA" action).
   */
  onJoinRoom: () => void;
}

export const PasscodeModal: React.FC<PasscodeModalProps> = ({
  isOpen,
  onClose,
  currentPasscode,
  hasJoinedRoom,
  onJoinRoom
}) => {
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPasscode);
    setCopied(true);
    soundEngine.playItemCollect();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim().toUpperCase() === currentPasscode.toUpperCase()) {
      soundEngine.playLevelUp();
      setMessage('✅ Conectado com Sucesso à Sala de Aprendizado!');
      setTimeout(() => {
        onJoinRoom();
        onClose();
      }, 1000);
    } else {
      soundEngine.playErrorBeep();
      setMessage('❌ Código Inválido! Tente IZI-9482');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="pixel-box pixel-box-green bg-[#121626] max-w-md w-full p-6 text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#2e3859] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-[#00ffaa]" />
            <h2 className="font-pixel text-sm text-[#00ffaa]">ACESSO RÁPIDO DA SALA</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-mono font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {/* Current Active Room Info */}
        <div className="bg-[#090c15] p-4 border-2 border-[#00e1ff] mb-6 text-center">
          <p className="font-pixel text-[10px] text-slate-400 mb-1">CÓDIGO DA SALA EM EXIBIÇÃO:</p>
          <div className="font-mono text-3xl font-extrabold text-[#00e1ff] tracking-widest my-2 flex items-center justify-center gap-3">
            <span>{currentPasscode}</span>
            <button
              onClick={handleCopy}
              className="p-1.5 bg-[#161b2e] border border-[#00e1ff] hover:bg-[#00e1ff]/20 text-xs text-slate-300"
              title="Copiar código"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-[#00ffaa]" /> : <Copy className="w-4 h-4 text-[#00e1ff]" />}
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs font-mono text-slate-300 mt-2">
            <span className="flex items-center gap-1">
              {hasJoinedRoom ? (
                <>
                  <Users className="w-3.5 h-3.5 text-[#00ffaa]" /> Você está conectado
                </>
              ) : (
                <>
                  <Users className="w-3.5 h-3.5 text-[#ffb700]" /> Você ainda não entrou
                </>
              )}
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-[#00ffaa]" /> Sessão Ativa
            </span>
          </div>
        </div>

        {/* QR Code Simulation */}
        <div className="bg-[#161b2e] p-4 border border-[#2e3859] flex items-center justify-center gap-4 mb-6">
          <div className="w-20 h-20 bg-white p-1 border-2 border-black flex items-center justify-center">
            <QrCode className="w-16 h-16 text-black" />
          </div>
          <div className="text-left text-xs font-body">
            <p className="font-bold text-white mb-1">Acesso por QR Code ou Código</p>
            <p className="text-slate-400 text-[11px]">
              Alunos podem escaneá-lo na tela da sala ou digitar o código de 6 dígitos sem precisar de senhas longas.
            </p>
          </div>
        </div>

        {/* Enter Code Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-pixel text-[10px] text-slate-300 mb-2">
              DIGITE O CÓDIGO DA SALA DA AULA:
            </label>
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="Ex: IZI-9482"
              className="w-full bg-[#090c15] border-2 border-[#2e3859] focus:border-[#00ffaa] text-center font-mono text-xl font-bold py-2.5 text-white tracking-widest outline-none"
              maxLength={8}
            />
          </div>

          {message && (
            <p className="text-center font-mono text-xs font-semibold py-1">
              {message}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 pixel-btn bg-[#1a2238] border-slate-500 text-slate-300 hover:text-white"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              className="w-1/2 pixel-btn pixel-btn-primary justify-center"
            >
              CONECTAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
