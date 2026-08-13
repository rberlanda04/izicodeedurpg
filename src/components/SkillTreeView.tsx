import React, { useState } from 'react';
import type { SkillNode, SkillTier, ResourceBooking } from '../types';
import { soundEngine } from '../services/soundEngine';
import { GitFork, Lock, Unlock, CheckCircle2, Printer, Cpu, HelpCircle } from 'lucide-react';

interface SkillTreeViewProps {
  skills: SkillNode[];
  unlockedSkillIds: string[];
  onUnlockSkill: (skillId: string) => void;
  bookings: ResourceBooking[];
  onBookResource: (machine: ResourceBooking['machine'], timeSlot: string) => boolean;
}

const FABLAB_MACHINES: ResourceBooking['machine'][] = ['Impressora 3D', 'Cortadora a Laser'];

const TIME_SLOTS = ['08:00-08:30', '09:30-10:00', '13:00-13:30', '14:30-15:00', '16:00-16:30'];

export const SkillTreeView: React.FC<SkillTreeViewProps> = ({
  skills,
  unlockedSkillIds,
  onUnlockSkill,
  bookings,
  onBookResource
}) => {
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(skills[0]);
  const [bookingMessage, setBookingMessage] = useState('');
  const [selectedMachine, setSelectedMachine] = useState<ResourceBooking['machine']>('Impressora 3D');
  const today = new Date().toISOString().slice(0, 10);

  const tiers: Array<{ key: SkillTier; label: string; color: string; desc: string }> = [
    { key: 'BASIC', label: 'Nível Básico', color: '#00ffaa', desc: 'Lógica unplugged e pensamento computacional' },
    { key: 'INTERMEDIATE', label: 'Nível Intermediário', color: '#00e1ff', desc: 'Programação em blocos (Scratch/Code.org)' },
    { key: 'ADVANCED', label: 'Nível Avançado', color: '#ffb700', desc: 'Eletrônica inicial, Micro:bit e Lego' },
    { key: 'SPECIALIST', label: 'Nível Especialista', color: '#ff007f', desc: 'Microcontroladores ESP8266/Arduino, Impressora 3D e Cortadora Laser' }
  ];

  const isUnlocked = (id: string) => unlockedSkillIds.includes(id);

  const canUnlock = (node: SkillNode) => {
    if (isUnlocked(node.id)) return false;
    if (node.prerequisites.length === 0) return true;
    return node.prerequisites.every((req) => unlockedSkillIds.includes(req));
  };

  const handleUnlockClick = (node: SkillNode) => {
    if (canUnlock(node)) {
      soundEngine.playLevelUp();
      onUnlockSkill(node.id);
    } else {
      soundEngine.playErrorBeep();
    }
  };

  const isSlotTaken = (machine: ResourceBooking['machine'], timeSlot: string) =>
    bookings.some((b) => b.machine === machine && b.date === today && b.timeSlot === timeSlot);

  const handleBook = (machine: ResourceBooking['machine'], timeSlot: string) => {
    const success = onBookResource(machine, timeSlot);
    if (success) {
      soundEngine.playItemCollect();
      setBookingMessage(`✅ Reserva confirmada: ${machine} às ${timeSlot}!`);
    } else {
      soundEngine.playErrorBeep();
      setBookingMessage(`⚠️ Esse horário já foi reservado por outra guilda. Escolha outro.`);
    }
    setTimeout(() => setBookingMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="pixel-box pixel-box-green p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-pixel text-lg text-[#00ffaa] flex items-center gap-2">
            <GitFork className="w-5 h-5" /> ÁRVORE DE HABILIDADES STEAM (SKILL TREE)
          </h2>
          <p className="font-body text-xs text-slate-300 mt-1">
            Conquiste o domínio técnico passo a passo para destravar placas avançadas e maquinário do laboratório físico.
          </p>
        </div>
      </div>

      {/* Tier Timeline Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {tiers.map((t) => {
          const tierSkills = skills.filter((s) => s.tier === t.key);
          return (
            <div key={t.key} className="pixel-box p-4 bg-[#121626] space-y-3">
              <div className="border-b-2 pb-2" style={{ borderColor: t.color }}>
                <h3 className="font-pixel text-xs uppercase" style={{ color: t.color }}>{t.label}</h3>
                <p className="font-body text-[11px] text-slate-400 mt-0.5">{t.desc}</p>
              </div>

              <div className="space-y-3">
                {tierSkills.map((node) => {
                  const unlocked = isUnlocked(node.id);
                  const unlockable = canUnlock(node);
                  const isSelected = selectedSkill?.id === node.id;

                  if (node.isSecretNode && !unlocked) {
                    return (
                      <div
                        key={node.id}
                        className="bg-[#090c15] p-3 border-2 border-dashed border-pink-500/50 opacity-70"
                      >
                        <div className="flex items-center gap-2">
                          <HelpCircle className="w-5 h-5 text-pink-500 animate-pulse" />
                          <div>
                            <p className="font-pixel text-xs text-pink-400">??? [NÓ OCULTO]</p>
                            <p className="font-mono text-[9px] text-slate-400">{node.secretHint}</p>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={node.id}
                      onClick={() => {
                        soundEngine.playItemCollect();
                        setSelectedSkill(node);
                      }}
                      className={`p-3 border-2 transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-[#00e1ff] bg-[#1a2238]'
                          : unlocked
                          ? 'border-[#00ffaa] bg-[#161b2e]'
                          : unlockable
                          ? 'border-[#ffb700] bg-[#090c15] hover:bg-[#161b2e]'
                          : 'border-slate-700 bg-[#090c15] opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{node.icon}</span>
                          <div>
                            <h4 className="font-pixel text-xs text-white">{node.title}</h4>
                            <p className="font-mono text-[9px] text-slate-400">Cat: {node.category}</p>
                          </div>
                        </div>

                        {unlocked ? (
                          <CheckCircle2 className="w-5 h-5 text-[#00ffaa]" />
                        ) : unlockable ? (
                          <Unlock className="w-5 h-5 text-[#ffb700] animate-bounce" />
                        ) : (
                          <Lock className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Skill Details & Machine Booking Drawer */}
      {selectedSkill && (
        <div className="pixel-box p-6 bg-[#161b2e] border-2 border-[#00e1ff] grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 bg-[#090c15] border border-[#00e1ff]">{selectedSkill.icon}</span>
              <div>
                <h3 className="font-pixel text-base text-[#00e1ff]">{selectedSkill.title}</h3>
                <p className="font-mono text-xs text-slate-400">Tier: {selectedSkill.tier} | Categoria: {selectedSkill.category}</p>
              </div>
            </div>

            <p className="font-body text-sm text-slate-300 leading-relaxed bg-[#090c15] p-3 border border-[#2e3859]">
              {selectedSkill.description}
            </p>

            {/* Hardware Unlocked */}
            {selectedSkill.hardwareUnlocked && selectedSkill.hardwareUnlocked.length > 0 && (
              <div className="bg-[#090c15] p-3 border border-[#00ffaa]/40">
                <p className="font-pixel text-xs text-[#00ffaa] flex items-center gap-1.5 mb-1">
                  <Cpu className="w-4 h-4" /> Hardware Liberado para Uso:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedSkill.hardwareUnlocked.map((hw) => (
                    <span key={hw} className="font-mono text-xs bg-[#00ffaa]/20 text-[#00ffaa] px-2 py-0.5 border border-[#00ffaa]">
                      {hw.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action & Booking */}
          <div className="flex flex-col justify-between bg-[#090c15] p-4 border border-[#2e3859]">
            <div>
              <h4 className="font-pixel text-xs text-slate-300 mb-2">STATUS DE BLOQUEIO:</h4>
              {isUnlocked(selectedSkill.id) ? (
                <div className="font-mono text-xs text-[#00ffaa] flex items-center gap-1.5 mb-4">
                  <CheckCircle2 className="w-4 h-4" /> Habilidade Conquistada!
                </div>
              ) : canUnlock(selectedSkill) ? (
                <button
                  onClick={() => handleUnlockClick(selectedSkill)}
                  className="w-full pixel-btn pixel-btn-primary justify-center mb-4"
                >
                  DESBLOQUEAR HABILIDADE
                </button>
              ) : (
                <div className="font-mono text-xs text-slate-500 flex items-center gap-1.5 mb-4">
                  <Lock className="w-4 h-4" /> Pré-requisitos Pendentes
                </div>
              )}

              {/* Machine Booking if Specialist */}
              {selectedSkill.allowsResourceBooking && isUnlocked(selectedSkill.id) && (
                <div className="space-y-2 pt-2 border-t border-[#2e3859]">
                  <p className="font-pixel text-[10px] text-[#ff007f] flex items-center gap-1">
                    <Printer className="w-3.5 h-3.5" /> RESERVA DE MAQUINÁRIO FABLAB:
                  </p>

                  {/* Machine Selector */}
                  <div className="flex gap-2">
                    {FABLAB_MACHINES.map((machine) => (
                      <button
                        key={machine}
                        onClick={() => {
                          soundEngine.playItemCollect();
                          setSelectedMachine(machine);
                        }}
                        className={`flex-1 font-mono text-[10px] p-2 border ${
                          selectedMachine === machine
                            ? 'bg-[#ff007f]/20 border-[#ff007f] text-[#ff007f]'
                            : 'bg-[#161b2e] border-slate-700 text-slate-300 hover:border-[#ff007f]'
                        }`}
                      >
                        {machine === 'Impressora 3D' ? '🖨️' : '⚡'} {machine}
                      </button>
                    ))}
                  </div>

                  {/* Time Slot Grid */}
                  <div className="grid grid-cols-1 gap-1.5 pt-1">
                    {TIME_SLOTS.map((slot) => {
                      const taken = isSlotTaken(selectedMachine, slot);
                      return (
                        <button
                          key={slot}
                          disabled={taken}
                          onClick={() => handleBook(selectedMachine, slot)}
                          className={`w-full text-left font-mono text-xs p-2 border ${
                            taken
                              ? 'bg-[#090c15] border-slate-700 text-slate-500 cursor-not-allowed line-through'
                              : 'bg-[#161b2e] hover:bg-[#ff007f]/20 border-[#ff007f] text-slate-200'
                          }`}
                        >
                          {taken ? `🔒 ${slot} — Ocupado` : `🕒 ${slot} — Reservar`}
                        </button>
                      );
                    })}
                  </div>

                  {bookingMessage && (
                    <p className="font-mono text-[11px] text-[#00ffaa] mt-1">{bookingMessage}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
