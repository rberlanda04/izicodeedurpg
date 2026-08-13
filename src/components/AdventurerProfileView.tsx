import React, { useState } from 'react';
import type { UserProfile } from '../types';
import { soundEngine } from '../services/soundEngine';
import { Shield, Award, Sparkles, UserCheck, Lock, CheckCircle2, RefreshCw } from 'lucide-react';

interface AdventurerProfileViewProps {
  user: UserProfile;
  onUpdateAvatar: (newAvatar: UserProfile['avatarConfig']) => void;
  onSignContract: () => void;
}

export const AdventurerProfileView: React.FC<AdventurerProfileViewProps> = ({
  user,
  onUpdateAvatar,
  onSignContract
}) => {
  const [headOption, setHeadOption] = useState(user.avatarConfig.head);
  const [bodyOption, setBodyOption] = useState(user.avatarConfig.body);
  const [accessoryOption, setAccessoryOption] = useState(user.avatarConfig.accessory);
  const [colorOption, setColorOption] = useState(user.avatarConfig.color);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);

  const headList = ['🤖', '🧙‍♂️', '🦊', '👨‍🚀', '🐱', '👾', '🤠', '🥷'];
  const bodyList = ['🛡️', '⚡', '💻', '🔋', '🚀', '🥋', '🦺'];
  const accessoryList = ['⚡', '🔮', '🔧', '🎧', '👓', '👑'];
  const colorList = ['#00e1ff', '#00ffaa', '#ff007f', '#ffb700', '#9d4edd'];

  const handleSaveAvatar = () => {
    soundEngine.playItemCollect();
    onUpdateAvatar({
      head: headOption,
      body: bodyOption,
      accessory: accessoryOption,
      color: colorOption
    });
    setIsEditingAvatar(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="pixel-box pixel-box-green p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Avatar & Basic Info */}
        <div className="flex items-center gap-6">
          <div
            className="w-24 h-24 border-4 border-[#00ffaa] bg-[#090c15] flex items-center justify-center text-5xl relative shadow-lg"
            style={{ borderColor: user.avatarConfig.color }}
          >
            <span>{user.avatarConfig.head}</span>
            <span className="absolute -bottom-2 -right-2 text-xl bg-[#161b2e] border border-white p-1">
              {user.avatarConfig.accessory}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-pixel text-xl text-[#00ffaa]">{user.adventureName}</h2>
              <span className="font-mono text-xs text-slate-400 bg-[#090c15] px-2 py-0.5 border border-[#2e3859]">
                (LGPD Protegido)
              </span>
            </div>
            <p className="font-body text-sm text-slate-300 mt-1">
              Nome Real: <span className="text-slate-400 font-mono">{user.realName}</span> (Visível apenas ao Mestre)
            </p>
            <div className="flex items-center gap-4 mt-3">
              <span className="font-pixel text-xs bg-[#ffb700]/20 text-[#ffb700] border border-[#ffb700] px-2.5 py-1">
                NÍVEL {user.level} AVENTUREIRO
              </span>
              <span className="font-pixel text-xs bg-[#ff007f]/20 text-[#ff007f] border border-[#ff007f] px-2.5 py-1">
                PAPEL SCRUM: {user.guildRole || 'MAKER'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setIsEditingAvatar(!isEditingAvatar)}
            className="pixel-btn bg-[#1a2238] border-[#00e1ff] text-[#00e1ff] hover:bg-[#00e1ff] hover:text-[#090c15]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>CUSTOMIZAR AVATAR</span>
          </button>
        </div>
      </div>

      {/* Avatar Creator Drawer */}
      {isEditingAvatar && (
        <div className="pixel-box p-6 bg-[#161b2e] border-2 border-[#00e1ff] space-y-4">
          <h3 className="font-pixel text-sm text-[#00e1ff] flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> CRIADOR DE AVATAR PIXEL ART 16-BIT
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
            {/* Head */}
            <div>
              <label className="font-pixel text-[10px] text-slate-300 block mb-2">CABEÇA / CAPACETE:</label>
              <div className="flex flex-wrap gap-2">
                {headList.map((item) => (
                  <button
                    key={item}
                    onClick={() => setHeadOption(item)}
                    className={`text-2xl p-2 border ${headOption === item ? 'border-[#00ffaa] bg-[#00ffaa]/20' : 'border-[#2e3859]'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Accessory */}
            <div>
              <label className="font-pixel text-[10px] text-slate-300 block mb-2">ACESSÓRIO MAKER:</label>
              <div className="flex flex-wrap gap-2">
                {accessoryList.map((item) => (
                  <button
                    key={item}
                    onClick={() => setAccessoryOption(item)}
                    className={`text-2xl p-2 border ${accessoryOption === item ? 'border-[#00e1ff] bg-[#00e1ff]/20' : 'border-[#2e3859]'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Aura Color */}
            <div>
              <label className="font-pixel text-[10px] text-slate-300 block mb-2">COR DA AURA:</label>
              <div className="flex gap-2">
                {colorList.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColorOption(c)}
                    className="w-8 h-8 rounded border-2 border-white"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Save */}
            <div className="flex items-end">
              <button onClick={handleSaveAvatar} className="w-full pixel-btn pixel-btn-primary justify-center">
                SALVAR AVATAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Badges & Inventory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Badges Gallery */}
        <div className="pixel-box p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2e3859] pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#ffb700]" />
              <h3 className="font-pixel text-sm text-[#ffb700]">GALERIA DE BADGES & EMBLEMAS</h3>
            </div>
            <span className="font-mono text-xs text-slate-400">{user.badges.length} Conquistadas</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {user.badges.map((b) => (
              <div key={b.id} className="bg-[#090c15] p-3 border border-[#ffb700]/40 flex items-start gap-3">
                <div className="pixel-badge font-pixel">
                  <span>{b.icon}</span>
                </div>
                <div>
                  <h4 className="font-pixel text-xs text-[#ffb700]">{b.name}</h4>
                  <p className="font-body text-[11px] text-slate-400 mt-1">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Contract LGPD / ECA */}
        <div className="pixel-box p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2e3859] pb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#00e1ff]" />
              <h3 className="font-pixel text-sm text-[#00e1ff]">PACTO DOS HERÓIS (LGPD & PRIVACIDADE)</h3>
            </div>
            {user.heroContractSigned ? (
              <span className="flex items-center gap-1 font-mono text-xs text-[#00ffaa]">
                <CheckCircle2 className="w-4 h-4" /> Assinado
              </span>
            ) : (
              <span className="font-mono text-xs text-pink-400">Pendente</span>
            )}
          </div>

          <div className="bg-[#090c15] p-4 border border-[#2e3859] space-y-2 text-xs font-body text-slate-300">
            <p className="font-bold text-white">📜 Termos Gamificados de Uso de Imagem e Perfil:</p>
            <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
              <li>Seu nome real só é visível para o seu Game Master (Professor).</li>
              <li>Sua guilda utiliza codinomes públicos para os placares e eventos.</li>
              <li>Seus projetos no Canva/Figma são compartilhados com autorização da equipe.</li>
            </ul>
          </div>

          {!user.heroContractSigned && (
            <button onClick={onSignContract} className="w-full pixel-btn pixel-btn-primary justify-center">
              ASSINAR PACTO DOS HERÓIS
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
