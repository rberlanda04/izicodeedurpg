import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import './index.css';
import './styles/pixel.css';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { router } from './router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
    {/* Vercel Analytics: agregado, sem cookies, sem PII — não é o mesmo
        risco de LGPD que o Firebase Analytics (deixado de fora de
        propósito nesta base, ver PLANO_DESENVOLVIMENTO.md seção 12.4). */}
    <Analytics />
  </StrictMode>
);
