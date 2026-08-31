import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Palette } from 'lucide-react';
import { Card } from '../../components/stem/Card';
import { Button } from '../../components/stem/Button';
import { useAuth } from '../../contexts/AuthContext';
import { ALL_AVATAR_PRESETS } from '../../data/avatarPresets';
import type { ClassOutletContext } from './ClassLayout';

export const PerfilPage: React.FC = () => {
  const { handleSignContract, handleUpdateAvatar } = useOutletContext<ClassOutletContext>();
  const { profile } = useAuth();
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  if (!profile) return null;

  const xpPercent = Math.min(100, Math.round((profile.xp / profile.xpToNextLevel) * 100));

  return (
    <div className="space-y-6">
      <Card accent="teal">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <button
            onClick={() => setShowAvatarPicker(true)}
            className="relative shrink-0 rounded-3xl overflow-hidden bg-stem-mist hover:ring-4 hover:ring-stem-teal/30 transition-all"
            title="Trocar avatar"
          >
            {profile.avatarConfig.imageUrl ? (
              <img src={profile.avatarConfig.imageUrl} alt="Seu avatar" className="w-24 h-24 object-cover" />
            ) : (
              <span className="text-6xl p-4 block">{profile.avatarConfig.head}</span>
            )}
          </button>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="font-display font-extrabold text-2xl text-stem-ink">{profile.adventureName}</h1>
            <p className="text-xs font-body-stem text-stem-ink-soft">
              Nome real: {profile.realName || '—'} (visível apenas ao Game Master)
            </p>
            <div className="flex items-center gap-3 mt-3 justify-center sm:justify-start">
              <span className="text-sm font-display font-bold text-stem-amber">Nível {profile.level}</span>
              <span className="text-sm font-display font-bold text-stem-amber">🪙 {profile.izicoins}</span>
            </div>
            <div className="h-2 rounded-full bg-stem-mist overflow-hidden mt-2 max-w-xs mx-auto sm:mx-0">
              <div className="h-full bg-stem-violet rounded-full" style={{ width: `${xpPercent}%` }} />
            </div>
            <p className="text-xs font-body-stem text-stem-ink-soft mt-1">
              {profile.xp} / {profile.xpToNextLevel} XP
            </p>
            <Button variant="ghost" className="mt-3" onClick={() => setShowAvatarPicker(true)}>
              <Palette className="w-4 h-4" /> Trocar avatar
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="font-display font-bold text-stem-ink mb-4">Galeria de badges ({profile.badges.length})</h3>
        {profile.badges.length === 0 ? (
          <p className="text-sm font-body-stem text-stem-ink-soft text-center py-4">
            Nenhuma conquista ainda — complete missões, desbloqueie habilidades e forme guildas para começar a coleção.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {profile.badges.map((b) => (
              <div key={b.id} className="rounded-2xl bg-stem-mist p-3 text-center">
                {b.icon.startsWith('/') ? (
                  <img src={b.icon} alt={b.name} className="w-12 h-12 mx-auto" />
                ) : (
                  <span className="text-2xl">{b.icon}</span>
                )}
                <p className="text-xs font-display font-bold text-stem-ink mt-1">{b.name}</p>
                <p className="text-[11px] font-body-stem text-stem-ink-soft">{b.description}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card accent="violet">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-stem-ink flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-stem-violet" /> Pacto dos Heróis (LGPD)
          </h3>
          {profile.heroContractSigned && (
            <span className="flex items-center gap-1 text-stem-teal text-sm font-display font-bold">
              <CheckCircle2 className="w-4 h-4" /> Assinado
            </span>
          )}
        </div>
        <ul className="text-sm font-body-stem text-stem-ink-soft mt-3 space-y-1 list-disc list-inside">
          <li>Seu nome real só é visível ao seu Game Master.</li>
          <li>Sua guilda usa codinomes públicos nos placares e eventos.</li>
        </ul>
        {!profile.heroContractSigned && (
          <Button className="mt-4" onClick={handleSignContract}>
            Assinar pacto (+100 XP)
          </Button>
        )}
      </Card>

      {showAvatarPicker && (
        <div className="fixed inset-0 z-50 bg-stem-ink/40 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-lg space-y-4">
            <h3 className="font-display font-bold text-stem-ink">Escolha seu avatar</h3>
            <div className="grid grid-cols-4 gap-3">
              {ALL_AVATAR_PRESETS.map((preset) => {
                const isImage = preset.kind === 'image';
                const isSelected = isImage
                  ? profile.avatarConfig.imageUrl === preset.imageUrl
                  : !profile.avatarConfig.imageUrl && profile.avatarConfig.head === preset.head;
                return (
                  <button
                    key={preset.label}
                    onClick={() => {
                      handleUpdateAvatar(
                        isImage
                          ? { ...profile.avatarConfig, imageUrl: preset.imageUrl }
                          : {
                              head: preset.head,
                              body: preset.body,
                              accessory: preset.accessory,
                              color: preset.color,
                              imageUrl: undefined
                            }
                      );
                      setShowAvatarPicker(false);
                    }}
                    className={`rounded-2xl overflow-hidden border-2 transition-colors ${
                      isSelected ? 'border-stem-teal' : 'border-stem-line hover:border-stem-teal/50'
                    }`}
                    title={preset.label}
                  >
                    {isImage ? (
                      <img src={preset.imageUrl} alt={preset.label} className="w-full aspect-square object-cover" />
                    ) : (
                      <span className="w-full aspect-square flex items-center justify-center text-3xl bg-stem-mist">
                        {preset.head}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <Button variant="ghost" fullWidth onClick={() => setShowAvatarPicker(false)}>
              Cancelar
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};
