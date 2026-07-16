/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authRepository } from '@/data/repositories';
import { tokenStorage } from '@/lib/apiClient';
import type { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(() => Boolean(tokenStorage.get()));
  const logout = useCallback(() => { tokenStorage.clear(); setUser(null); }, []);
  const refreshProfile = useCallback(async () => { setUser(await authRepository.profile()); }, []);

  useEffect(() => {
    const controller = new AbortController();
    if (tokenStorage.get()) {
      void authRepository.profile(controller.signal)
        .then((profile) => {
          if (controller.signal.aborted) return;
          if (profile.role === 'CITIZEN') { tokenStorage.clear(); setUser(null); return; }
          setUser(profile);
        })
        .catch(() => { if (!controller.signal.aborted) { tokenStorage.clear(); setUser(null); } })
        .finally(() => { if (!controller.signal.aborted) setInitializing(false); });
    }
    return () => controller.abort();
  }, []);

  useEffect(() => {
    window.addEventListener('netrak:session-expired', logout);
    return () => window.removeEventListener('netrak:session-expired', logout);
  }, [logout]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authRepository.login(email, password);
    if (response.user.role === 'CITIZEN') {
      throw new Error('Citizen accounts must use the Netrak citizen application.');
    }
    tokenStorage.set(response.token);
    setUser(response.user);
    return response.user;
  }, []);
  const value = useMemo(() => ({ user, initializing, login, logout, refreshProfile }), [user, initializing, login, logout, refreshProfile]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
