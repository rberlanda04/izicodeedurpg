import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { signUpWithEmail } from '../../services/authRepo';
import { describeAuthError } from '../../services/authErrors';
import { Card } from '../../components/stem/Card';
import { Button } from '../../components/stem/Button';

export const RegisterView: React.FC = () => {
  const { firebaseUser, loading } = useAuth();
  const [adventureName, setAdventureName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!loading && firebaseUser) return <Navigate to="/app" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    setBusy(true);
    try {
      await signUpWithEmail(email, password, adventureName.trim());
    } catch (err) {
      setError(describeAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-stem-mist flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <img src="/marketing/rpgmaker-logo.png" alt="Izicode Maker RPG" className="h-10 w-auto object-contain mx-auto" />
          <h1 className="font-display font-extrabold text-2xl text-stem-ink">Criar sua conta</h1>
          <p className="font-body-stem text-sm text-stem-ink-soft">Comece sua jornada de aventureiro STEAM.</p>
        </div>

        <Card accent="coral">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-display text-xs font-bold text-stem-ink-soft mb-1">
                NOME DE AVENTUREIRO
              </label>
              <input
                required
                placeholder="Ex: CyberKnight_99"
                value={adventureName}
                onChange={(e) => setAdventureName(e.target.value)}
                className="w-full rounded-xl border-2 border-stem-line px-3 py-2.5 font-body-stem outline-none focus:border-stem-coral"
              />
              <p className="text-xs font-body-stem text-stem-ink-soft mt-1">
                É o nome público que colegas veem — seu nome real fica visível só ao Game Master.
              </p>
            </div>
            <div>
              <label className="block font-display text-xs font-bold text-stem-ink-soft mb-1">EMAIL</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border-2 border-stem-line px-3 py-2.5 font-body-stem outline-none focus:border-stem-coral"
              />
            </div>
            <div>
              <label className="block font-display text-xs font-bold text-stem-ink-soft mb-1">SENHA</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border-2 border-stem-line px-3 py-2.5 font-body-stem outline-none focus:border-stem-coral"
              />
            </div>
            {error && <p className="text-sm text-stem-coral font-body-stem">{error}</p>}
            <Button type="submit" variant="secondary" fullWidth disabled={busy}>
              <UserPlus className="w-4 h-4" /> Criar conta
            </Button>
          </form>
        </Card>

        <p className="text-center font-body-stem text-sm text-stem-ink-soft">
          Já tem conta?{' '}
          <Link to="/entrar" className="text-stem-teal font-semibold hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
};
