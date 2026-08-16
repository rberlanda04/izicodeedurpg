import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { LogIn, Key } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { signInWithEmail, signInWithGoogle, joinRoomAsGuest } from '../../services/authRepo';
import { describeAuthError } from '../../services/authErrors';
import { Card } from '../../components/stem/Card';
import { Button } from '../../components/stem/Button';

export const LoginView: React.FC = () => {
  const { firebaseUser, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const [showPasscode, setShowPasscode] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [adventureName, setAdventureName] = useState('');

  if (!loading && firebaseUser) return <Navigate to="/app" replace />;

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await signInWithEmail(email, password);
    } catch (err) {
      setError(describeAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setBusy(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(describeAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  const handlePasscodeJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await joinRoomAsGuest(passcode.trim().toUpperCase(), adventureName.trim() || 'Aventureiro');
    } catch (err) {
      setError(err instanceof Error && !('code' in err) ? err.message : describeAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-stem-mist flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <img src="/marketing/rpgmaker-logo.png" alt="Izicode Maker RPG" className="h-12 w-auto object-contain mx-auto" />
          <p className="font-body-stem text-sm text-stem-ink-soft">Sua jornada STEAM começa aqui.</p>
        </div>

        <Card accent="teal">
          {!showPasscode ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block font-display text-xs font-bold text-stem-ink-soft mb-1">EMAIL</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border-2 border-stem-line px-3 py-2.5 font-body-stem outline-none focus:border-stem-teal"
                />
              </div>
              <div>
                <label className="block font-display text-xs font-bold text-stem-ink-soft mb-1">SENHA</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border-2 border-stem-line px-3 py-2.5 font-body-stem outline-none focus:border-stem-teal"
                />
              </div>
              {error && <p className="text-sm text-stem-coral font-body-stem">{error}</p>}
              <Button type="submit" fullWidth disabled={busy}>
                <LogIn className="w-4 h-4" /> Entrar
              </Button>
              <Button type="button" variant="ghost" fullWidth onClick={handleGoogle} disabled={busy}>
                Entrar com Google
              </Button>
              <button
                type="button"
                onClick={() => setShowPasscode(true)}
                className="w-full text-center text-sm font-display font-semibold text-stem-teal hover:underline"
              >
                Sou aluno e tenho um código de sala →
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasscodeJoin} className="space-y-4">
              <div>
                <label className="block font-display text-xs font-bold text-stem-ink-soft mb-1">
                  CÓDIGO DA SALA
                </label>
                <input
                  required
                  placeholder="IZI-9482"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value.toUpperCase())}
                  className="w-full rounded-xl border-2 border-stem-line px-3 py-2.5 font-body-stem tracking-widest text-center font-bold outline-none focus:border-stem-teal"
                />
              </div>
              <div>
                <label className="block font-display text-xs font-bold text-stem-ink-soft mb-1">
                  SEU NOME DE AVENTUREIRO
                </label>
                <input
                  required
                  placeholder="Ex: CyberKnight_99"
                  value={adventureName}
                  onChange={(e) => setAdventureName(e.target.value)}
                  className="w-full rounded-xl border-2 border-stem-line px-3 py-2.5 font-body-stem outline-none focus:border-stem-teal"
                />
              </div>
              {error && <p className="text-sm text-stem-coral font-body-stem">{error}</p>}
              <Button type="submit" fullWidth disabled={busy}>
                <Key className="w-4 h-4" /> Entrar na sala
              </Button>
              <button
                type="button"
                onClick={() => setShowPasscode(false)}
                className="w-full text-center text-sm font-display font-semibold text-stem-ink-soft hover:underline"
              >
                ← Voltar para login com email
              </button>
            </form>
          )}
        </Card>

        {!showPasscode && (
          <p className="text-center font-body-stem text-sm text-stem-ink-soft">
            Ainda não tem conta?{' '}
            <Link to="/cadastro" className="text-stem-teal font-semibold hover:underline">
              Cadastre-se
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};
