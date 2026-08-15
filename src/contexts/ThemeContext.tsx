import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadState, saveState, namespacedKey } from '../services/persistence';

export type ThemeMode = 'stem' | 'hacker';

interface ThemeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_KEY = namespacedKey('themeMode');

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => loadState<ThemeMode>(THEME_KEY, 'stem'));

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    saveState(THEME_KEY, mode);
  }, [mode]);

  const setMode = (next: ThemeMode) => setModeState(next);
  const toggleMode = () => setModeState((prev) => (prev === 'stem' ? 'hacker' : 'stem'));

  return <ThemeContext.Provider value={{ mode, toggleMode, setMode }}>{children}</ThemeContext.Provider>;
};

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
