import React from 'react';

interface ErrorStateProps {
  title?: string;
  message: string;
}

// Shared visual shape for "a Firestore read failed" states — used wherever
// an onSnapshot/getDoc error previously left the screen stuck on a loading
// spinner forever (AuthContext profile subscription, ClassLayout/
// GmDashboardPage class subscription).
export const ErrorState: React.FC<ErrorStateProps> = ({ title = 'Não foi possível carregar', message }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-stem-mist text-center gap-3 px-4">
    <span className="text-5xl">⚠️</span>
    <h1 className="font-display font-extrabold text-xl text-stem-ink">{title}</h1>
    <p className="font-body-stem text-sm text-stem-ink-soft max-w-sm">{message}</p>
    <button
      onClick={() => window.location.reload()}
      className="mt-2 rounded-xl bg-stem-teal text-white font-display font-semibold px-4 py-2 hover:opacity-90"
    >
      Recarregar
    </button>
  </div>
);
