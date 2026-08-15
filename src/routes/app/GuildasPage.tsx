import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, Crown, PlusCircle, Wand2 } from 'lucide-react';
import { Card } from '../../components/stem/Card';
import { Button } from '../../components/stem/Button';
import { useAuth } from '../../contexts/AuthContext';
import { generateGuildIdentityWithAI } from '../../services/aiContentService';
import type { ClassOutletContext } from './ClassLayout';

export const GuildasPage: React.FC = () => {
  const { guilds, handleJoinGuild, handleCreateGuild } = useOutletContext<ClassOutletContext>();
  const { profile } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [motto, setMotto] = useState('');
  const [canvaLink, setCanvaLink] = useState('');
  const [theme, setTheme] = useState('');
  const [suggesting, setSuggesting] = useState(false);
  const [aiUnavailable, setAiUnavailable] = useState(false);

  const handleSuggest = async () => {
    setSuggesting(true);
    setAiUnavailable(false);
    try {
      const suggestion = await generateGuildIdentityWithAI(theme || 'robótica e tecnologia');
      setName(suggestion.name);
      setMotto(suggestion.motto);
    } catch {
      setAiUnavailable(true);
    } finally {
      setSuggesting(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-stem-ink">Guildas</h1>
          <p className="font-body-stem text-sm text-stem-ink-soft">Trabalho em equipe com papéis de Scrum.</p>
        </div>
        {!profile.guildId && (
          <Button onClick={() => setShowCreate(true)}>
            <PlusCircle className="w-4 h-4" /> Fundar guilda
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {guilds
          .sort((a, b) => b.score - a.score)
          .map((g, idx) => (
            <Card key={g.id} accent={g.id === profile.guildId ? 'teal' : 'none'}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-display font-bold text-stem-amber">#{idx + 1} · {g.score} pts</p>
                  <h3 className="font-display font-extrabold text-lg text-stem-ink">{g.name}</h3>
                  <p className="text-sm font-body-stem text-stem-ink-soft italic">"{g.motto}"</p>
                </div>
                <Crown className="w-6 h-6 text-stem-amber shrink-0" />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Users className="w-4 h-4 text-stem-ink-soft" />
                <div className="flex -space-x-2">
                  {g.members.map((m) => (
                    <span
                      key={m.uid}
                      title={`${m.name} · ${m.role}`}
                      className="w-8 h-8 rounded-full bg-stem-mist border-2 border-stem-cloud flex items-center justify-center text-sm"
                    >
                      {m.avatarHead}
                    </span>
                  ))}
                </div>
              </div>
              {!profile.guildId && (
                <Button
                  variant="ghost"
                  fullWidth
                  className="mt-4"
                  onClick={() => handleJoinGuild(g.id, 'DEVELOPER')}
                >
                  Entrar nesta guilda
                </Button>
              )}
            </Card>
          ))}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 bg-stem-ink/40 backdrop-blur-sm flex items-center justify-center p-4">
          <Card accent="teal" className="w-full max-w-md">
            <h3 className="font-display font-extrabold text-stem-ink mb-4">Fundar nova guilda</h3>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!name.trim()) return;
                handleCreateGuild(name, motto, canvaLink);
                setShowCreate(false);
              }}
            >
              <div className="flex gap-2">
                <input
                  placeholder="Tema (ex: energia limpa, espaço...)"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="flex-1 rounded-xl border-2 border-stem-line px-3 py-2.5 font-body-stem outline-none focus:border-stem-teal"
                />
                <Button type="button" variant="ghost" onClick={handleSuggest} disabled={suggesting}>
                  <Wand2 className="w-4 h-4" /> {suggesting ? 'Pensando...' : 'Sugerir com IA'}
                </Button>
              </div>
              {aiUnavailable && (
                <p className="text-xs font-body-stem text-stem-ink-soft">
                  Sugestão por IA indisponível no momento — preencha manualmente.
                </p>
              )}
              <input
                required
                placeholder="Nome da guilda"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border-2 border-stem-line px-3 py-2.5 font-body-stem outline-none focus:border-stem-teal"
              />
              <input
                placeholder="Lema da guilda"
                value={motto}
                onChange={(e) => setMotto(e.target.value)}
                className="w-full rounded-xl border-2 border-stem-line px-3 py-2.5 font-body-stem outline-none focus:border-stem-teal"
              />
              <input
                placeholder="Link do Canva/Figma (identidade visual)"
                value={canvaLink}
                onChange={(e) => setCanvaLink(e.target.value)}
                className="w-full rounded-xl border-2 border-stem-line px-3 py-2.5 font-body-stem outline-none focus:border-stem-teal"
              />
              <div className="flex gap-3">
                <Button type="button" variant="ghost" fullWidth onClick={() => setShowCreate(false)}>
                  Cancelar
                </Button>
                <Button type="submit" fullWidth>
                  Fundar
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
