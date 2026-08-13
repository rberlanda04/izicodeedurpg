import React, { useState } from 'react';
import type { Guild, ScrumRole } from '../types';
import { soundEngine } from '../services/soundEngine';
import { Users, Crown, Shield, ExternalLink, PlusCircle, CheckCircle, Sparkles } from 'lucide-react';

interface GuildsViewProps {
  guilds: Guild[];
  currentUserId: string;
  onJoinGuild: (guildId: string, role: ScrumRole) => void;
  onCreateGuild: (name: string, motto: string, canvaLink: string) => void;
}

export const GuildsView: React.FC<GuildsViewProps> = ({
  guilds,
  currentUserId,
  onJoinGuild,
  onCreateGuild
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGuildName, setNewGuildName] = useState('');
  const [newGuildMotto, setNewGuildMotto] = useState('');
  const [newCanvaLink, setNewCanvaLink] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuildName.trim()) return;

    soundEngine.playLevelUp();
    onCreateGuild(newGuildName, newGuildMotto, newCanvaLink);
    setShowCreateModal(false);
    setNewGuildName('');
    setNewGuildMotto('');
    setNewCanvaLink('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="pixel-box pixel-box-gold p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-pixel text-lg text-[#ffb700] flex items-center gap-2">
            <Users className="w-5 h-5" /> SISTEMA DE GUILDAS & EQUIPES SCRUM
          </h2>
          <p className="font-body text-xs text-slate-300 mt-1">
            Fundem equipes ágeis, integrem artes do Canva/Figma e dividam papéis do framework Scrum.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="pixel-btn pixel-btn-primary whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" /> FUNDAR NOVA GUILDA
        </button>
      </div>

      {/* Guilds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guilds.map((g) => {
          const isMember = g.members.some((m) => m.uid === currentUserId);
          return (
            <div key={g.id} className={`pixel-box p-6 space-y-4 ${isMember ? 'pixel-box-green' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={g.emblemUrl}
                    alt={g.name}
                    className="w-14 h-14 object-cover border-2 border-[#ffb700] p-0.5 bg-[#090c15]"
                  />
                  <div>
                    <h3 className="font-pixel text-base text-[#ffb700]">{g.name}</h3>
                    <p className="font-body text-xs text-slate-300 italic">"{g.motto}"</p>
                    <p className="font-mono text-[11px] text-[#00ffaa] mt-1">Líder: {g.leaderName}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-pixel text-xs bg-[#ffb700]/20 text-[#ffb700] border border-[#ffb700] px-2 py-1">
                    {g.score} PTS
                  </span>
                </div>
              </div>

              {/* Members & Roles List */}
              <div className="bg-[#090c15] p-3 border border-[#2e3859] space-y-2">
                <h4 className="font-pixel text-[10px] text-slate-400 uppercase">Membros da Guilda & Papéis Scrum:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {g.members.map((m) => (
                    <div key={m.uid} className="flex items-center gap-2 bg-[#161b2e] p-2 border border-[#2e3859]">
                      <span className="text-lg">{m.avatarHead}</span>
                      <div>
                        <p className="font-pixel text-[11px] text-white">{m.name}</p>
                        <p className="font-mono text-[9px] text-[#00e1ff]">{m.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Canva/Figma Link */}
              {g.canvaFigmaLink && (
                <div className="flex items-center justify-between bg-[#161b2e] px-3 py-2 border border-[#ff007f]/40 text-xs">
                  <span className="font-body text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#ff007f]" /> Identidade Visual no Figma/Canva
                  </span>
                  <a
                    href={g.canvaFigmaLink}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11px] text-[#ff007f] hover:underline flex items-center gap-1"
                  >
                    Ver Projeto <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Guild Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="pixel-box pixel-box-gold bg-[#121626] max-w-md w-full p-6 text-slate-200">
            <h3 className="font-pixel text-sm text-[#ffb700] mb-4">FUNDAR NOVA GUILDA</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block font-pixel text-[10px] text-slate-300 mb-1">NOME DA GUILDA:</label>
                <input
                  type="text"
                  value={newGuildName}
                  onChange={(e) => setNewGuildName(e.target.value)}
                  placeholder="Ex: Mágicos do Solder"
                  className="w-full bg-[#090c15] border-2 border-[#2e3859] p-2 text-xs font-mono text-white outline-none focus:border-[#ffb700]"
                  required
                />
              </div>

              <div>
                <label className="block font-pixel text-[10px] text-slate-300 mb-1">LEMA / MOTTO DA GUILDA:</label>
                <input
                  type="text"
                  value={newGuildMotto}
                  onChange={(e) => setNewGuildMotto(e.target.value)}
                  placeholder="Ex: Código limpo, circuito forte!"
                  className="w-full bg-[#090c15] border-2 border-[#2e3859] p-2 text-xs font-mono text-white outline-none focus:border-[#ffb700]"
                />
              </div>

              <div>
                <label className="block font-pixel text-[10px] text-slate-300 mb-1">LINK DO CANVA / FIGMA (OPCIONAL):</label>
                <input
                  type="url"
                  value={newCanvaLink}
                  onChange={(e) => setNewCanvaLink(e.target.value)}
                  placeholder="https://figma.com/..."
                  className="w-full bg-[#090c15] border-2 border-[#2e3859] p-2 text-xs font-mono text-white outline-none focus:border-[#ffb700]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-1/2 pixel-btn bg-[#1a2238] text-slate-300"
                >
                  CANCELAR
                </button>
                <button type="submit" className="w-1/2 pixel-btn pixel-btn-primary justify-center">
                  CRIAR GUILDA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
