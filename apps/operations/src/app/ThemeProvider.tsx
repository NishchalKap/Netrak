/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type Theme = 'dark' | 'light';
type ThemePreference = Theme | 'system';
interface ThemeContextValue { theme: Theme; preference: ThemePreference; toggleTheme: () => void }
const ThemeContext = createContext<ThemeContextValue | null>(null);
const THEME_KEY = 'netrak.operations.theme';

function readPreference(): ThemePreference {
  const stored = localStorage.getItem(THEME_KEY);
  return stored === 'light' || stored === 'system' ? stored : 'dark';
}

function readSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>(readPreference);
  const [systemTheme, setSystemTheme] = useState<Theme>(readSystemTheme);
  const theme = preference === 'system' ? systemTheme : preference;

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: light)');
    const updateSystemTheme = (event: MediaQueryListEvent) => setSystemTheme(event.matches ? 'light' : 'dark');
    query.addEventListener('change', updateSystemTheme);
    return () => query.removeEventListener('change', updateSystemTheme);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem(THEME_KEY, preference);
  }, [preference, theme]);

  const toggleTheme = useCallback(() => {
    setPreference((current) => current === 'dark' ? 'light' : current === 'light' ? 'system' : 'dark');
  }, []);
  const value = useMemo(() => ({ theme, preference, toggleTheme }), [preference, theme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
}
