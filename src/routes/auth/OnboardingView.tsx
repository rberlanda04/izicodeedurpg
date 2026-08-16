import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Key, School } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { joinClassByPasscode } from '../../services/classRepo';
import { createSchoolAsTeacher } from '../../services/onboardService';
import { Card } from '../../components/stem/Card';
import { Button } from '../../components/stem/Button';

export const OnboardingView: React.FC = () => {
  const { firebaseUser, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const [schoolName, setSchoolName] = useState('');
  const [city, setCity] = useState('');
  const [schoolError, setSchoolError] = useState('');
  const [schoolBusy, setSchoolBusy] = useState(false);

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
      navigate(`/app/${classRoom.id}/trilha`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Código inválido.');
    } finally {
      setBusy(false);
    }
  };

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) return;
    setSchoolError('');
    setSchoolBusy(true);
    try {
      const result = await createSchoolAsTeacher(firebaseUser, schoolName.trim(), city.trim());
      navigate(`/admin/${result.schoolId}`);
    } catch (err) {
      setSchoolError(err instanceof Error ? err.message : 'Não foi possível cadastrar a escola.');
    } finally {
      setSchoolBusy(false);
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
              placeholder="IZI-7K4QXP"
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

        {/* Anonymous (room-code guest) sessions can't create a school — the
            server rejects that token, so hide the option instead of letting
            it fail. */}
        {firebaseUser && !firebaseUser.isAnonymous && (
          <>
            <p className="font-body-stem text-xs font-bold uppercase tracking-wide text-stem-ink-soft">ou</p>
            <Card accent="teal">
              <p className="font-display font-bold text-sm text-stem-ink mb-3">
                Sou professor(a) e quero cadastrar minha escola
              </p>
              <form onSubmit={handleCreateSchool} className="space-y-3">
                <input
                  required
                  placeholder="Nome da escola"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full rounded-xl border-2 border-stem-line px-3 py-2.5 font-body-stem outline-none focus:border-stem-teal"
                />
                <input
                  placeholder="Cidade (opcional)"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border-2 border-stem-line px-3 py-2.5 font-body-stem outline-none focus:border-stem-teal"
                />
                {schoolError && <p className="text-sm text-stem-coral font-body-stem">{schoolError}</p>}
                <Button type="submit" fullWidth variant="secondary" disabled={schoolBusy}>
                  <School className="w-4 h-4" /> Cadastrar escola
                </Button>
              </form>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
