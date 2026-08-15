import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Key } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { joinClassByPasscode } from '../../services/classRepo';
import { Card } from '../../components/stem/Card';
import { Button } from '../../components/stem/Button';

export const OnboardingView: React.FC = () => {
  const { profile, loading } = useAuth();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (loading || !profile) return null;
  const hasAnyClass = profile.classIdsAsGameMaster.length > 0 || profile.classIdsAsStudent.length > 0;
  if (hasAnyClass) return <Navigate to="/app" replace />;
  // A school admin with no class membership of their own has nowhere to go
  // in /app (which is entirely class-scoped) — send them straight to their
  // admin dashboard instead of stranding them on a "join a class" form.
  if (profile.schoolAdminOf.length > 0) {
    return <Navigate to={`/admin/${profile.schoolAdminOf[0]}`} replace />;
  }

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const classRoom = await joinClassByPasscode(profile.uid, passcode.trim());
      window.location.href = `/app/${classRoom.id}/trilha`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Código inválido.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-stem-mist flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 text-center">
        <span className="text-5xl">{profile.avatarConfig.head}</span>
        <h1 className="font-display font-extrabold text-2xl text-stem-ink">
          Bem-vindo(a), {profile.adventureName}!
        </h1>
        <p className="font-body-stem text-sm text-stem-ink-soft">
          Você ainda não faz parte de nenhuma turma. Peça o código de sala ao seu Game Master (professor) para
          entrar.
        </p>

        <Card accent="violet">
          <form onSubmit={handleJoin} className="space-y-4">
            <input
              required
              placeholder="IZI-9482"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value.toUpperCase())}
              className="w-full rounded-xl border-2 border-stem-line px-3 py-2.5 text-center font-display font-bold tracking-widest outline-none focus:border-stem-violet"
            />
            {error && <p className="text-sm text-stem-coral font-body-stem">{error}</p>}
            <Button type="submit" fullWidth disabled={busy}>
              <Key className="w-4 h-4" /> Entrar na turma
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
